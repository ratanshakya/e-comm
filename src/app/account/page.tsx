'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Order } from '@/types';

// Minimalist Account Dashboard Component
export default function AccountPage() {
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'addresses' | 'account_details'>('dashboard');
  const [isClient, setIsClient] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'orders' || tabParam === 'addresses' || tabParam === 'account_details') {
        setActiveTab(tabParam as any);
      }
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const fetchUserOrders = () => {
    if (!user) return;
    setOrdersLoading(true);
    fetch('/api/orders/me')
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.data);
        setOrdersLoading(false);
      })
      .catch(() => setOrdersLoading(false));
  };

  useEffect(() => {
    if (user) {
      fetchUserOrders();
    }
  }, [user]);

  if (loading || !user) {
    return <div className="min-h-screen flex flex-col bg-white text-black"><Navbar /><main className="flex-1 max-w-[1600px] w-full mx-auto py-12 px-4 sm:px-8 lg:px-12">Loading account...</main></div>;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: `Orders (${orders.length})` },
    { id: 'addresses', label: 'Addresses' },
    { id: 'account_details', label: 'Account details' },
  ] as const;

  // Render main content based on tab
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        const latestOrder = orders[0];
        return (
          <div className="space-y-6">
            <div>
              <p className="text-[15px] text-neutral-600 mb-4">
                Hello <strong>{user.firstName || user.email.split('@')[0]}</strong> (not <strong>{user.firstName || user.email.split('@')[0]}</strong>? <button onClick={() => setShowLogoutModal(true)} className="text-black underline underline-offset-2 cursor-pointer">Log out</button>)
              </p>
              <p className="text-[15px] text-neutral-600 leading-relaxed">
                From your account dashboard you can view your <button onClick={(e) => { e.preventDefault(); setActiveTab('orders'); }} className="text-black font-semibold underline underline-offset-2 cursor-pointer">recent orders ({orders.length})</button>, manage your <button onClick={(e) => { e.preventDefault(); setActiveTab('addresses'); }} className="text-black underline underline-offset-2 cursor-pointer">shipping and billing addresses</button>, and <button onClick={(e) => { e.preventDefault(); setActiveTab('account_details'); }} className="text-black underline underline-offset-2 cursor-pointer">edit your password and account details</button>.
              </p>
            </div>

            {/* Quick Recent Order Preview on Dashboard */}
            {latestOrder && (
              <div className="mt-8 border border-neutral-200 rounded-2xl p-5 bg-neutral-50/60 shadow-xs">
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
                  <span className="text-xs font-bold text-black uppercase tracking-wider">Latest Sacred Order</span>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-bold text-black underline underline-offset-2 hover:text-[#87D215] cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-sm font-black text-black">Order #{latestOrder.id}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {latestOrder.items.length} product(s) • Total: <strong className="text-black">₹{latestOrder.total.toLocaleString('en-IN')}</strong>
                    </p>
                    <p className="text-xs text-neutral-600 mt-1 truncate max-w-md">
                      {latestOrder.items.map(i => i.productName).join(', ')}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="luxury-black-btn px-4 py-2 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                  >
                    View Order Details
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
              <h2 className="text-xl font-bold text-black font-serif-royal">Your Sacred Orders</h2>
              <span className="text-xs text-neutral-500 font-semibold">{orders.length} orders found</span>
            </div>

            {ordersLoading ? (
              <div className="p-8 text-center text-sm text-neutral-500">Loading your sacred orders...</div>
            ) : orders.length === 0 ? (
              <div className="bg-[#f7f6f7] p-6 border-t-2 border-[#87D215] text-[15px] text-neutral-600 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-xl">
                <span>No orders have been placed under this account yet.</span>
                <Link href="/shop" className="bg-black text-white hover:bg-neutral-800 px-5 py-2.5 rounded-full text-xs font-bold transition-colors">
                  BROWSE PRODUCTS
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {orders.map(order => (
                  <div key={order.id} className="border border-neutral-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                    {/* Order Top Bar */}
                    <div className="bg-neutral-50 px-5 py-4 border-b border-neutral-200 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Order Placed</span>
                          <span className="font-semibold text-black">
                            {new Date(order.createdAt || '').toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                        <div className="h-6 w-px bg-neutral-200 hidden sm:block" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Total Amount (कुल राशि)</span>
                          <span className="font-extrabold text-black">₹{order.total.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="h-6 w-px bg-neutral-200 hidden sm:block" />
                        <div>
                          <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">Ship To</span>
                          <span className="font-semibold text-black truncate max-w-[160px] inline-block">{order.customer?.fullName}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 text-[10px] font-extrabold rounded-full uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                          ● {order.status || 'Confirmed'}
                        </span>
                        <span className="text-xs font-mono font-bold text-neutral-800 bg-white px-2.5 py-1 rounded-lg border border-neutral-200 shadow-2xs">
                          #{order.id}
                        </span>
                      </div>
                    </div>

                    {/* Order Products List */}
                    <div className="p-5 divide-y divide-neutral-100">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                              {item.image ? (
                                <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full bg-neutral-200" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-black truncate">{item.productName}</h4>
                              <p className="text-xs text-neutral-500 mt-0.5">
                                Size: <span className="font-semibold text-neutral-800">{item.size}</span> • Qty: <span className="font-semibold text-neutral-800">{item.quantity}</span>
                              </p>
                              <p className="text-xs font-bold text-black mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="text-sm font-extrabold text-black">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Details Footer */}
                    <div className="bg-neutral-50/70 px-5 py-3 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-600">
                      <div className="text-[11px]">
                        <span className="text-neutral-500">Delivery Address: </span>
                        <span className="text-neutral-800 font-medium">
                          {order.customer?.address}, {order.customer?.city} ({order.customer?.pincode})
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px]">
                        <span>Payment: <strong className="uppercase text-black">{order.paymentMethod}</strong></span>
                        {order.customer?.phone && (
                          <span>Dispatch Phone: <strong className="text-black">{order.customer.phone}</strong></span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'addresses': {
        const shipping = user.shippingAddress;
        const billing = user.billingAddress;
        return (
          <div>
            <p className="text-[15px] text-neutral-600 mb-6">
              The following addresses will be used on the checkout page by default.
            </p>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Billing Address */}
              <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs">
                <h3 className="text-base font-bold mb-3 text-black uppercase tracking-wide">Billing Address</h3>
                {billing?.address ? (
                  <div className="space-y-1 text-sm text-neutral-700 leading-relaxed">
                    {billing.fullName && <p className="font-semibold text-black">{billing.fullName}</p>}
                    {billing.address && <p>{billing.address}</p>}
                    {(billing.city || billing.state) && (
                      <p>{[billing.city, billing.state].filter(Boolean).join(', ')}</p>
                    )}
                    {billing.pincode && <p>Pincode: {billing.pincode}</p>}
                    {billing.phone && <p>📞 {billing.phone}</p>}
                  </div>
                ) : (
                  <p className="text-[15px] text-neutral-400 italic">
                    No billing address saved yet. It will be auto-saved after your first order.
                  </p>
                )}
              </div>

              {/* Shipping Address */}
              <div className="border border-neutral-200 rounded-2xl p-5 bg-white shadow-xs">
                <h3 className="text-base font-bold mb-3 text-black uppercase tracking-wide">Shipping Address</h3>
                {shipping?.address ? (
                  <div className="space-y-1 text-sm text-neutral-700 leading-relaxed">
                    {shipping.fullName && <p className="font-semibold text-black">{shipping.fullName}</p>}
                    {shipping.address && <p>{shipping.address}</p>}
                    {(shipping.city || shipping.state) && (
                      <p>{[shipping.city, shipping.state].filter(Boolean).join(', ')}</p>
                    )}
                    {shipping.pincode && <p>Pincode: {shipping.pincode}</p>}
                    {shipping.phone && <p>📞 {shipping.phone}</p>}
                  </div>
                ) : (
                  <p className="text-[15px] text-neutral-400 italic">
                    No shipping address saved yet. It will be auto-saved after your first order.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-6 bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-xs text-neutral-500">
              ℹ️ Your address is automatically saved after every successful order and pre-filled at checkout.
            </div>
          </div>
        );
      }

      case 'account_details':
        return (
          <form className="max-w-2xl space-y-5 text-[15px]">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-neutral-800 mb-2">First name</label>
                <input type="text" defaultValue={user.firstName} className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black" />
              </div>
              <div>
                <label className="block text-neutral-800 mb-2">Last name</label>
                <input type="text" defaultValue={user.lastName} className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black" />
              </div>
            </div>
            <div>
              <label className="block text-neutral-800 mb-2">Display name <span className="text-red-500">*</span></label>
              <input type="text" defaultValue={user.firstName || user.email.split('@')[0]} className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black mb-1" />
              <p className="text-xs text-neutral-500 italic">This will be how your name will be displayed in the account section and in reviews</p>
            </div>
            <div>
              <label className="block text-neutral-800 mb-2">Email address <span className="text-red-500">*</span></label>
              <input type="email" defaultValue={user.email} className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black bg-neutral-50 cursor-not-allowed" disabled />
            </div>

            <fieldset className="border border-neutral-200 p-6 mt-8">
              <legend className="text-xl px-2 text-black font-normal">Password change</legend>
              <div className="space-y-4 mt-2">
                <div>
                  <label className="block text-neutral-800 mb-2">Current password (leave blank to leave unchanged)</label>
                  <input type="password" className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-neutral-800 mb-2">New password (leave blank to leave unchanged)</label>
                  <input type="password" className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-neutral-800 mb-2">Confirm new password</label>
                  <input type="password" className="w-full px-4 py-3 border border-neutral-300 focus:outline-none focus:border-black" />
                </div>
              </div>
            </fieldset>

            <button type="submit" className="bg-black text-white px-8 py-3.5 mt-6 font-bold hover:bg-neutral-800 transition-colors">
              SAVE CHANGES
            </button>
          </form>
        );
      default:
        return null;
    }
  };

  if (!isClient) return null; // Prevent hydration errors

  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <div className="flex-1 w-full max-w-[1600px] py-12 px-4 sm:px-8 lg:px-12">
        
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Classic Left Sidebar Navigation */}
          <div className="w-full md:w-[320px] shrink-0">
            <nav className="flex flex-col space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left px-6 py-3.5 text-[16px] transition-colors cursor-pointer ${
                    activeTab === tab.id 
                      ? 'border-l-[3px] border-black text-black font-semibold' 
                      : 'border-l-[3px] border-transparent text-neutral-600 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
              <button
                onClick={() => setShowLogoutModal(true)}
                className="text-left px-6 py-3.5 text-[16px] border-l-[3px] border-transparent text-red-500 hover:text-red-700 hover:bg-red-50 transition-colors cursor-pointer"
              >
                Log out
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 pt-2 md:pl-12">
            {renderContent()}
          </div>
          
        </div>

      </div>

      {/* ── Logout Confirm Modal ── */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4"
            style={{ animation: 'logoutModalUp 0.25s cubic-bezier(.22,.68,0,1.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-2 pb-2">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-1 text-2xl">
                🚪
              </div>
              <h3 className="text-base font-black text-black">Logout?</h3>
              <p className="text-sm text-neutral-500 text-center leading-snug">
                Are you sure you want to log out of your account?
              </p>
            </div>
            <button
              onClick={async () => { await logout(); setShowLogoutModal(false); }}
              className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm transition-colors cursor-pointer"
            >
              Yes, Logout
            </button>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="w-full py-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-black font-bold text-sm transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
