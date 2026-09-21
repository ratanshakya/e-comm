'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CreditCard,
  QrCode,
  Banknote,
  Lock,
  Heart,
  AlertCircle
} from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { OrderCustomer } from '@/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, discount, couponCode, clearCart } = useCart();
  const { user, mutate } = useAuth();

  const [checkoutStep, setCheckoutStep] = useState<1 | 2>(1);

  const [customer, setCustomer] = useState<OrderCustomer>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    specialNote: ''
  });

  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod' | 'upi' | 'card'>('online');
  const [siteSettings, setSiteSettings] = useState<any>(null);

  React.useEffect(() => {
    fetch('/api/settings', { cache: 'no-store' }).then(res => res.json()).then(data => {
       if (data.success) {
         setSiteSettings(data.data);
         if (!data.data.isRazorpayEnabled) {
           setPaymentMethod('upi');
         }
       }
    });
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null);
  const [accountPassword, setAccountPassword] = useState('');
  const [wrongPasswordError, setWrongPasswordError] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'error' | 'info' } | null>(null);
  const [loginModal, setLoginModal] = useState<{ open: boolean; email: string; firstName: string; password: string; loading: boolean; error: string }>({
    open: false, email: '', firstName: '', password: '', loading: false, error: ''
  });
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiTransactionId, setUpiTransactionId] = useState('');

  const showToast = (msg: string, type: 'error' | 'info' = 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleEmailBlur = async () => {
    if (user) return; // already logged in
    const email = customer.email.trim().toLowerCase();
    if (!email || !email.includes('@')) return;
    try {
      const res = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.exists) {
        setLoginModal({ open: true, email, firstName: data.firstName || '', password: '', loading: false, error: '' });
      }
    } catch { /* ignore */ }
  };

  const handleModalLogin = async () => {
    if (!loginModal.password) return;
    setLoginModal(prev => ({ ...prev, loading: true, error: '' }));
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginModal.email, password: loginModal.password }),
      });
      if (res.ok) {
        await mutate();
        setLoginModal(prev => ({ ...prev, open: false, loading: false }));
        showToast('Logged in successfully! You can now place your order.', 'info');
      } else {
        setLoginModal(prev => ({ ...prev, loading: false, error: 'Incorrect password. Please try again.' }));
      }
    } catch {
      setLoginModal(prev => ({ ...prev, loading: false, error: 'Something went wrong. Please try again.' }));
    }
  };

  // Auto-fill customer details if already logged in
  React.useEffect(() => {
    if (user) {
      setCustomer((prev) => ({
        ...prev,
        email: prev.email || user.email || '',
        fullName: prev.fullName || [user.firstName, user.lastName].filter(Boolean).join(' ') || user.shippingAddress?.fullName || '',
        phone: prev.phone || user.phone || user.shippingAddress?.phone || '',
        address: prev.address || user.address || user.shippingAddress?.address || '',
        city: prev.city || user.city || user.shippingAddress?.city || '',
        state: prev.state || user.state || user.shippingAddress?.state || '',
        pincode: prev.pincode || user.pincode || user.shippingAddress?.pincode || ''
      }));
    }
  }, [user]);

  const FREE_SHIPPING_THRESHOLD = siteSettings?.freeShippingThreshold ?? 999;
  const FLAT_SHIPPING_FEE = siteSettings?.flatShippingFee ?? 99;
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : FLAT_SHIPPING_FEE;
  const finalTotal = subtotal - discount + shippingFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!customer.fullName.trim()) {
      showToast('Please enter your full name (पूरा नाम दर्ज करें).');
      return;
    }
    if (!customer.phone.trim() || customer.phone.replace(/\D/g, '').length < 10) {
      showToast('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (!customer.email.trim() || !customer.email.includes('@')) {
      showToast('Please enter a valid email address.');
      return;
    }
    if (!user && (!accountPassword || accountPassword.length < 6)) {
      showToast('Please create a password (minimum 6 characters) to track your order.');
      return;
    }
    if (!customer.address.trim()) {
      showToast('Please enter your delivery address.');
      return;
    }
    if (!customer.city.trim()) {
      showToast('Please enter your city (शहर दर्ज करें).');
      return;
    }
    if (!customer.state.trim()) {
      showToast('Please enter your state (राज्य दर्ज करें).');
      return;
    }
    if (!customer.pincode.trim() || customer.pincode.replace(/\D/g, '').length < 6) {
      showToast('Please enter a valid 6-digit pincode.');
      return;
    }
    setCheckoutStep(2);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.phone || !customer.address || !customer.pincode) {
      showToast('Please fill all mandatory shipping address details.');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty. Please add items first.', 'info');
      return;
    }

    setIsSubmitting(true);

    try {
      let finalUserId = user?.id;

      // If user is not logged in but provided an email and password, register or login them first
      if (!user && customer.email && accountPassword) {
        const cleanEmail = customer.email.trim().toLowerCase();
        const authRes = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: cleanEmail,
            password: accountPassword,
            firstName: customer.fullName.split(' ')[0],
            lastName: customer.fullName.split(' ').slice(1).join(' ') || '',
          }),
        });

        if (authRes.ok) {
          const authData = await authRes.json();
          finalUserId = authData.user.id;
          await mutate(); // Refresh client AuthContext
        } else {
          const authError = await authRes.json();
          if (authError.error === 'User already exists') {
            // Try to log in with this password
            const loginRes = await fetch('/api/auth/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: cleanEmail,
                password: accountPassword,
              }),
            });
            if (loginRes.ok) {
              const loginData = await loginRes.json();
              finalUserId = loginData.user.id;
              setWrongPasswordError(false);
              await mutate(); // Refresh client AuthContext
            } else {
              // Account exists but password is wrong — show inline error with login link
              setWrongPasswordError(true);
              setIsSubmitting(false);
              setCheckoutStep(1);
              window.scrollTo({ top: 400, behavior: 'smooth' });
              return;
            }
          } else {
            showToast(authError.error || 'Failed to create account. Please try again.');
            setIsSubmitting(false);
            return;
          }
        }
      }

      const orderPayload: any = {
        userId: finalUserId,
        customer,
        items: cart.map((item) => ({
          productId: item.product.id,
          productName: item.product.name,
          size: item.selectedSize,
          price: item.product.price,
          quantity: item.quantity,
          image: item.product.images[0]
        })),
        subtotal,
        discount,
        shipping: shippingFee,
        total: finalTotal,
        paymentMethod,
        upiTransactionId
      };

      if (paymentMethod === 'upi' && !showUpiModal) {
        if (!siteSettings?.manualUpiId) {
          showToast('Manual UPI is not configured by the store currently.');
          setIsSubmitting(false);
          return;
        }
        setShowUpiModal(true);
        setIsSubmitting(false);
        return;
      }

      if (paymentMethod === 'online' && siteSettings?.isRazorpayEnabled) {
        // Load razorpay
        const res = await new Promise((resolve) => {
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.body.appendChild(script);
        });

        if (!res) {
          showToast('Failed to load Razorpay SDK. Please check your connection.');
          setIsSubmitting(false);
          return;
        }

        // Create order
        const createOrderRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalTotal }),
        });

        if (!createOrderRes.ok) {
          showToast('Failed to create payment order.');
          setIsSubmitting(false);
          return;
        }

        const rzpData = await createOrderRes.json();

        const options = {
          key: rzpData.key_id,
          amount: rzpData.amount,
          currency: rzpData.currency,
          name: siteSettings.storeName || 'BroCART',
          description: 'Payment for Order',
          order_id: rzpData.order_id,
          handler: async function (response: any) {
            orderPayload.razorpay_payment_id = response.razorpay_payment_id;
            orderPayload.razorpay_order_id = response.razorpay_order_id;
            orderPayload.razorpay_signature = response.razorpay_signature;

            const finalRes = await fetch('/api/orders', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(orderPayload),
            });
            handleOrderSuccess(finalRes);
          },
          prefill: {
            name: customer.fullName,
            email: customer.email,
            contact: customer.phone,
          },
          theme: {
            color: '#87D215',
          },
          modal: {
            ondismiss: function() {
              setIsSubmitting(false);
            }
          }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.on('payment.failed', function (response: any) {
          showToast(response.error.description || 'Payment Failed');
        });
        rzp.open();
        return; // Don't proceed to direct order creation
      }

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      // Direct order for COD/UPI
      await handleOrderSuccess(res);

    } catch (err) {
      console.error(err);
      showToast('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrderSuccess = async (res: Response) => {
    if (res.ok) {
      const data = await res.json();
      setPlacedOrderId(data.orderId || data?.data?.id || `KANHA-${Math.floor(100000 + Math.random() * 900000)}`);
      clearCart();
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger celebratory confetti
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#87D215', '#79BE10', '#000000', '#404040', '#D4D4D4']
        });
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    } else {
      showToast('Failed to place order. Please try again later.');
    }
  };

  // Order Confirmed Blessing Screen
  if (placedOrderId) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-black">
        <Navbar />
        <main className="flex-1 max-w-2xl mx-auto px-4 py-20 text-center flex flex-col items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[#87D215] text-black flex items-center justify-center mb-6 shadow-xl">
            <Sparkles className="w-10 h-10" />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#87D215]/15 border border-[#87D215]/40 text-xs font-bold text-black mb-3">
            <Heart className="w-3.5 h-3.5 fill-black text-black" />
            <span>राधे राधे! Order Confirmed</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold font-serif-royal text-black mb-2">
            Thakur Ji Seva Order Confirmed!
          </h1>
          <p className="text-neutral-600 text-sm max-w-md mx-auto mb-6">
            Your sacred parcel is being carefully prepared by our Vrindavan karigars with pure touch and blessed Tulsi prasad.
          </p>

          {customer.email && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 mb-6">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Devotee Account Active: Linked to <strong>{customer.email}</strong></span>
            </div>
          )}

          <div className="w-full bg-neutral-50 rounded-3xl p-6 border border-neutral-200 text-left space-y-3 mb-8 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-xs text-neutral-500">Order ID:</span>
              <span className="text-sm font-bold text-black">{placedOrderId}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-xs text-neutral-500">Devotee Name:</span>
              <span className="text-sm font-bold text-black">{customer.fullName}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-xs text-neutral-500">Delivery Coordinates:</span>
              <span className="text-xs text-right text-neutral-700 max-w-xs truncate">
                {customer.address}, {customer.city} ({customer.pincode})
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-neutral-500">Total Amount (कुल राशि):</span>
              <span className="text-base font-extrabold text-black">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
            <button
              onClick={() => router.push('/account?tab=orders')}
              className="luxury-black-btn px-8 py-3.5 rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Your Product & Orders (अपने उत्पाद व ऑर्डर देखें)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3.5 rounded-full font-bold text-sm text-neutral-700 hover:text-black border border-neutral-300 hover:bg-neutral-100 transition-all cursor-pointer"
            >
              Return to Storefront
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />

      {/* ── Toast Notification ── */}
      {toast && (
        <div
          style={{ animation: 'slideDownFade 0.3s ease' }}
          className={`fixed top-5 left-1/2 z-[9999] -translate-x-1/2 flex items-start gap-3 px-5 py-3.5 rounded-2xl shadow-2xl max-w-sm w-[92vw] ${
            toast.type === 'error'
              ? 'bg-black text-white'
              : 'bg-neutral-800 text-white'
          }`}
        >
          <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-red-400" />
          <p className="text-sm leading-snug font-medium">{toast.msg}</p>
          <button
            onClick={() => setToast(null)}
            className="ml-auto text-white/50 hover:text-white text-lg leading-none cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      <style>{`
        @keyframes slideDownFade {
          from { opacity: 0; transform: translate(-50%, -12px); }
          to   { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      {/* ── Login Modal ── */}
      {loginModal.open && (
        <div
          className="fixed inset-0 z-[10000] flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setLoginModal(prev => ({ ...prev, open: false }))}
        >
          <div
            style={{ animation: 'modalSlideUp 0.3s cubic-bezier(.22,.68,0,1.2)' }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 relative"
            onClick={e => e.stopPropagation()}
          >
            {/* Close */}
            <button
              onClick={() => setLoginModal(prev => ({ ...prev, open: false }))}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-500 hover:text-black cursor-pointer transition-colors"
            >
              ×
            </button>

            {/* Avatar / Icon */}
            <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center mb-5 mx-auto">
              <Lock className="w-6 h-6 text-white" />
            </div>

            <h2 className="text-xl font-black text-black text-center mb-1">
              Welcome back{loginModal.firstName ? `, ${loginModal.firstName}` : ''}! 👋
            </h2>
            <p className="text-sm text-neutral-500 text-center mb-6 leading-snug">
              An account already exists for <strong className="text-black">{loginModal.email}</strong>.
              <br />Enter your password to log in and continue.
            </p>

            {/* Password Input */}
            <div className="space-y-3">
              <input
                id="modal-login-password"
                type="password"
                autoFocus
                value={loginModal.password}
                onChange={e => setLoginModal(prev => ({ ...prev, password: e.target.value, error: '' }))}
                onKeyDown={e => { if (e.key === 'Enter') handleModalLogin(); }}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-black outline-none transition-colors ${
                  loginModal.error ? 'border-red-400 bg-red-50' : 'border-neutral-300 focus:border-black bg-neutral-50'
                }`}
              />

              {loginModal.error && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {loginModal.error}
                </div>
              )}

              <button
                onClick={handleModalLogin}
                disabled={loginModal.loading || !loginModal.password}
                className="w-full py-3 rounded-xl bg-black text-white font-bold text-sm hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                {loginModal.loading ? (
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                {loginModal.loading ? 'Logging in…' : 'Login & Continue'}
              </button>

              <p className="text-center text-xs text-neutral-400">
                Forgot password?{' '}
                <Link href="/login" className="text-black font-semibold underline">
                  Go to login page
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-8 py-10 w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-black mb-8 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Store</span>
        </Link>

        <h1 className="text-3xl sm:text-4xl font-bold font-serif-royal text-black mb-2">
          Express Checkout
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mb-10">
          Enter your delivery coordinates to receive blessed Vrindavan dresses and shringar.
        </p>

        {/* 2-Step Progress Stepper */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-8 select-none">
          <button
            type="button"
            onClick={() => setCheckoutStep(1)}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              checkoutStep === 1 ? 'text-black' : 'text-neutral-500 hover:text-black'
            }`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
              checkoutStep === 1 ? 'bg-[#87D215] text-black shadow-sm' : 'bg-emerald-100 text-emerald-800'
            }`}>
              {checkoutStep === 2 ? '✓' : '1'}
            </span>
            <span>1. Shipping Address (डिलीवरी पता)</span>
          </button>

          <div className={`w-8 sm:w-16 h-0.5 transition-colors ${checkoutStep === 2 ? 'bg-[#87D215]' : 'bg-neutral-200'}`} />

          <button
            type="button"
            onClick={() => {
              if (customer.fullName && customer.phone && customer.address && customer.pincode) {
                setCheckoutStep(2);
              }
            }}
            className={`flex items-center gap-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              checkoutStep === 2 ? 'text-black' : 'text-neutral-400'
            }`}
          >
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
              checkoutStep === 2 ? 'bg-[#87D215] text-black shadow-sm' : 'bg-neutral-100 text-neutral-400'
            }`}>
              2
            </span>
            <span>2. Payment Method (भुगतान विधि)</span>
          </button>
        </div>

        <form id="checkoutForm" onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Form */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* STEP 1: Devotee Shipping Address */}
            {checkoutStep === 1 ? (
              <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-200 space-y-4 shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <h2 className="text-base font-bold text-black flex items-center gap-2">
                    <Truck className="w-4 h-4 text-black" />
                    <span>1. Devotee Shipping Address (डिलीवरी पता)</span>
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                    Step 1 of 2
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-700 mb-1 font-semibold">
                      Full Name (भक्त का नाम) *
                    </label>
                    <input
                      type="text"
                      required
                      name="fullName"
                      value={customer.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Radhika Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 focus:border-black text-sm text-black outline-none shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-neutral-700 mb-1 font-semibold">
                      WhatsApp / Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      name="phone"
                      value={customer.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 focus:border-black text-sm text-black outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-700 mb-1 font-semibold">
                    Email Address (फॉर ट्रैकिंग व बिल) *
                  </label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={customer.email}
                    onChange={handleInputChange}
                    onBlur={handleEmailBlur}
                    placeholder="For order dispatch tracking & devotee account"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 focus:border-black text-sm text-black outline-none shadow-2xs"
                  />
                </div>

                {user ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex items-center justify-between text-xs text-emerald-800">
                    <span className="font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      Logged in as <strong>{user.email}</strong>
                    </span>
                    <span className="text-emerald-700 text-[11px]">Orders will auto-sync to your devotee portal</span>
                  </div>
                ) : (
                  <div className="bg-emerald-50/50 border border-emerald-300/80 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-black flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-black" />
                        <span>Create Portal Password (ऑर्डर देखने के लिए पासवर्ड बनाएं) *</span>
                      </label>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                        Required
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Set a password for <strong>{customer.email || 'your email'}</strong> to automatically create your account and access your order tracking portal.
                    </p>
                    <input
                      type="password"
                      required
                      value={accountPassword}
                      onChange={(e) => { setAccountPassword(e.target.value); setWrongPasswordError(false); }}
                      placeholder="Enter a secure password (minimum 6 characters) *"
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-sm text-black outline-none shadow-2xs ${
                        wrongPasswordError ? 'border-red-400 focus:border-red-500' : 'border-neutral-300 focus:border-black'
                      }`}
                    />
                    {wrongPasswordError ? (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <div className="text-[11px] text-red-700 leading-relaxed">
                          <span className="font-bold block">Account already exists with this email.</span>
                          Wrong password entered. Please{' '}
                          <Link
                            href={`/login?redirect=/checkout`}
                            className="underline font-bold text-red-800 hover:text-black"
                          >
                            log in here
                          </Link>
                          {' '}first, then come back to place your order.
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-neutral-500 italic">
                        Already registered before? Enter your existing password to link this order to your portal.
                      </p>
                    )}
                  </div>
                )}

                <div>
                  <label className="block text-xs text-neutral-700 mb-1 font-semibold">
                    Flat, House No., Temple / Apartment, Street (पूरा पता) *
                  </label>
                  <textarea
                    required
                    rows={2}
                    name="address"
                    value={customer.address}
                    onChange={handleInputChange}
                    placeholder="House / Apartment no., Street or Landmark"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 focus:border-black text-sm text-black outline-none resize-none shadow-2xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-neutral-700 mb-1 font-semibold">City (शहर) *</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={customer.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Jaipur"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 focus:border-black text-sm text-black outline-none shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-700 mb-1 font-semibold">State (राज्य) *</label>
                    <input
                      type="text"
                      required
                      name="state"
                      value={customer.state}
                      onChange={handleInputChange}
                      placeholder="e.g. Rajasthan"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 focus:border-black text-sm text-black outline-none shadow-2xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-700 mb-1 font-semibold">Pincode (पिनकोड) *</label>
                    <input
                      type="text"
                      required
                      name="pincode"
                      value={customer.pincode}
                      onChange={handleInputChange}
                      placeholder="6-digit pin"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-neutral-300 focus:border-black text-sm text-black outline-none shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-neutral-700 mb-1 font-semibold">
                    Special Seva Note (वैकल्पिक सेवा संदेश)
                  </label>
                  <input
                    type="text"
                    name="specialNote"
                    value={customer.specialNote}
                    onChange={handleInputChange}
                    placeholder="e.g. Dressing for Janmashtami; please pack extra Tulsi leaves"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-neutral-300 text-xs text-black outline-none"
                  />
                </div>

                {/* Continue to Payment CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleProceedToPayment}
                    className="w-full luxury-black-btn py-3.5 rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                  >
                    <span>Proceed to Payment (भुगतान के लिए आगे बढ़ें)</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ) : (
              /* Confirmed Address Card when on Step 2 */
              <div className="bg-white rounded-3xl p-6 border border-neutral-300 space-y-3 shadow-xs animate-in fade-in">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#87D215]" />
                    <h3 className="text-sm font-black text-black">1. Confirmed Delivery Address (डिलीवरी पता)</h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="text-xs font-bold text-neutral-600 hover:text-black underline cursor-pointer"
                  >
                    Edit Address (पता बदलें)
                  </button>
                </div>
                <div className="text-xs text-neutral-700 space-y-1">
                  <p className="font-bold text-black">{customer.fullName} • {customer.phone}</p>
                  {customer.email && <p className="text-neutral-500">{customer.email}</p>}
                  <p>{customer.address}, {customer.city} - {customer.pincode}, {customer.state}</p>
                  {customer.specialNote && (
                    <p className="text-[11px] text-neutral-500 italic mt-1">Note: {customer.specialNote}</p>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Payment Method */}
            {checkoutStep === 2 ? (
              <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-200 space-y-5 shadow-sm animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                  <h2 className="text-base font-bold text-black flex items-center gap-2">
                    <Lock className="w-4 h-4 text-black" />
                    <span>2. Select Payment Method (भुगतान विधि)</span>
                  </h2>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                    Step 2 of 2
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {siteSettings?.isRazorpayEnabled && (
                    <label
                      className={`p-4 rounded-2xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                        paymentMethod === 'online'
                          ? 'border-[#87D215] ring-2 ring-[#87D215] bg-[#87D215]/10 shadow-md'
                          : 'border-neutral-200 bg-white/60 hover:border-neutral-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'online'}
                        onChange={() => setPaymentMethod('online')}
                        className="sr-only"
                      />
                      <QrCode className="w-6 h-6 text-black mb-2" />
                      <span className="text-xs font-bold text-black">Pay via UPI / Online</span>
                      <span className="text-[10px] text-neutral-500">GPay, PhonePe, Cards, NetBanking</span>
                    </label>
                  )}

                  {!siteSettings?.isRazorpayEnabled && (
                    <label
                      className={`p-4 rounded-2xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                        paymentMethod === 'upi'
                          ? 'border-[#87D215] ring-2 ring-[#87D215] bg-[#87D215]/10 shadow-md'
                          : 'border-neutral-200 bg-white/60 hover:border-neutral-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="sr-only"
                      />
                      <QrCode className="w-6 h-6 text-black mb-2" />
                      <span className="text-xs font-bold text-black">Instant UPI</span>
                      <span className="text-[10px] text-neutral-500">GPay, PhonePe, Paytm</span>
                    </label>
                  )}

                  <label
                    className={`p-4 rounded-2xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-[#87D215] ring-2 ring-[#87D215] bg-[#87D215]/10 shadow-md'
                        : 'border-neutral-200 bg-white/60 hover:border-neutral-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="sr-only"
                    />
                    <Banknote className="w-6 h-6 text-black mb-2" />
                    <span className="text-xs font-bold text-black">Cash on Delivery</span>
                    <span className="text-[10px] text-neutral-500">Pay at doorstep</span>
                  </label>

                  {!siteSettings?.isRazorpayEnabled && (
                    <label
                      className={`p-4 rounded-2xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#87D215] ring-2 ring-[#87D215] bg-[#87D215]/10 shadow-md'
                          : 'border-neutral-200 bg-white/60 hover:border-neutral-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="sr-only"
                      />
                      <CreditCard className="w-6 h-6 text-black mb-2" />
                      <span className="text-xs font-bold text-black">Cards & Banking</span>
                      <span className="text-[10px] text-neutral-500">RuPay, Visa, Master</span>
                    </label>
                  )}
                </div>

                {/* Extra guidance depending on payment method */}
                {paymentMethod === 'upi' && (
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-600 space-y-1">
                    <p className="font-bold text-black">📱 Scan & Pay with Any UPI App</p>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Instant QR code & UPI handle will be provided upon confirming. Zero convenience charges.
                    </p>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-600 space-y-1">
                    <p className="font-bold text-black">💵 Cash on Delivery Available</p>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      Pay cash or UPI directly to the BlueDart / DTDC delivery associate when receiving your sacred parcel.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-2xl bg-white border border-neutral-200 text-xs text-neutral-600 space-y-1">
                    <p className="font-bold text-black">🔒 256-Bit Encrypted Secure Gateway</p>
                    <p className="text-[11px] text-neutral-500 leading-relaxed">
                      All Indian bank debit cards, credit cards, and NetBanking accepted via RBI-licensed gateway.
                    </p>
                  </div>
                )}

                {/* Step 2 Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || cart.length === 0}
                    className="w-full luxury-black-btn py-4 rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Processing Sacred Order...</span>
                    ) : (
                      <>
                        <span>Confirm & Place Seva Order (ऑर्डर कन्फर्म करें)</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCheckoutStep(1)}
                    className="w-full text-center text-xs text-neutral-500 hover:text-black underline cursor-pointer py-1 block"
                  >
                    ← Back to Shipping Address (डिलीवरी पता बदलें)
                  </button>
                </div>
              </div>
            ) : (
              /* Step 2 Collapsed Preview when on Step 1 */
              <div className="bg-neutral-50/60 rounded-3xl p-6 border border-dashed border-neutral-300 space-y-2 opacity-75">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-bold text-neutral-500 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-neutral-400" />
                    <span>2. Select Payment Method (भुगतान विधि)</span>
                  </h2>
                  <span className="text-[10px] text-neutral-400 font-semibold uppercase">Step 2</span>
                </div>
                <p className="text-xs text-neutral-500">
                  Please complete and verify your shipping address first, then click &quot;Proceed to Payment&quot; to choose UPI, Cash on Delivery, or Cards.
                </p>
              </div>
            )}
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="bg-neutral-50 rounded-3xl p-6 border border-neutral-200 space-y-6 sticky top-28 shadow-sm">
              <h2 className="text-base font-bold text-black flex items-center justify-between pb-3 border-b border-neutral-200">
                <span>Order Summary</span>
                <span className="text-xs text-neutral-600 font-bold">{cart.length} Products</span>
              </h2>

              {/* Items */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {cart.length === 0 ? (
                  <p className="text-xs text-neutral-500">No items in basket.</p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={`${item.product.id}-${item.selectedSize}`}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-neutral-200 shrink-0">
                          <Image src={item.product.images[0]} alt="" fill className="object-cover" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-black truncate">{item.product.name}</p>
                          <p className="text-[11px] text-neutral-500">
                            Size {item.selectedSize} × {item.quantity}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-black shrink-0">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))
                )}
              </div>

              {/* Breakdown */}
              <div className="space-y-2 pt-4 border-t border-neutral-200 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-black">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-black font-semibold">
                    <span>Coupon ({couponCode}):</span>
                    <span>-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Express Shipping:</span>
                  <span>{shippingFee === 0 ? <strong className="text-black">FREE</strong> : `₹${shippingFee}`}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-black pt-2 border-t border-neutral-300">
                  <span>Total Amount (कुल राशि):</span>
                  <span className="text-lg font-extrabold">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Dynamic Action Button on Sidebar based on Step */}
              {checkoutStep === 1 ? (
                <button
                  type="button"
                  onClick={handleProceedToPayment}
                  className="w-full luxury-black-btn py-4 rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>Proceed to Payment (भुगतान के लिए आगे बढ़ें)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || cart.length === 0}
                  className="w-full luxury-black-btn py-4 rounded-full font-bold text-sm shadow-md flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Processing Sacred Order...</span>
                  ) : (
                    <>
                      <span>Confirm & Place Seva Order</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-black font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>100% Satisfaction & Safe Delivery Guarantee</span>
                </div>
                <p className="text-[10px] text-neutral-500">
                  By placing this order, you support traditional Braj artisans.
                </p>
              </div>
            </div>
          </div>
        </form>
      </main>

      {/* Manual UPI Payment Modal */}
      {showUpiModal && siteSettings?.manualUpiId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm p-6 sm:p-8 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowUpiModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black transition-colors"
            >
              <CheckCircle2 className="w-5 h-5 opacity-0" />
              <span className="sr-only">Close</span>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 bg-neutral-200 rounded-full flex items-center justify-center">
                  <div className="w-3 h-0.5 bg-neutral-600 rotate-45 absolute" />
                  <div className="w-3 h-0.5 bg-neutral-600 -rotate-45 absolute" />
                </div>
              </div>
            </button>

            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#87D215]/20 flex items-center justify-center mx-auto text-[#87D215]">
                <QrCode className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-black">Scan & Pay (UPI)</h2>
              <p className="text-sm text-neutral-600 leading-relaxed">
                Please scan the QR code below using GPay, PhonePe, or Paytm to pay <strong>₹{finalTotal.toLocaleString('en-IN')}</strong>.
              </p>

              <div className="bg-white border-2 border-neutral-200 p-4 rounded-2xl shadow-sm inline-block mx-auto w-48 h-48">
                {/* Dynamically generated QR Code using api.qrserver.com */}
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(`upi://pay?pa=${siteSettings.manualUpiId}&pn=${siteSettings.storeName || 'Store'}&am=${finalTotal}&cu=INR`)}`}
                  alt="UPI QR Code"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="bg-neutral-50 px-4 py-3 rounded-xl border border-neutral-200 mt-2">
                <span className="text-xs text-neutral-500 block mb-1">Or pay to this UPI ID:</span>
                <span className="font-mono text-sm font-bold text-black select-all">{siteSettings.manualUpiId}</span>
              </div>

              <div className="pt-2 text-left space-y-2">
                <label className="text-xs font-bold text-neutral-700 block">
                  Enter UTR / Transaction Reference No. (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 3012938475"
                  value={upiTransactionId}
                  onChange={(e) => setUpiTransactionId(e.target.value)}
                  className="w-full bg-white border border-neutral-300 rounded-xl px-4 py-3 text-sm focus:border-black outline-none transition-all"
                />
              </div>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={async (e) => {
                  e.preventDefault();
                  setIsSubmitting(true);
                  // Resubmit the form explicitly
                  const form = document.getElementById('checkoutForm') as HTMLFormElement;
                  if (form) form.requestSubmit();
                }}
                className="w-full luxury-black-btn py-3.5 rounded-full font-bold text-sm shadow-md mt-4 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Confirming...' : 'I have completed the payment'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
