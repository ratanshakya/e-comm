'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  Plus,
  Edit2,
  Trash2,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  ExternalLink,
  LogOut,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Database,
  Phone,
  MessageCircle,
  AlertCircle,
  X,
  Check,
  TrendingUp,
  Tag,
  Sparkles,
  Megaphone,
  Mail,
  MapPin,
  Save,
  MessageSquare,
  Percent,
  Layers,
  Award,
  ShieldCheck,
  Users,
  ImageIcon,
  Loader2,
  CreditCard,
  Monitor,
  LayoutTemplate,
  FileText
} from 'lucide-react';
import { Product, Order } from '@/types';
import { CATEGORIES } from '@/data/products';
import { SiteSettingsData, DEFAULT_SETTINGS } from '@/lib/settingsStore';
import { CategoryItem } from '@/lib/categoriesStore';
import ImageUploader from '@/components/ImageUploader';


const ADMIN_PASSCODE = 'radhe1008';

export default function AdminPage() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcodeInput, setPasscodeInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'products' | 'categories' | 'orders' | 'inquiries' | 'users' | 'coupons' | 'shipping' | 'header' | 'footer' | 'settings' | 'sale' | 'pages' | 'homepage' | 'reels' | 'payments'
  >('dashboard');

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [settings, setSettings] = useState<SiteSettingsData>(DEFAULT_SETTINGS);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Category Modal & Form
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [categoryForm, setCategoryForm] = useState({
    label: '',
    hindiLabel: '',
    categoryId: '',
    icon: 'Sparkles',
  });

  // Filters & search
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Add/Edit Product Form state
  const [formData, setFormData] = useState({
    name: '',
    hindiName: '',
    category: 'poshak',
    categoryLabel: 'Festive Heavy Poshaks',
    price: '',
    originalPrice: '',
    sizes: ['0', '1', '2', '3', '4', '5', '6'],
    description: '',
    fabric: '',
    color: '',
    images: ['/images/poshak_royal_zardozi.jpg'],
    badge: '★ Best Seller | Vrindavan Craft',
    inStock: true,
    featured: false,
    inclusions: ['Poshak (Choli + Lehenga)', 'Matching Mor Mukut', 'Patka (Waist Stole)'],
  });

  // Check persisted authentication on mount
  useEffect(() => {
    const saved = sessionStorage.getItem('brocart_admin_auth');
    if (saved === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const safeFetch = (url: string) => fetch(url).catch(err => {
        console.warn(`Fetch error for ${url}:`, err);
        return { ok: false, json: async () => ({}) } as any;
      });

      const [prodRes, orderRes, inqRes, setRes, statsRes, catRes, usersRes] = await Promise.all([
        safeFetch('/api/products'),
        safeFetch('/api/orders'),
        safeFetch('/api/inquiries'),
        safeFetch('/api/settings'),
        safeFetch('/api/admin/stats'),
        safeFetch('/api/categories'),
        safeFetch('/api/admin/users'),
      ]);

      if (prodRes.ok) {
        const pData = await prodRes.json();
        if (pData.data) setProducts(pData.data);
      }

      if (catRes.ok) {
        const cData = await catRes.json();
        if (cData.data) setCategories(cData.data);
      }

      if (orderRes.ok) {
        const oData = await orderRes.json();
        if (oData.data) setOrders(oData.data);
      }

      if (inqRes.ok) {
        const iData = await inqRes.json();
        if (iData.data) setInquiries(iData.data);
      }

      if (setRes.ok) {
        const sData = await setRes.json();
        if (sData.data) setSettings({ ...DEFAULT_SETTINGS, ...sData.data });
      }

      if (usersRes.ok) {
        const uData = await usersRes.json();
        if (uData.data) setUsersList(uData.data);
      }

      if (statsRes.ok) {
        const stData = await statsRes.json();
        if (stData.data) setStats(stData.data);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcodeInput === ADMIN_PASSCODE || passcodeInput === '1008') {
      setIsAuthenticated(true);
      sessionStorage.setItem('brocart_admin_auth', 'true');
      setAuthError(false);
      showToast('Radhe Radhe! Admin access granted.');
    } else {
      setAuthError(true);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    sessionStorage.removeItem('brocart_admin_auth');
    setIsAuthenticated(false);
    setPasscodeInput('');
    setShowLogoutModal(false);
  };

  // Toggle Stock Status for a Product
  const toggleProductStock = async (product: Product) => {
    try {
      const updatedStock = !product.inStock;
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: updatedStock }),
      });

      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === product.id ? { ...p, inStock: updatedStock } : p))
        );
        showToast(`"${product.name}" marked as ${updatedStock ? 'In Stock' : 'Out of Stock'}`);
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating stock');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the store catalog?`)) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        showToast(`"${name}" removed successfully.`);
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting product');
    }
  };

  // Open Edit Modal
  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      hindiName: product.hindiName || product.name,
      category: product.category,
      categoryLabel: product.categoryLabel,
      price: String(product.price),
      originalPrice: String(product.originalPrice),
      sizes: product.sizes || ['0', '1', '2', '3', '4', '5', '6'],
      description: product.description,
      fabric: product.fabric || '',
      color: product.color || '',
      images: product.images || ['/images/poshak_royal_zardozi.jpg'],
      badge: product.badge || '',
      inStock: product.inStock,
      featured: product.featured || false,
      inclusions: product.inclusions || ['Poshak', 'Mukut'],
    });
    setIsAddModalOpen(true);
  };

  // Save Product (Create or Update)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please provide product name and price');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        hindiName: formData.hindiName || formData.name,
        category: formData.category,
        categoryLabel:
          categories.find((c) => c.id === formData.category)?.label ||
          CATEGORIES.find((c) => c.id === formData.category)?.label ||
          formData.category,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || formData.price),
        sizes: formData.sizes,
        description: formData.description,
        fabric: formData.fabric,
        color: formData.color,
        images: formData.images,
        badge: formData.badge,
        inStock: formData.inStock,
        featured: formData.featured,
        inclusions: formData.inclusions,
      };

      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          setProducts((prev) =>
            prev.map((p) => (p.id === editingProduct.id ? data.data : p))
          );
          showToast('Product updated successfully!');
        }
      } else {
        const res = await fetch('/api/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          setProducts((prev) => [data.data, ...prev]);
          showToast('New product added to store!');
        }
      }

      setIsAddModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      console.error(err);
      showToast('Error saving product');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: 'confirmed' | 'processing' | 'shipped'
  ) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        if (viewingOrder && viewingOrder.id === orderId) {
          setViewingOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
        showToast(`Order ${orderId} updated to ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update order status');
    }
  };

  // Update Inquiry Status
  const handleUpdateInquiryStatus = async (
    id: string,
    newStatus: 'new' | 'replied' | 'closed'
  ) => {
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setInquiries((prev) =>
          prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
        );
        showToast(`Inquiry marked as ${newStatus}`);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to update inquiry status');
    }
  };

  // Category Management Handlers
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({
      label: '',
      hindiLabel: '',
      categoryId: '',
      icon: 'Sparkles',
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCategoryForm({
      label: cat.label,
      hindiLabel: cat.hindiLabel || '',
      categoryId: cat.id || cat.categoryId,
      icon: cat.icon || 'Sparkles',
    });
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.label.trim()) {
      alert('Please enter a category name (e.g. Silver Flutes & Mor Pankh)');
      return;
    }

    try {
      if (editingCategory) {
        const res = await fetch(`/api/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            label: categoryForm.label.trim(),
            hindiLabel: categoryForm.hindiLabel.trim(),
            icon: categoryForm.icon,
          }),
        });

        if (res.ok) {
          showToast(`Category "${categoryForm.label}" updated successfully!`);
          setIsCategoryModalOpen(false);
          loadAllData();
        } else {
          showToast('Failed to update category');
        }
      } else {
        const slug = (categoryForm.categoryId || categoryForm.label)
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        const res = await fetch('/api/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            label: categoryForm.label.trim(),
            hindiLabel: categoryForm.hindiLabel.trim() || categoryForm.label.trim(),
            categoryId: slug,
            icon: categoryForm.icon,
          }),
        });

        if (res.ok) {
          showToast(`New category "${categoryForm.label}" added to store!`);
          setIsCategoryModalOpen(false);
          loadAllData();
        } else {
          const d = await res.json();
          alert(d.message || 'Error adding category');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Error saving category');
    }
  };

  const handleDeleteCategory = async (cat: CategoryItem) => {
    if (cat.id === 'all') {
      alert('Default "All Collections" category cannot be deleted.');
      return;
    }
    if (!confirm(`Are you sure you want to delete category "${cat.label}"?`)) return;

    try {
      const res = await fetch(`/api/categories/${cat.id}`, { method: 'DELETE' });
      if (res.ok) {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        showToast(`Category "${cat.label}" removed from store.`);
      } else {
        showToast('Error deleting category');
      }
    } catch (err) {
      console.error(err);
      showToast('Error deleting category');
    }
  };

  // Save Website Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        showToast('✓ Website settings updated successfully!');
      } else {
        showToast('Error saving settings');
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to save settings');
    }
  };

  // Quick Sale Toggle (1-click from dashboard/sidebar)
  const handleToggleSale = async () => {
    const newVal = !settings.isSaleActive;
    const updated = { ...settings, isSaleActive: newVal };
    setSettings(updated);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        showToast(newVal ? '🔥 Sale is now LIVE on website!' : '⏸ Sale has been turned OFF.');
      } else {
        setSettings(settings); // revert
        showToast('Error updating sale status');
      }
    } catch (err) {
      console.error(err);
      setSettings(settings);
      showToast('Error updating sale status');
    }
  };

  // Seed Catalog to Mongo
  const handleSeedMongoDB = async () => {
    if (!confirm('Re-sync default 8 Vrindavan products to MongoDB?')) return;
    try {
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'Catalog synced to MongoDB!');
        loadAllData();
      } else {
        alert(data.message || 'Failed to seed MongoDB. Check MONGODB_URI in .env.local');
      }
    } catch (err) {
      console.error(err);
      alert('Error communicating with database');
    }
  };

  // Filtered lists
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      productSearch === '' ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.hindiName && p.hindiName.includes(productSearch));
    const matchesCat =
      productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredOrders = orders.filter((o) => {
    if (orderStatusFilter === 'all') return true;
    return o.status === orderStatusFilter;
  });

  const filteredInquiries = inquiries.filter((i) => {
    if (inquiryStatusFilter === 'all') return true;
    return i.status === inquiryStatusFilter;
  });

  // -------------------------------------------------------------
  // SCREEN 1: PASSCODE LOGIN SCREEN
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#87D215]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-black/90 border border-neutral-800 p-8 sm:p-10 rounded-3xl shadow-2xl backdrop-blur-xl relative z-10 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#87D215] text-black font-black text-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#87D215]/20">
            <Lock className="w-7 h-7 stroke-[2.5]" />
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">BroCART Admin Portal</h2>
          <p className="text-xs text-neutral-400 mt-1 mb-8">
            Complete Website Control & Management (संपूर्ण वेबसाइट नियंत्रण)
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                Admin Passcode (गोपनीय पिन)
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter passcode (e.g. radhe1008)"
                  className="w-full bg-neutral-800/90 border border-neutral-700 text-white rounded-xl px-4 py-3 text-sm focus:border-[#87D215] focus:ring-1 focus:ring-[#87D215] outline-none pr-10 tracking-widest font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect passcode. Hint: radhe1008
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-[#87D215] hover:bg-[#78BD0E] text-black font-black py-3.5 px-4 rounded-xl text-xs uppercase tracking-widest transition-all cursor-pointer shadow-md hover:shadow-[0_4px_20px_rgba(135,210,21,0.3)] mt-2"
            >
              Unlock Website Control →
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
            <span>PIN: <strong className="text-neutral-300">radhe1008</strong></span>
            <Link href="/" className="text-[#87D215] hover:underline">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // SCREEN 2: MAIN ADMIN DASHBOARD
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-black text-white px-6 py-4 rounded-full shadow-2xl border border-neutral-700 flex items-center gap-3 animate-in fade-in slide-in-from-top-6 duration-300">
          <CheckCircle2 className="w-5 h-5 text-[#87D215]" />
          <span className="text-sm font-bold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white border-r border-neutral-200 p-5 flex flex-col justify-between shrink-0 shadow-xs md:sticky md:top-0 md:h-screen overflow-y-auto">
        <div>
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-[#87D215] font-black text-sm overflow-hidden shrink-0">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt="logo" className="w-full h-full object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <span>{(settings.storeName || 'B').charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="font-black text-base tracking-tight leading-none text-black">
                {settings.storeName || 'BroCART'}
              </h1>
              <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold">
                Full Control Center
              </span>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="space-y-1 text-xs font-bold">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard (अवलोकन)</span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Products (उत्पाद)</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'products'
                    ? 'bg-[#87D215] text-black'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'categories'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Categories (श्रेणियां)</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-black ${
                  activeTab === 'categories'
                    ? 'bg-[#87D215] text-black'
                    : 'bg-neutral-100 text-neutral-600'
                }`}
              >
                {categories.filter((c) => c.id !== 'all').length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-4 h-4" />
                <span>Orders (ऑर्डर्स)</span>
              </div>
              {orders.filter((o) => o.status === 'confirmed').length > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#87D215] text-black text-[10px] font-black flex items-center justify-center">
                  {orders.filter((o) => o.status === 'confirmed').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'inquiries'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="w-4 h-4" />
                <span>Inquiries (संदेश)</span>
              </div>
              {inquiries.filter((i) => i.status === 'new').length > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-black flex items-center justify-center">
                  {inquiries.filter((i) => i.status === 'new').length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" />
                <span>Users (यूज़र्स)</span>
              </div>
              <span className="bg-neutral-100 text-neutral-600 px-2 rounded-full text-xs font-bold">
                {usersList.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <Percent className="w-4 h-4" />
              <span>Coupons & Offers</span>
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'shipping'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <Truck className="w-4 h-4" />
              <span>Shipping Rules</span>
            </button>

            <button
              onClick={() => setActiveTab('header')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'header'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span>Header Settings</span>
            </button>

            <button
              onClick={() => setActiveTab('footer')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'footer'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <LayoutTemplate className="w-4 h-4" />
              <span>Footer Settings</span>
            </button>



            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Site Banners & Info</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'payments'
                  ? 'bg-[#87D215] text-black font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Payment Options</span>
            </button>

            <button
              onClick={() => setActiveTab('pages')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'pages'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Pages (About / Contact)</span>
            </button>

            <button
              onClick={() => setActiveTab('homepage')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'homepage'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Home Page Content</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'reels'
                  ? 'bg-black text-white font-black shadow-xs'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-black'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Instagram Reels & Videos</span>
            </button>


            <button
              onClick={() => setActiveTab('sale')}
              className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === 'sale'
                  ? 'bg-rose-500 text-white font-black shadow-xs'
                  : 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles className="w-4 h-4" />
                <span>Sale (सेल)</span>
              </div>
              {/* Quick inline toggle */}
              <div
                role="button"
                tabIndex={0}
                onClick={(e) => { e.stopPropagation(); handleToggleSale(); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.stopPropagation(); handleToggleSale(); } }}
                title={settings.isSaleActive ? 'Click to turn OFF sale' : 'Click to turn ON sale'}
                className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer shrink-0 ${
                  settings.isSaleActive ? 'bg-white' : 'bg-rose-900/40'
                }`}
              >
                <span className={`absolute top-0.5 w-4 h-4 rounded-full transition-all ${
                  settings.isSaleActive
                    ? 'left-[18px] bg-rose-500'
                    : 'left-0.5 bg-neutral-400'
                }`} />
              </div>
            </button>
          </nav>
        </div>

        {/* Bottom Info */}
        <div className="pt-6 border-t border-neutral-100 space-y-3">
          <div className="px-3 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-[11px] flex items-center justify-between">
            <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5" /> Database:
            </span>
            <span className="font-bold flex items-center gap-1 text-[#87D215]">
              <span className="w-2 h-2 rounded-full bg-[#87D215] animate-pulse" />
              {stats?.isMongoConnected ? 'Atlas Live' : 'Memory Active'}
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-bold transition-colors"
          >
            <span>View Live Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-neutral-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Admin</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto max-h-screen">
        {/* Header */}
        <header className="h-16 bg-white border-b border-neutral-200 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-black text-black">
              {activeTab === 'dashboard' && 'Dashboard Overview (अवलोकन)'}
              {activeTab === 'products' && 'Product Catalog Management (उत्पाद प्रबंधन)'}
              {activeTab === 'categories' && 'Category Management (श्रेणी प्रबंधन)'}
              {activeTab === 'orders' && 'Devotee Seva Orders (ग्राहक आदेश)'}
              {activeTab === 'inquiries' && 'Devotee Messages & Sizing Inquiries (ग्राहक पूछताछ)'}
              {activeTab === 'coupons' && 'Coupons & Discount Codes'}
              {activeTab === 'shipping' && 'Shipping Policy & Flat Rates'}
              {activeTab === 'settings' && 'Site Banners, Announcement & Store Details'}
              {activeTab === 'payments' && 'Payment Gateway & Manual UPI Options'}
              {activeTab === 'pages' && 'About & Contact Us Content'}
              {activeTab === 'sale' && 'Sale & Promotional Offers (सेल)'}
              {activeTab === 'homepage' && 'Home Page Content'}
              {activeTab === 'reels' && 'Instagram Reels & Videos'}
            </h2>
            {isLoading && <RefreshCw className="w-4 h-4 text-neutral-400 animate-spin" />}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              title="Refresh Data"
              className="p-2 rounded-xl border border-neutral-200 hover:border-black text-neutral-600 hover:text-black transition-colors cursor-pointer bg-white"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {activeTab === 'categories' && (
              <button
                onClick={openAddCategoryModal}
                className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Category</span>
              </button>
            )}

            {activeTab === 'products' && (
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    hindiName: '',
                    category: 'poshak',
                    categoryLabel: 'Festive Heavy Poshaks',
                    price: '',
                    originalPrice: '',
                    sizes: ['0', '1', '2', '3', '4', '5', '6'],
                    description: '',
                    fabric: '',
                    color: '',
                    images: ['/images/poshak_royal_zardozi.jpg'],
                    badge: 'New Vrindavan Creation',
                    inStock: true,
                    featured: false,
                    inclusions: ['Poshak', 'Mukut', 'Patka'],
                  });
                  setIsAddModalOpen(true);
                }}
                className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-4 py-2 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Product</span>
              </button>
            )}
          </div>
        </header>

        {/* -------------------------------------------------------------
            TAB 1: DASHBOARD OVERVIEW
        ------------------------------------------------------------- */}
        {activeTab === 'dashboard' && (
          <div className="p-6 sm:p-8 space-y-8 max-w-[1500px]">
            {/* 4 Metric KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3 text-neutral-500 text-xs font-extrabold uppercase tracking-wider">
                  <span>Total Seva Revenue</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-black">
                  ₹{(stats?.totalRevenue || 0).toLocaleString('en-IN')}
                </div>
                <p className="text-[11px] text-neutral-500 mt-2">Completed customer orders</p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3 text-neutral-500 text-xs font-extrabold uppercase tracking-wider">
                  <span>Total Orders</span>
                  <div className="w-8 h-8 rounded-xl bg-[#87D215]/20 text-black flex items-center justify-center">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-black">{orders.length}</div>
                <p className="text-[11px] text-neutral-500 mt-2">
                  <span className="text-amber-600 font-bold">
                    {orders.filter((o) => o.status === 'confirmed').length} new
                  </span>{' '}
                  to pack & dispatch
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3 text-neutral-500 text-xs font-extrabold uppercase tracking-wider">
                  <span>Active Catalog</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Package className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-black">{products.length}</div>
                <p className="text-[11px] text-neutral-500 mt-2">
                  Across {CATEGORIES.length} Vrindavan categories
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs">
                <div className="flex items-center justify-between mb-3 text-neutral-500 text-xs font-extrabold uppercase tracking-wider">
                  <span>Customer Inquiries</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-3xl font-black text-black">{inquiries.length}</div>
                <p className="text-[11px] text-neutral-500 mt-2">
                  <span className="text-blue-600 font-bold">
                    {inquiries.filter((i) => i.status === 'new').length} new
                  </span>{' '}
                  awaiting response
                </p>
              </div>
            </div>

            {/* ── SALE ON/OFF MEGA TOGGLE CARD ── */}
            <div className={`relative rounded-2xl overflow-hidden border-2 transition-all ${
              settings.isSaleActive
                ? 'border-rose-400 bg-gradient-to-r from-rose-50 to-orange-50 shadow-lg shadow-rose-100'
                : 'border-neutral-200 bg-white'
            }`}>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-5 p-5 sm:p-6">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all ${
                    settings.isSaleActive
                      ? 'bg-gradient-to-br from-rose-500 to-orange-500 shadow-lg shadow-rose-200'
                      : 'bg-neutral-100'
                  }`}>
                    <Sparkles className={`w-7 h-7 ${ settings.isSaleActive ? 'text-white' : 'text-neutral-400' }`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-base font-black text-black">Sale Banner</h3>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        settings.isSaleActive
                          ? 'bg-rose-500 text-white animate-pulse'
                          : 'bg-neutral-200 text-neutral-500'
                      }`}>
                        {settings.isSaleActive ? '🔥 LIVE' : 'OFF'}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {settings.isSaleActive
                        ? `"${settings.saleTitle || 'Sale'}" is visible to all customers`
                        : 'Sale popup & banner are hidden from customers'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {/* Big toggle switch */}
                  <button
                    onClick={handleToggleSale}
                    className={`relative w-16 h-8 rounded-full transition-all cursor-pointer shadow-inner ${
                      settings.isSaleActive
                        ? 'bg-gradient-to-r from-rose-500 to-orange-500'
                        : 'bg-neutral-300'
                    }`}
                  >
                    <span className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${
                      settings.isSaleActive ? 'left-9' : 'left-1'
                    }`} />
                  </button>
                  <span className={`text-sm font-black ${
                    settings.isSaleActive ? 'text-rose-600' : 'text-neutral-400'
                  }`}>
                    {settings.isSaleActive ? 'ON' : 'OFF'}
                  </span>

                  <button
                    onClick={() => setActiveTab('sale')}
                    className="ml-2 text-xs font-bold text-neutral-500 hover:text-black border border-neutral-200 hover:border-black px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    Edit →
                  </button>
                </div>
              </div>

              {/* Live indicator bar */}
              {settings.isSaleActive && (
                <div className="h-1 w-full bg-gradient-to-r from-rose-400 via-orange-400 to-yellow-400" />
              )}
            </div>

            {/* Quick Action Shortcuts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('products')}
                className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-black transition-all flex items-center gap-4 text-left group cursor-pointer shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl bg-[#87D215] text-black font-black flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-black">Manage Products</h4>
                  <p className="text-xs text-neutral-500">Edit prices, toggle stock & add items</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-black transition-all flex items-center gap-4 text-left group cursor-pointer shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-black">Dispatch Orders</h4>
                  <p className="text-xs text-neutral-500">Update shipping status & addresses</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className="p-5 rounded-2xl bg-white border border-neutral-200 hover:border-black transition-all flex items-center gap-4 text-left group cursor-pointer shadow-2xs"
              >
                <div className="w-12 h-12 rounded-xl bg-neutral-100 text-black flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Megaphone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-black">Announcement & Banners</h4>
                  <p className="text-xs text-neutral-500">Change top banner text & hero copy</p>
                </div>
              </button>
            </div>

            {/* Recent Orders Section */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-black text-black">Recent Devotee Seva Orders</h3>
                  <p className="text-xs text-neutral-500">Real-time orders stored in MongoDB</p>
                </div>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-black hover:underline cursor-pointer"
                >
                  View all orders ({orders.length}) →
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                      <th className="pb-3 font-bold">Order ID</th>
                      <th className="pb-3 font-bold">Devotee Name</th>
                      <th className="pb-3 font-bold">City</th>
                      <th className="pb-3 font-bold">Amount</th>
                      <th className="pb-3 font-bold">Payment</th>
                      <th className="pb-3 font-bold">Status</th>
                      <th className="pb-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3.5 font-bold font-mono text-black">{order.id}</td>
                        <td className="py-3.5 font-semibold text-neutral-900">
                          {order.customer.fullName}
                        </td>
                        <td className="py-3.5 text-neutral-600">{order.customer.city}</td>
                        <td className="py-3.5 font-black text-black">
                          ₹{order.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 uppercase font-bold text-[10px] text-neutral-600">
                          {order.paymentMethod}
                        </td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                              order.status === 'confirmed'
                                ? 'bg-amber-100 text-amber-800'
                                : order.status === 'processing'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-[#87D215]/30 text-black'
                            }`}
                          >
                            {order.status === 'confirmed' && <Clock className="w-3 h-3" />}
                            {order.status === 'processing' && <Truck className="w-3 h-3" />}
                            {order.status === 'shipped' && <CheckCircle2 className="w-3 h-3" />}
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="px-3 py-1 bg-neutral-100 hover:bg-black hover:text-white rounded-lg font-bold transition-all cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 2: PRODUCTS MANAGEMENT
        ------------------------------------------------------------- */}
        {activeTab === 'products' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-[1500px]">
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xs">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search products by title..."
                  className="w-full bg-neutral-50 border border-neutral-200 text-black text-xs font-semibold rounded-xl pl-9 pr-4 py-2.5 focus:border-black outline-none"
                />
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <span className="text-xs font-bold text-neutral-500 shrink-0">Category:</span>
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-neutral-50 border border-neutral-200 text-black text-xs font-bold rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {(categories.length > 0 ? categories.filter((c) => c.id !== 'all') : CATEGORIES).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label} {'hindiLabel' in c && c.hindiLabel ? `(${c.hindiLabel})` : ''}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 font-bold">Product</th>
                      <th className="py-3 px-4 font-bold">Category</th>
                      <th className="py-3 px-4 font-bold">Price</th>
                      <th className="py-3 px-4 font-bold">Sizes</th>
                      <th className="py-3 px-4 font-bold">Stock Status</th>
                      <th className="py-3 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                              <Image
                                src={p.images[0] || '/images/poshak_royal_zardozi.jpg'}
                                alt={p.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-black line-clamp-1">{p.name}</div>
                              <div className="text-[11px] text-neutral-500 line-clamp-1">
                                {p.hindiName}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <span className="px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold">
                            {p.categoryLabel}
                          </span>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-black text-black">
                            ₹{p.price.toLocaleString('en-IN')}
                          </div>
                          {p.originalPrice > p.price && (
                            <div className="text-[10px] text-neutral-400 line-through">
                              ₹{p.originalPrice.toLocaleString('en-IN')}
                            </div>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-[140px]">
                            {p.sizes.slice(0, 4).map((s) => (
                              <span
                                key={s}
                                className="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] font-bold text-neutral-700"
                              >
                                {s}
                              </span>
                            ))}
                            {p.sizes.length > 4 && (
                              <span className="text-[10px] text-neutral-400">
                                +{p.sizes.length - 4}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => toggleProductStock(p)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition-all ${
                              p.inStock
                                ? 'bg-[#87D215]/25 text-black border border-[#87D215]/50'
                                : 'bg-red-100 text-red-700 border border-red-200'
                            }`}
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${
                                p.inStock ? 'bg-[#87D215]' : 'bg-red-500'
                              }`}
                            />
                            <span>{p.inStock ? 'In Stock' : 'Out of Stock'}</span>
                          </button>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/products/${p.id}`}
                              target="_blank"
                              title="View on Website"
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => openEditModal(p)}
                              title="Edit Product"
                              className="p-1.5 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.name)}
                              title="Delete Product"
                              className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB: CATEGORIES MANAGEMENT (श्रेणी प्रबंधन)
        ------------------------------------------------------------- */}
        {activeTab === 'categories' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-[1500px]">
            {/* Header info card */}
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#87D215] animate-pulse" />
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                    Storefront Categories Live Sync
                  </span>
                </div>
                <h3 className="text-lg font-black text-black">
                  Website Categories & Navigation Tabs
                </h3>
                <p className="text-xs text-neutral-600 max-w-2xl">
                  Yaha se aap website par dikhne wali categories add kar sakte hain. Nayi category turant website ke top category tabs aur filter drawer me update ho jayegi.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={openAddCategoryModal}
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ New Category</span>
                </button>
              </div>
            </div>

            {/* Quick Inspiration Chips */}
            <div className="bg-neutral-100/70 p-4 rounded-2xl border border-neutral-200/80 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-neutral-600 flex items-center gap-1.5 mr-1">
                <Sparkles className="w-3.5 h-3.5 text-[#87D215]" />
                Quick Suggestions:
              </span>
              {[
                { label: 'Silver Flutes & Mor Pankh', hindi: 'चांदी की बांसुरी एवं मोर पंख', slug: 'silver-flutes-mor-pankh' },
                { label: 'Laddu Gopal Beds & Mattresses', hindi: 'बिस्तर एवं गद्दे', slug: 'beds-mattresses' },
                { label: 'Summer Cotton Poshaks', hindi: 'सूती पोशाकें', slug: 'summer-cotton-poshaks' },
                { label: 'Pure Vrindavan Chandan & Attar', hindi: 'चंदन एवं इत्र', slug: 'chandan-attar' },
              ].map((sug, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({
                      label: sug.label,
                      hindiLabel: sug.hindi,
                      categoryId: sug.slug,
                      icon: 'Sparkles',
                    });
                    setIsCategoryModalOpen(true);
                  }}
                  className="text-xs bg-white hover:bg-neutral-200 text-neutral-800 font-semibold px-3 py-1 rounded-lg border border-neutral-200 shadow-2xs transition-colors cursor-pointer"
                >
                  + {sug.label} ({sug.hindi})
                </button>
              ))}
            </div>

            {/* Categories Table */}
            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Category Name (English & Hindi)</th>
                      <th className="py-3.5 px-4 font-bold">Database Slug / ID</th>
                      <th className="py-3.5 px-4 font-bold">Products Linked</th>
                      <th className="py-3.5 px-4 font-bold">Display Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {categories.map((cat) => {
                      const prodCount =
                        cat.id === 'all'
                          ? products.length
                          : products.filter((p) => p.category === cat.id).length;

                      return (
                        <tr key={cat.id} className="hover:bg-neutral-50/70 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 font-bold shrink-0">
                                <Tag className="w-4 h-4 text-[#87D215]" />
                              </div>
                              <div>
                                <div className="font-bold text-black text-sm">{cat.label}</div>
                                <div className="text-[11px] text-neutral-500 font-medium">
                                  {cat.hindiLabel || '—'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-600">
                            <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-800 font-bold">
                              {cat.id}
                            </span>
                          </td>

                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => {
                                setProductCategoryFilter(cat.id);
                                setActiveTab('products');
                              }}
                              className="px-2.5 py-1 rounded-full bg-[#87D215]/20 text-black font-black text-[11px] hover:bg-[#87D215]/40 transition-colors cursor-pointer"
                              title="Click to view products in this category"
                            >
                              {prodCount} Products →
                            </button>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Active on Website
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditCategoryModal(cat)}
                                title="Edit Category"
                                className="p-1.5 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors cursor-pointer"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {cat.id !== 'all' ? (
                                <button
                                  onClick={() => handleDeleteCategory(cat)}
                                  title="Delete Category"
                                  className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              ) : (
                                <span
                                  title="Default category cannot be deleted"
                                  className="p-1.5 text-neutral-300 text-[10px] font-bold cursor-not-allowed"
                                >
                                  Default
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 3: ORDERS MANAGEMENT
        ------------------------------------------------------------- */}
        {activeTab === 'orders' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-[1500px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-neutral-500 mr-2">Filter Orders:</span>
              {['all', 'confirmed', 'processing', 'shipped'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    orderStatusFilter === st
                      ? 'bg-black text-white font-black shadow-xs'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  {st === 'all' ? `All (${orders.length})` : st}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Order ID</th>
                      <th className="py-3.5 px-4 font-bold">Devotee</th>
                      <th className="py-3.5 px-4 font-bold">Contact</th>
                      <th className="py-3.5 px-4 font-bold">Amount</th>
                      <th className="py-3.5 px-4 font-bold">Payment</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">View / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-black">{order.id}</td>
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-black">{order.customer.fullName}</div>
                          <div className="text-[11px] text-neutral-500">
                            {order.customer.city}, {order.customer.state}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="text-neutral-800 font-semibold">{order.customer.phone}</div>
                          <div className="text-[10px] text-neutral-500">{order.customer.email}</div>
                        </td>
                        <td className="py-3.5 px-4 font-black text-black">
                          ₹{order.total.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-neutral-100 text-[10px] font-bold uppercase text-neutral-700">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              handleUpdateOrderStatus(
                                order.id,
                                e.target.value as 'confirmed' | 'processing' | 'shipped'
                              )
                            }
                            className={`text-[11px] font-black rounded-lg px-2.5 py-1 border outline-none cursor-pointer ${
                              order.status === 'confirmed'
                                ? 'bg-amber-50 border-amber-300 text-amber-800'
                                : order.status === 'processing'
                                ? 'bg-blue-50 border-blue-300 text-blue-800'
                                : 'bg-[#87D215]/20 border-[#87D215] text-black'
                            }`}
                          >
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => setViewingOrder(order)}
                            className="px-3 py-1.5 bg-black text-white hover:bg-neutral-800 rounded-lg font-bold transition-all cursor-pointer text-xs"
                          >
                            View Order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 4: CUSTOMER INQUIRIES & MESSAGES
        ------------------------------------------------------------- */}
        {activeTab === 'inquiries' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-[1500px]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-neutral-500 mr-2">Filter Inquiries:</span>
              {['all', 'new', 'replied', 'closed'].map((st) => (
                <button
                  key={st}
                  onClick={() => setInquiryStatusFilter(st)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                    inquiryStatusFilter === st
                      ? 'bg-black text-white font-black shadow-xs'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
                  }`}
                >
                  {st === 'all' ? `All (${inquiries.length})` : st}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4 font-bold">Devotee Name</th>
                      <th className="py-3.5 px-4 font-bold">Phone Number</th>
                      <th className="py-3.5 px-4 font-bold">Deity Size</th>
                      <th className="py-3.5 px-4 font-bold">Subject</th>
                      <th className="py-3.5 px-4 font-bold">Message</th>
                      <th className="py-3.5 px-4 font-bold">Status</th>
                      <th className="py-3.5 px-4 font-bold text-right">Reply via WhatsApp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredInquiries.map((inq) => (
                      <tr key={inq.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-black">{inq.name}</td>
                        <td className="py-3.5 px-4 font-semibold text-neutral-800">{inq.phone}</td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-neutral-100 font-bold text-neutral-700">
                            No. {inq.deitySize}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-neutral-900">{inq.inquiryType}</td>
                        <td className="py-3.5 px-4 max-w-xs truncate text-neutral-600" title={inq.message}>
                          {inq.message || '—'}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={inq.status}
                            onChange={(e) =>
                              handleUpdateInquiryStatus(
                                inq.id,
                                e.target.value as 'new' | 'replied' | 'closed'
                              )
                            }
                            className={`text-[11px] font-bold rounded-lg px-2 py-1 border outline-none cursor-pointer ${
                              inq.status === 'new'
                                ? 'bg-blue-50 border-blue-300 text-blue-800 font-black'
                                : inq.status === 'replied'
                                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                                : 'bg-neutral-100 border-neutral-300 text-neutral-600'
                            }`}
                          >
                            <option value="new">New</option>
                            <option value="replied">Replied</option>
                            <option value="closed">Closed</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <a
                            href={`https://wa.me/91${inq.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                              `Radhe Radhe ${inq.name}! Thank you for reaching out to BroCART regarding your Laddu Gopal Ji (Size ${inq.deitySize}). How can we serve you today?`
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-[11px] shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5 fill-white" />
                            <span>Reply</span>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB X: USERS MANAGEMENT
        ------------------------------------------------------------- */}
        {activeTab === 'users' && (
          <div className="p-6 sm:p-8 animate-in fade-in max-w-7xl mx-auto w-full">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-black flex items-center gap-2">
                  <Users className="w-6 h-6 text-[#87D215]" />
                  User Database
                </h3>
                <p className="text-sm text-neutral-500 font-bold mt-1">
                  View all registered devotees & customers ({usersList.length} total)
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-2xs p-6 overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead>
                  <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[11px]">
                    <th className="pb-3 font-bold px-2">Name</th>
                    <th className="pb-3 font-bold px-2">Email</th>
                    <th className="pb-3 font-bold px-2">Role</th>
                    <th className="pb-3 font-bold px-2">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {usersList.length > 0 ? usersList.map((usr, i) => (
                    <tr key={i} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3.5 font-bold text-black px-2 capitalize">{usr.firstName} {usr.lastName}</td>
                      <td className="py-3.5 text-neutral-600 px-2">{usr.email}</td>
                      <td className="py-3.5 px-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${usr.role === 'admin' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-800'}`}>
                          {usr.role || 'user'}
                        </span>
                      </td>
                      <td className="py-3.5 text-neutral-600 px-2 font-mono">
                        {new Date(usr.createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-neutral-500 font-bold">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 5: COUPONS & DISCOUNTS
        ------------------------------------------------------------- */}
        {activeTab === 'coupons' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-3xl">
            <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-black text-black">Promo Coupon Code Management</h3>
                <p className="text-xs text-neutral-500">
                  Control the promotional discount code applied at checkout by devotees.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                <div>
                  <label className="block text-neutral-700 mb-1">Coupon Code (e.g. RADHE10)</label>
                  <input
                    type="text"
                    value={settings.couponCode}
                    onChange={(e) => setSettings({ ...settings, couponCode: e.target.value.toUpperCase() })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 font-mono font-bold text-black outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Discount Percentage (%)</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={settings.couponDiscountPercent}
                    onChange={(e) => setSettings({ ...settings, couponDiscountPercent: Number(e.target.value) })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 font-bold text-black outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="couponActiveCheck"
                  checked={settings.isCouponActive}
                  onChange={(e) => setSettings({ ...settings, isCouponActive: e.target.checked })}
                  className="w-4 h-4 accent-[#87D215] cursor-pointer"
                />
                <label htmlFor="couponActiveCheck" className="text-xs font-bold text-neutral-800 cursor-pointer">
                  Activate this promo coupon across checkout ({settings.couponDiscountPercent}% OFF)
                </label>
              </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Saving...' : 'Save Coupon Rules'}</span>
                </button>
              </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB: SHIPPING
        ------------------------------------------------------------- */}
        {activeTab === 'shipping' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#87D215]/40 shadow-2xs">
              <form onSubmit={handleSaveSettings} className="space-y-6">
                <div>
                  <h4 className="text-sm font-black text-black mb-1">Free Shipping Policy & Flat Rate</h4>
                  <div className="flex flex-col sm:flex-row gap-4 w-full text-xs font-bold">
                    <div className="w-full sm:w-1/2">
                      <label className="block text-neutral-700 mb-1">Free Express Delivery Threshold (₹)</label>
                      <input
                        type="number"
                        value={settings.freeShippingThreshold}
                        onChange={(e) => setSettings({ ...settings, freeShippingThreshold: Number(e.target.value) })}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 font-bold text-black outline-none focus:border-black"
                      />
                    </div>
                    <div className="w-full sm:w-1/2">
                      <label className="block text-neutral-700 mb-1">Standard Flat Shipping Charge (₹)</label>
                      <input
                        type="number"
                        value={settings.flatShippingFee}
                        onChange={(e) => setSettings({ ...settings, flatShippingFee: Number(e.target.value) })}
                        className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 font-bold text-black outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Saving...' : 'Save Shipping Rules'}</span>
                </button>
              </form>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB X: SALE & PROMOTIONAL OFFERS
        ------------------------------------------------------------- */}
        {activeTab === 'sale' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-3xl">
            <form onSubmit={handleSaveSettings} className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-rose-500" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-black">Sale & Promotional Offers</h3>
                  <p className="text-xs text-neutral-500">
                    Control the promotional sale banner displayed prominently on the homepage.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                <div>
                  <label className="block text-neutral-700 mb-1">Sale Title (e.g. DIWALI MAHA SALE)</label>
                  <input
                    type="text"
                    value={settings.saleTitle || ''}
                    onChange={(e) => setSettings({ ...settings, saleTitle: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-neutral-700 mb-1">Sale Description & Details</label>
                  <input
                    type="text"
                    value={settings.saleDescription || ''}
                    onChange={(e) => setSettings({ ...settings, saleDescription: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                  />
                </div>
              </div>

              <ImageUploader
                label="Banner Background Image — Local Upload ya URL (Optional)"
                value={settings.saleImageUrl || ''}
                onChange={(url) => setSettings({ ...settings, saleImageUrl: url })}
                placeholder="/images/diwali-banner.jpg  ya  https://..."
                previewSize="lg"
              />

              <div className="flex items-center gap-3 pt-4 border-t border-neutral-200">
                <input
                  type="checkbox"
                  id="saleActiveTab"
                  checked={settings.isSaleActive || false}
                  onChange={(e) => setSettings({ ...settings, isSaleActive: e.target.checked })}
                  className="w-5 h-5 accent-rose-500 cursor-pointer"
                />
                <label htmlFor="saleActiveTab" className="text-sm font-bold text-neutral-900 cursor-pointer">
                  Activate this Sale Banner on the Website
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-rose-500 hover:bg-rose-600 text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isLoading ? 'Saving...' : 'Save Sale Settings'}</span>
              </button>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB: HEADER SETTINGS
        ------------------------------------------------------------- */}
        {activeTab === 'header' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
            <form onSubmit={handleSaveSettings} className="space-y-6">

              {/* ── STORE IDENTITY ── */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#87D215]/40 shadow-2xs space-y-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-[#87D215] flex items-center justify-center text-black font-black text-lg">
                    {settings.logoUrl ? (
                      <img src={settings.logoUrl} alt="logo" className="w-8 h-8 object-contain rounded-lg" />
                    ) : (
                      <span>{(settings.storeName || 'B').charAt(0).toUpperCase()}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-black">Store Identity (स्टोर पहचान)</h3>
                    <p className="text-xs text-neutral-500">Store ka naam aur logo badlo — website ke header, admin aur footer mein dikha</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="block text-neutral-700 mb-1">Store Name (स्टोर का नाम) ✦</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      placeholder="e.g. BroCART, ShreeKanha Store..."
                      className="w-full bg-neutral-50 border-2 border-[#87D215]/50 rounded-xl p-3 outline-none focus:border-[#87D215] font-bold text-black text-sm"
                    />
                    <p className="text-[10px] text-neutral-400 mt-1">Ye naam header, admin panel aur footer par show hoga</p>
                  </div>

                  <div>
                    <label className="block text-neutral-700 mb-1">Store Tagline (टैगलाइन)</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      placeholder="e.g. Vrindavan Handcrafted Store"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 outline-none focus:border-black font-semibold text-black"
                    />
                  </div>
                </div>

                <ImageUploader
                  label="Store Logo (लोगो) — Local Upload ya URL"
                  value={settings.logoUrl || ''}
                  onChange={(url) => setSettings({ ...settings, logoUrl: url })}
                  placeholder="/images/mylogo.png  ya  https://..."
                  previewSize="md"
                />

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Saving...' : 'Save Store Identity'}</span>
                </button>
              </div>

              {/* Announcement Bar Settings */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <Megaphone className="w-5 h-5 text-[#87D215]" />
                  <div>
                    <h3 className="text-base font-black text-black">Top Header Announcement Bar</h3>
                    <p className="text-xs text-neutral-500">
                      The top notification banner displayed above the navigation bar.
                    </p>
                  </div>
                </div>

                <div className="text-xs font-bold space-y-2">
                  <label className="block text-neutral-700">Announcement Text</label>
                  <input
                    type="text"
                    value={settings.announcementText}
                    onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 outline-none focus:border-black font-semibold text-black"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="announcementActive"
                    checked={settings.isAnnouncementActive}
                    onChange={(e) => setSettings({ ...settings, isAnnouncementActive: e.target.checked })}
                    className="w-4 h-4 accent-[#87D215] cursor-pointer"
                  />
                  <label htmlFor="announcementActive" className="text-xs font-bold text-neutral-800 cursor-pointer">
                    Display Announcement Bar on Website
                  </label>
                </div>
                
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Saving...' : 'Save Announcement'}</span>
                </button>
              </div>

              {/* Header Navigation Links */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <h3 className="text-base font-black text-black">Header Navigation Links</h3>
                <p className="text-xs text-neutral-500">Manage the top navigation menu items (e.g., Home, About Us, Shop).</p>
                <div className="space-y-2 pt-2">
                  {settings.headerLinks?.map((link, index) => (
                    <div key={index} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                      <input
                        type="text"
                        placeholder="Label"
                        value={link.label}
                        onChange={(e) => {
                          const newLinks = [...(settings.headerLinks || [])];
                          newLinks[index].label = e.target.value;
                          setSettings({ ...settings, headerLinks: newLinks });
                        }}
                        className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl p-2 text-xs outline-none focus:border-black font-bold"
                      />
                      <input
                        type="text"
                        placeholder="URL (e.g. /shop)"
                        value={link.url}
                        onChange={(e) => {
                          const newLinks = [...(settings.headerLinks || [])];
                          newLinks[index].url = e.target.value;
                          setSettings({ ...settings, headerLinks: newLinks });
                        }}
                        className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl p-2 text-xs outline-none focus:border-black font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newLinks = settings.headerLinks?.filter((_, i) => i !== index);
                          setSettings({ ...settings, headerLinks: newLinks });
                        }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, headerLinks: [...(settings.headerLinks || []), { label: 'New Link', url: '/' }] })}
                    className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer inline-block mt-2"
                  >
                    + Add Header Link
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Saving...' : 'Save Navigation Links'}</span>
                </button>
              </div>

            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB 6: SITE CONTENT, BANNERS & DATABASE
        ------------------------------------------------------------- */}
        {activeTab === 'settings' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
            <form onSubmit={handleSaveSettings} className="space-y-6">

              {/* Store Helpline & Contact */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <h3 className="text-base font-black text-black">Store Helpline & Address Info</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="block text-neutral-700 mb-1">Customer Support Phone</label>
                    <input
                      type="text"
                      value={settings.helplinePhone}
                      onChange={(e) => setSettings({ ...settings, helplinePhone: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 mb-1">WhatsApp Support Number (without +)</label>
                    <input
                      type="text"
                      value={settings.whatsappPhone}
                      onChange={(e) => setSettings({ ...settings, whatsappPhone: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 mb-1">Devotee Seva Email</label>
                    <input
                      type="email"
                      value={settings.supportEmail}
                      onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 mb-1">Physical Store Address</label>
                    <input
                      type="text"
                      value={settings.storeAddress}
                      onChange={(e) => setSettings({ ...settings, storeAddress: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Store Filters (Colors & Sizes) */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="w-6 h-6 text-black" />
                  <h3 className="text-base font-black text-black">Store Filters (Colors & Sizes)</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Colors */}
                  <div>
                    <h4 className="text-sm font-bold text-black mb-3">Filter Colors</h4>
                    <div className="space-y-2">
                      {settings.filterColors?.map((color, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => {
                              const newColors = [...(settings.filterColors || [])];
                              newColors[index] = e.target.value;
                              setSettings({ ...settings, filterColors: newColors });
                            }}
                            className="flex-1 bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-xs outline-none focus:border-black text-black font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newColors = (settings.filterColors || []).filter((_, i) => i !== index);
                              setSettings({ ...settings, filterColors: newColors });
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, filterColors: [...(settings.filterColors || []), 'New Color'] })}
                        className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                      >
                        + Add Color
                      </button>
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h4 className="text-sm font-bold text-black mb-3">Filter Sizes (Deity Size)</h4>
                    <div className="space-y-2">
                      {settings.filterSizes?.map((size, index) => (
                        <div key={index} className="flex gap-2">
                          <input
                            type="text"
                            value={size}
                            onChange={(e) => {
                              const newSizes = [...(settings.filterSizes || [])];
                              newSizes[index] = e.target.value;
                              setSettings({ ...settings, filterSizes: newSizes });
                            }}
                            className="flex-1 bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-xs outline-none focus:border-black text-black font-bold"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newSizes = (settings.filterSizes || []).filter((_, i) => i !== index);
                              setSettings({ ...settings, filterSizes: newSizes });
                            }}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, filterSizes: [...(settings.filterSizes || []), 'New Size'] })}
                        className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                      >
                        + Add Size
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Saving...' : 'Save Site Settings'}</span>
                </button>
              </div>
            </form>

            {/* MongoDB Atlas Info Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-black text-[#87D215] flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-black">MongoDB Cloud Database: `brocart`</h3>
                    <p className="text-xs text-neutral-500">Live MongoDB Atlas Cluster synchronization</p>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#87D215]/20 text-black font-black text-xs border border-[#87D215]/50 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#87D215] animate-pulse" />
                  Live & Connected
                </span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">
                <div className="font-bold text-black">Database Name: <code className="text-emerald-700">brocart</code></div>
                <div className="text-neutral-500 text-[11px]">Collections: <code className="bg-neutral-200 px-1 py-0.5 rounded text-black font-semibold">products</code>, <code className="bg-neutral-200 px-1 py-0.5 rounded text-black font-semibold">orders</code>, <code className="bg-neutral-200 px-1 py-0.5 rounded text-black font-semibold">inquiries</code>, <code className="bg-neutral-200 px-1 py-0.5 rounded text-black font-semibold">sitesettings</code></div>
              </div>

              <button
                type="button"
                onClick={handleSeedMongoDB}
                className="bg-black hover:bg-neutral-800 text-white font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm"
              >
                <RefreshCw className="w-4 h-4 text-[#87D215]" />
                <span>Re-Sync Vrindavan Default Products to MongoDB</span>
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB: FOOTER SETTINGS
        ------------------------------------------------------------- */}
        {activeTab === 'footer' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
            <form onSubmit={handleSaveSettings} className="space-y-6">

              {/* Footer Links Management */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <h3 className="text-base font-black text-black">Footer Links Management</h3>
                
                <div className="pt-2">
                  <h4 className="text-sm font-bold text-black mb-2">Collections Links</h4>
                  <div className="space-y-2">
                    {settings.footerCollections?.map((col, index) => (
                      <div key={index} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                        <input
                          type="text"
                          placeholder="Label"
                          value={col.label}
                          onChange={(e) => {
                            const newCols = [...settings.footerCollections];
                            newCols[index].label = e.target.value;
                            setSettings({ ...settings, footerCollections: newCols });
                          }}
                          className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl p-2 text-xs outline-none focus:border-black"
                        />
                        <input
                          type="text"
                          placeholder="URL (e.g. /#catalog-section)"
                          value={col.url}
                          onChange={(e) => {
                            const newCols = [...settings.footerCollections];
                            newCols[index].url = e.target.value;
                            setSettings({ ...settings, footerCollections: newCols });
                          }}
                          className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl p-2 text-xs outline-none focus:border-black"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newCols = settings.footerCollections.filter((_, i) => i !== index);
                            setSettings({ ...settings, footerCollections: newCols });
                          }}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, footerCollections: [...(settings.footerCollections || []), { label: 'New Link', url: '/' }] })}
                      className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                    >
                      + Add Collection Link
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <h4 className="text-sm font-bold text-black mb-2">Shop by Size Links</h4>
                  <div className="space-y-2">
                    {settings.footerSizes?.map((size, index) => (
                      <div key={index} className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                        <input
                          type="text"
                          placeholder="Label"
                          value={size.label}
                          onChange={(e) => {
                            const newSizes = [...settings.footerSizes];
                            newSizes[index].label = e.target.value;
                            setSettings({ ...settings, footerSizes: newSizes });
                          }}
                          className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl p-2 text-xs outline-none focus:border-black"
                        />
                        <input
                          type="text"
                          placeholder="URL (leave empty for Size Guide trigger)"
                          value={size.url}
                          onChange={(e) => {
                            const newSizes = [...settings.footerSizes];
                            newSizes[index].url = e.target.value;
                            setSettings({ ...settings, footerSizes: newSizes });
                          }}
                          className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl p-2 text-xs outline-none focus:border-black"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newSizes = settings.footerSizes.filter((_, i) => i !== index);
                            setSettings({ ...settings, footerSizes: newSizes });
                          }}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, footerSizes: [...(settings.footerSizes || []), { label: 'New Size', url: '' }] })}
                      className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                    >
                      + Add Size Link
                    </button>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-200">
                  <h4 className="text-sm font-bold text-black mb-2">Seva Promises</h4>
                  <div className="space-y-2">
                    {settings.footerPromises?.map((promise, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={promise}
                          onChange={(e) => {
                            const newPromises = [...settings.footerPromises];
                            newPromises[index] = e.target.value;
                            setSettings({ ...settings, footerPromises: newPromises });
                          }}
                          className="flex-1 bg-neutral-50 border border-neutral-300 rounded-xl p-2 text-xs outline-none focus:border-black"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newPromises = settings.footerPromises.filter((_, i) => i !== index);
                            setSettings({ ...settings, footerPromises: newPromises });
                          }}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, footerPromises: [...(settings.footerPromises || []), 'New Promise'] })}
                      className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                    >
                      + Add Promise
                    </button>
                  </div>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="text-sm font-bold text-black mb-2">Social Media Links</h4>
                  <div className="space-y-4">
                    {settings.footerSocialLinks?.map((social, index) => (
                      <div key={index} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Platform Name (e.g. Instagram)"
                            value={social.platform}
                            onChange={(e) => {
                              const newLinks = [...settings.footerSocialLinks];
                              newLinks[index].platform = e.target.value;
                              setSettings({ ...settings, footerSocialLinks: newLinks });
                            }}
                            className="flex-1 bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newLinks = settings.footerSocialLinks.filter((_, i) => i !== index);
                              setSettings({ ...settings, footerSocialLinks: newLinks });
                            }}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <ImageUploader
                          label="Platform Icon (Upload or Paste Link)"
                          value={social.iconUrl}
                          onChange={(url) => {
                            const newLinks = [...settings.footerSocialLinks];
                            newLinks[index].iconUrl = url;
                            setSettings({ ...settings, footerSocialLinks: newLinks });
                          }}
                          placeholder="/images/icon.png"
                          previewSize="sm"
                        />
                        <input
                          type="text"
                          placeholder="Profile URL"
                          value={social.url}
                          onChange={(e) => {
                            const newLinks = [...settings.footerSocialLinks];
                            newLinks[index].url = e.target.value;
                            setSettings({ ...settings, footerSocialLinks: newLinks });
                          }}
                          className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, footerSocialLinks: [...(settings.footerSocialLinks || []), { platform: '', iconUrl: '', url: '' }] })}
                      className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                    >
                      + Add Social Link
                    </button>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <h4 className="text-sm font-bold text-black mb-2">Payment Methods</h4>
                  <div className="space-y-4">
                    {settings.footerPaymentMethods?.map((payment, index) => (
                      <div key={index} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Payment Name (e.g. Visa)"
                            value={payment.name}
                            onChange={(e) => {
                              const newLinks = [...settings.footerPaymentMethods];
                              newLinks[index].name = e.target.value;
                              setSettings({ ...settings, footerPaymentMethods: newLinks });
                            }}
                            className="flex-1 bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newLinks = settings.footerPaymentMethods.filter((_, i) => i !== index);
                              setSettings({ ...settings, footerPaymentMethods: newLinks });
                            }}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <ImageUploader
                          label="Payment Icon (Upload or Paste Link)"
                          value={payment.iconUrl}
                          onChange={(url) => {
                            const newLinks = [...settings.footerPaymentMethods];
                            newLinks[index].iconUrl = url;
                            setSettings({ ...settings, footerPaymentMethods: newLinks });
                          }}
                          placeholder="/images/icon.png"
                          previewSize="sm"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, footerPaymentMethods: [...(settings.footerPaymentMethods || []), { name: '', iconUrl: '' }] })}
                      className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                    >
                      + Add Payment Method
                    </button>
                  </div>
                </div>

                {/* Partner Platforms */}
                <div>
                  <h4 className="text-sm font-bold text-black mb-2">Partner Platforms</h4>
                  <div className="space-y-4">
                    {settings.footerPartnerPlatforms?.map((partner, index) => (
                      <div key={index} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            placeholder="Platform Name (e.g. Amazon)"
                            value={partner.name}
                            onChange={(e) => {
                              const newLinks = [...settings.footerPartnerPlatforms];
                              newLinks[index].name = e.target.value;
                              setSettings({ ...settings, footerPartnerPlatforms: newLinks });
                            }}
                            className="flex-1 bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newLinks = settings.footerPartnerPlatforms.filter((_, i) => i !== index);
                              setSettings({ ...settings, footerPartnerPlatforms: newLinks });
                            }}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <ImageUploader
                          label="Partner Logo (Upload or Paste Link)"
                          value={partner.iconUrl}
                          onChange={(url) => {
                            const newLinks = [...settings.footerPartnerPlatforms];
                            newLinks[index].iconUrl = url;
                            setSettings({ ...settings, footerPartnerPlatforms: newLinks });
                          }}
                          placeholder="/images/icon.png"
                          previewSize="sm"
                        />
                        <input
                          type="text"
                          placeholder="Store URL"
                          value={partner.url}
                          onChange={(e) => {
                            const newLinks = [...settings.footerPartnerPlatforms];
                            newLinks[index].url = e.target.value;
                            setSettings({ ...settings, footerPartnerPlatforms: newLinks });
                          }}
                          className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black"
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, footerPartnerPlatforms: [...(settings.footerPartnerPlatforms || []), { name: '', iconUrl: '', url: '' }] })}
                      className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                    >
                      + Add Partner Platform
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Saving...' : 'Save Footer Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB: PAYMENT OPTIONS
        ------------------------------------------------------------- */}
        {activeTab === 'payments' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* ── PAYMENT GATEWAY SETTINGS ── */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#87D215]/40 shadow-2xs space-y-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-xl bg-[#87D215] flex items-center justify-center text-black font-black">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-black">Payment Gateway (Razorpay)</h3>
                    <p className="text-xs text-neutral-500">Configure Razorpay API keys for online payments at checkout</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                  <input
                    type="checkbox"
                    id="razorpayEnableCheck2"
                    checked={settings.isRazorpayEnabled}
                    onChange={(e) => setSettings({ ...settings, isRazorpayEnabled: e.target.checked })}
                    className="w-5 h-5 accent-[#87D215] cursor-pointer"
                  />
                  <label htmlFor="razorpayEnableCheck2" className="text-sm font-bold text-black cursor-pointer select-none">
                    Enable Razorpay Online Payments
                  </label>
                </div>

                {settings.isRazorpayEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold bg-neutral-50/50 p-4 rounded-xl border border-neutral-200">
                    <div>
                      <label className="block text-neutral-700 mb-1">Razorpay Key ID</label>
                      <input
                        type="text"
                        value={settings.razorpayKeyId}
                        onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                        placeholder="rzp_test_..."
                        className="w-full bg-white border border-neutral-300 rounded-xl p-3 outline-none focus:border-black font-mono text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-700 mb-1">Razorpay Key Secret</label>
                      <input
                        type="password"
                        value={settings.razorpayKeySecret}
                        onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full bg-white border border-neutral-300 rounded-xl p-3 outline-none focus:border-black font-mono text-black"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t border-neutral-200">
                  <h4 className="text-sm font-bold text-black mb-2">Manual UPI Payment</h4>
                  <p className="text-[11px] text-neutral-500 mb-3">If Razorpay is disabled, users will scan this UPI ID to pay manually. Enter your Business UPI ID below.</p>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Business UPI ID (e.g. name@okhdfcbank)</label>
                  <input
                    type="text"
                    value={settings.manualUpiId || ''}
                    onChange={(e) => setSettings({ ...settings, manualUpiId: e.target.value })}
                    placeholder="business@upi"
                    className="w-full sm:w-1/2 bg-neutral-50 border border-neutral-300 rounded-xl p-3 outline-none focus:border-black font-mono text-black text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-black hover:bg-neutral-800 text-white font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Saving...' : 'Save Payment Settings'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB: PAGES CONTENT
        ------------------------------------------------------------- */}
        {activeTab === 'pages' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
            <form onSubmit={handleSaveSettings} className="space-y-6">

              {/* About Us Page Content */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border-2 border-[#87D215]/40 shadow-2xs space-y-5">
                <div className="flex items-center gap-3 mb-4">
                  <Layers className="w-6 h-6 text-[#87D215]" />
                  <div>
                    <h3 className="text-base font-black text-black">About Us Page Content</h3>
                    <p className="text-xs text-neutral-500">Manage the content displayed on the About Us page.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="block text-neutral-700 mb-1">Header Title</label>
                    <input
                      type="text"
                      value={settings.aboutTitle || ''}
                      onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                      placeholder="e.g. About Us"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Header Description</label>
                    <input
                      type="text"
                      value={settings.aboutDescription || ''}
                      onChange={(e) => setSettings({ ...settings, aboutDescription: e.target.value })}
                      placeholder="Header description..."
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                </div>

                <div className="text-xs font-bold mt-4">
                  <label className="block text-neutral-700 mb-1">Main Story Title</label>
                  <input
                    type="text"
                    value={settings.aboutStoryTitle || ''}
                    onChange={(e) => setSettings({ ...settings, aboutStoryTitle: e.target.value })}
                    placeholder="e.g. Rooted in the Sacred Soil of Vrindavan Dham"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                  />
                </div>

                <div className="text-xs font-bold mt-4">
                  <label className="block text-neutral-700 mb-1">Main Story Text</label>
                  <textarea
                    rows={5}
                    value={settings.aboutStoryText || ''}
                    onChange={(e) => setSettings({ ...settings, aboutStoryText: e.target.value })}
                    placeholder="Tell your store's story..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-4 outline-none focus:border-black text-black"
                  />
                </div>

                <div className="mt-4">
                  <ImageUploader
                    label="About Us Main Image — Local Upload ya URL"
                    value={settings.aboutImage || ''}
                    onChange={(url) => setSettings({ ...settings, aboutImage: url })}
                    placeholder="/images/poshak_royal_zardozi.jpg"
                    previewSize="lg"
                  />
                </div>
              </div>

              {/* Contact Us Page Content */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Phone className="w-6 h-6 text-black" />
                  <div>
                    <h3 className="text-base font-black text-black">Contact Us Page Content</h3>
                    <p className="text-xs text-neutral-500">Manage the text displayed on the Contact Us page header.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="block text-neutral-700 mb-1">Header Title</label>
                    <input
                      type="text"
                      value={settings.contactTitle || ''}
                      onChange={(e) => setSettings({ ...settings, contactTitle: e.target.value })}
                      placeholder="e.g. Contact Us"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Header Description</label>
                    <input
                      type="text"
                      value={settings.contactDescription || ''}
                      onChange={(e) => setSettings({ ...settings, contactDescription: e.target.value })}
                      placeholder="Contact page description..."
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-neutral-400 mt-2">
                  Note: Phone numbers and address on the Contact Us page are taken from the "Site Banners & Info" tab.
                </p>

                <div className="text-xs font-bold mt-4">
                  <label className="block text-neutral-700 mb-1">Google Map Embed (iframe src URL)</label>
                  <input
                    type="text"
                    value={settings.contactMapIframe || ''}
                    onChange={(e) => setSettings({ ...settings, contactMapIframe: e.target.value })}
                    placeholder="https://www.google.com/maps/embed?..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                  />
                  <p className="text-[10px] text-neutral-400 font-normal mt-1">Paste the 'src' link from a Google Maps embed code.</p>
                </div>

                <div className="pt-4 border-t border-neutral-200 mt-4">
                  <h4 className="text-sm font-bold text-black mb-2">Frequently Asked Questions (FAQs)</h4>
                  <div className="space-y-4">
                    {settings.contactFaqs?.map((faq, index) => (
                      <div key={index} className="flex gap-2 items-start bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => {
                              const newFaqs = [...settings.contactFaqs];
                              newFaqs[index].question = e.target.value;
                              setSettings({ ...settings, contactFaqs: newFaqs });
                            }}
                            placeholder="Question"
                            className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black text-black"
                          />
                          <textarea
                            rows={2}
                            value={faq.answer}
                            onChange={(e) => {
                              const newFaqs = [...settings.contactFaqs];
                              newFaqs[index].answer = e.target.value;
                              setSettings({ ...settings, contactFaqs: newFaqs });
                            }}
                            placeholder="Answer"
                            className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs outline-none focus:border-black text-black"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            const newFaqs = settings.contactFaqs.filter((_, i) => i !== index);
                            setSettings({ ...settings, contactFaqs: newFaqs });
                          }}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer shrink-0"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => setSettings({ ...settings, contactFaqs: [...(settings.contactFaqs || []), { question: '', answer: '' }] })}
                      className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                    >
                      + Add New FAQ
                    </button>
                  </div>
                </div>
              </div>

              {/* About Us - Metrics */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-6 h-6 text-black" />
                  <h3 className="text-base font-black text-black">About Us: Key Metrics</h3>
                </div>
                <div className="space-y-3">
                  {settings.aboutMetrics?.map((metric, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={metric.value}
                        onChange={(e) => {
                          const newMetrics = [...settings.aboutMetrics];
                          newMetrics[index].value = e.target.value;
                          setSettings({ ...settings, aboutMetrics: newMetrics });
                        }}
                        placeholder="e.g. 50,000+"
                        className="w-1/3 bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black text-black"
                      />
                      <input
                        type="text"
                        value={metric.label}
                        onChange={(e) => {
                          const newMetrics = [...settings.aboutMetrics];
                          newMetrics[index].label = e.target.value;
                          setSettings({ ...settings, aboutMetrics: newMetrics });
                        }}
                        placeholder="e.g. Devotees Blessed"
                        className="flex-1 bg-neutral-50 border border-neutral-300 rounded-lg p-2 text-xs outline-none focus:border-black text-black"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newMetrics = settings.aboutMetrics.filter((_, i) => i !== index);
                          setSettings({ ...settings, aboutMetrics: newMetrics });
                        }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, aboutMetrics: [...(settings.aboutMetrics || []), { value: '', label: '' }] })}
                    className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                  >
                    + Add Metric
                  </button>
                </div>
              </div>

              {/* About Us - Four Pillars */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-black" />
                  <h3 className="text-base font-black text-black">About Us: Pillars of Our Craft</h3>
                </div>
                
                <div className="text-xs font-bold mb-4">
                  <label className="block text-neutral-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={settings.aboutPillarsTitle || ''}
                    onChange={(e) => setSettings({ ...settings, aboutPillarsTitle: e.target.value })}
                    placeholder="e.g. Four Pillars of Our Craft"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                  />
                </div>

                <div className="space-y-4">
                  {settings.aboutPillars?.map((pillar, index) => (
                    <div key={index} className="flex gap-2 items-start bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={pillar.title}
                          onChange={(e) => {
                            const newPillars = [...settings.aboutPillars];
                            newPillars[index].title = e.target.value;
                            setSettings({ ...settings, aboutPillars: newPillars });
                          }}
                          placeholder="Pillar Title (e.g. IDOL-SAFE FABRICS)"
                          className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black text-black"
                        />
                        <textarea
                          rows={2}
                          value={pillar.description}
                          onChange={(e) => {
                            const newPillars = [...settings.aboutPillars];
                            newPillars[index].description = e.target.value;
                            setSettings({ ...settings, aboutPillars: newPillars });
                          }}
                          placeholder="Pillar Description"
                          className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs outline-none focus:border-black text-black"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newPillars = settings.aboutPillars.filter((_, i) => i !== index);
                          setSettings({ ...settings, aboutPillars: newPillars });
                        }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, aboutPillars: [...(settings.aboutPillars || []), { title: '', description: '' }] })}
                    className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                  >
                    + Add Pillar
                  </button>
                </div>
              </div>

              {/* About Us - Empowering Section */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-black" />
                  <h3 className="text-base font-black text-black">About Us: Empowering Artisans Section</h3>
                </div>
                
                <div className="text-xs font-bold mb-4">
                  <label className="block text-neutral-700 mb-1">Section Title</label>
                  <input
                    type="text"
                    value={settings.aboutEmpowerTitle || ''}
                    onChange={(e) => setSettings({ ...settings, aboutEmpowerTitle: e.target.value })}
                    placeholder="e.g. Empowering Over 60 Women..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                  />
                </div>

                <div className="text-xs font-bold mt-4">
                  <label className="block text-neutral-700 mb-1">Section Text</label>
                  <textarea
                    rows={4}
                    value={settings.aboutEmpowerText || ''}
                    onChange={(e) => setSettings({ ...settings, aboutEmpowerText: e.target.value })}
                    placeholder="Describe how you empower artisans..."
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-4 outline-none focus:border-black text-black"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                  <ImageUploader
                    label="Artisan Image 1"
                    value={settings.aboutEmpowerImage1 || ''}
                    onChange={(url) => setSettings({ ...settings, aboutEmpowerImage1: url })}
                    placeholder="/images/vrindavan_artisan.jpg"
                    previewSize="md"
                  />
                  <ImageUploader
                    label="Artisan Image 2"
                    value={settings.aboutEmpowerImage2 || ''}
                    onChange={(url) => setSettings({ ...settings, aboutEmpowerImage2: url })}
                    placeholder="/images/laddu_gopal_shringar.jpg"
                    previewSize="md"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Saving...' : 'Save Pages Content'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* -------------------------------------------------------------
            TAB: HOME PAGE CONTENT
        ------------------------------------------------------------- */}
        {activeTab === 'homepage' && (
          <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-lg">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-black tracking-tight">Home Page Content</h2>
                <p className="text-sm text-neutral-500 mt-1">Manage texts, images, and reviews for the Home page.</p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              
              {/* Hero Section Images */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <ImageIcon className="w-6 h-6 text-black" />
                  <h3 className="text-base font-black text-black">Hero Section Images (3D Corridor)</h3>
                </div>
                
                <div className="space-y-4">
                  {(settings.homeHeroImages || []).map((imgUrl: string, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                      <div className="flex-1">
                        <ImageUploader
                          value={imgUrl}
                          onChange={(url) => {
                            const newArr = [...(settings.homeHeroImages || [])];
                            newArr[idx] = url;
                            setSettings({ ...settings, homeHeroImages: newArr });
                          }}
                          label={`Image ${idx + 1}`}
                          previewSize="lg"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newArr = [...(settings.homeHeroImages || [])];
                          newArr.splice(idx, 1);
                          setSettings({ ...settings, homeHeroImages: newArr });
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer mt-6"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newArr = [...(settings.homeHeroImages || [])];
                      newArr.push('');
                      setSettings({ ...settings, homeHeroImages: newArr });
                    }}
                    className="w-full py-3 border-2 border-dashed border-neutral-300 text-neutral-600 font-bold text-xs rounded-xl hover:border-black hover:text-black transition-colors cursor-pointer"
                  >
                    + Add Hero Image
                  </button>
                </div>
              </div>

              {/* Hero Section Texts */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <LayoutDashboard className="w-6 h-6 text-black" />
                  <h3 className="text-base font-black text-black">Hero Section Texts</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                  <div>
                    <label className="block text-neutral-700 mb-1">Top Badge Text</label>
                    <input
                      type="text"
                      value={settings.homeHeroBadge || ''}
                      onChange={(e) => setSettings({ ...settings, homeHeroBadge: e.target.value })}
                      placeholder="e.g. Vrindavan Sacred Craft..."
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Title Line 1</label>
                    <input
                      type="text"
                      value={settings.homeHeroTitle1 || ''}
                      onChange={(e) => setSettings({ ...settings, homeHeroTitle1: e.target.value })}
                      placeholder="e.g. Adorn Your Beloved"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Title Line 2 (Highlighted)</label>
                    <input
                      type="text"
                      value={settings.homeHeroTitle2 || ''}
                      onChange={(e) => setSettings({ ...settings, homeHeroTitle2: e.target.value })}
                      placeholder="e.g. Laddu Gopal Ji"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Title Line 3</label>
                    <input
                      type="text"
                      value={settings.homeHeroTitle3 || ''}
                      onChange={(e) => setSettings({ ...settings, homeHeroTitle3: e.target.value })}
                      placeholder="e.g. With Divine Elegance"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-700 mb-1">Subheading Description</label>
                    <textarea
                      rows={3}
                      value={settings.homeHeroSubtitle || ''}
                      onChange={(e) => setSettings({ ...settings, homeHeroSubtitle: e.target.value })}
                      placeholder="Experience the royal devotion of Braj..."
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                </div>
              </div>

              {/* Hero Features (Pillars) */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <ShieldCheck className="w-6 h-6 text-black" />
                  <h3 className="text-base font-black text-black">Hero Features (4 Items)</h3>
                </div>
                
                <div className="space-y-4">
                  {settings.homeHeroFeatures?.map((feature, index) => (
                    <div key={index} className="flex gap-2 items-start bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                      <div className="flex-1 space-y-3">
                        <input
                          type="text"
                          value={feature.title}
                          onChange={(e) => {
                            const newFeatures = [...settings.homeHeroFeatures];
                            newFeatures[index].title = e.target.value;
                            setSettings({ ...settings, homeHeroFeatures: newFeatures });
                          }}
                          placeholder="Feature Title"
                          className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black text-black"
                        />
                        <textarea
                          rows={2}
                          value={feature.description}
                          onChange={(e) => {
                            const newFeatures = [...settings.homeHeroFeatures];
                            newFeatures[index].description = e.target.value;
                            setSettings({ ...settings, homeHeroFeatures: newFeatures });
                          }}
                          placeholder="Feature Description"
                          className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs outline-none focus:border-black text-black"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newFeatures = settings.homeHeroFeatures.filter((_, i) => i !== index);
                          setSettings({ ...settings, homeHeroFeatures: newFeatures });
                        }}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, homeHeroFeatures: [...(settings.homeHeroFeatures || []), { title: '', description: '' }] })}
                    className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer"
                  >
                    + Add Hero Feature
                  </button>
                </div>
              </div>

              {/* Artisan Story */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="w-6 h-6 text-black" />
                  <h3 className="text-base font-black text-black">Artisan Story Section</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 text-xs font-bold">
                  <div>
                    <label className="block text-neutral-700 mb-1">Top Badge Tag</label>
                    <input
                      type="text"
                      value={settings.homeStoryBadge || ''}
                      onChange={(e) => setSettings({ ...settings, homeStoryBadge: e.target.value })}
                      placeholder="e.g. THE VRINDAVAN SEVA TRADITION"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Story Title</label>
                    <input
                      type="text"
                      value={settings.homeStoryTitle || ''}
                      onChange={(e) => setSettings({ ...settings, homeStoryTitle: e.target.value })}
                      placeholder="e.g. Every Thread Woven with Sacred Devotion"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Paragraph 1</label>
                    <textarea
                      rows={3}
                      value={settings.homeStoryText1 || ''}
                      onChange={(e) => setSettings({ ...settings, homeStoryText1: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Paragraph 2</label>
                    <textarea
                      rows={3}
                      value={settings.homeStoryText2 || ''}
                      onChange={(e) => setSettings({ ...settings, homeStoryText2: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-2">Key Stats (List)</label>
                    <div className="space-y-2">
                      {settings.homeStoryStats?.map((stat, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={stat}
                            onChange={(e) => {
                              const newStats = [...settings.homeStoryStats];
                              newStats[index] = e.target.value;
                              setSettings({ ...settings, homeStoryStats: newStats });
                            }}
                            className="flex-1 bg-white border border-neutral-300 rounded-lg p-2 text-xs outline-none focus:border-black text-black"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const newStats = settings.homeStoryStats.filter((_, i) => i !== index);
                              setSettings({ ...settings, homeStoryStats: newStats });
                            }}
                            className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setSettings({ ...settings, homeStoryStats: [...(settings.homeStoryStats || []), ''] })}
                        className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer inline-block mt-2"
                      >
                        + Add Stat
                      </button>
                    </div>
                  </div>
                </div>
              </div>



              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Saving...' : 'Save Home Page'}</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* REELS TAB */}
        {activeTab === 'reels' && (
          <div className="p-6 sm:p-8 space-y-6 max-w-4xl">
            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Instagram Reels & Videos Section */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-neutral-200 shadow-2xs space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <ImageIcon className="w-6 h-6 text-black" />
                  <h3 className="text-base font-black text-black">Instagram Reels & Videos</h3>
                </div>

                <div className="grid grid-cols-1 gap-4 text-xs font-bold mb-6">
                  <div>
                    <label className="block text-neutral-700 mb-1">Section Title</label>
                    <input
                      type="text"
                      value={settings.homeVideosTitle || ''}
                      onChange={(e) => setSettings({ ...settings, homeVideosTitle: e.target.value })}
                      placeholder="e.g. TRUSTED BY EXPERTS"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 mb-1">Section Subtitle</label>
                    <input
                      type="text"
                      value={settings.homeVideosSubtitle || ''}
                      onChange={(e) => setSettings({ ...settings, homeVideosSubtitle: e.target.value })}
                      placeholder="e.g. Quality • Ayurvedic • Products"
                      className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-4 py-3 outline-none focus:border-black text-black"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block text-neutral-700 mb-2 font-bold text-xs">Video List</label>
                  {settings.homeVideoList?.map((video, index) => (
                    <div key={index} className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 space-y-4">
                      <ImageUploader
                        label="Video URL (Upload or Paste Link)"
                        value={video.videoUrl}
                        onChange={(url) => {
                          const newList = [...settings.homeVideoList];
                          newList[index].videoUrl = url;
                          setSettings({ ...settings, homeVideoList: newList });
                        }}
                        placeholder="https://..."
                      />

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="block text-[10px] text-neutral-500 font-bold mb-1 uppercase tracking-wider">Linked Product Name</label>
                          <input
                            type="text"
                            value={video.linkedProductName}
                            onChange={(e) => {
                              const newList = [...settings.homeVideoList];
                              newList[index].linkedProductName = e.target.value;
                              setSettings({ ...settings, homeVideoList: newList });
                            }}
                            placeholder="e.g. Alvista Kesar Shilajit"
                            className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black text-black"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-neutral-500 font-bold mb-1 uppercase tracking-wider">Linked Product Price</label>
                          <input
                            type="number"
                            value={video.linkedProductPrice}
                            onChange={(e) => {
                              const newList = [...settings.homeVideoList];
                              newList[index].linkedProductPrice = Number(e.target.value);
                              setSettings({ ...settings, homeVideoList: newList });
                            }}
                            placeholder="e.g. 1099"
                            className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black text-black"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-[10px] text-neutral-500 font-bold mb-1 uppercase tracking-wider">Linked Product URL</label>
                          <input
                            type="text"
                            value={video.linkedProductUrl}
                            onChange={(e) => {
                              const newList = [...settings.homeVideoList];
                              newList[index].linkedProductUrl = e.target.value;
                              setSettings({ ...settings, homeVideoList: newList });
                            }}
                            placeholder="e.g. /product/alvista-shilajit"
                            className="w-full bg-white border border-neutral-300 rounded-lg p-2 text-xs font-bold outline-none focus:border-black text-black"
                          />
                        </div>
                        <div className="sm:col-span-2 border-t border-neutral-200 mt-2 pt-4">
                          <ImageUploader
                            label="Linked Product Thumbnail (Optional)"
                            value={video.linkedProductImage || ''}
                            onChange={(url) => {
                              const newList = [...settings.homeVideoList];
                              newList[index].linkedProductImage = url;
                              setSettings({ ...settings, homeVideoList: newList });
                            }}
                            placeholder="/images/product.jpg"
                            previewSize="sm"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end items-center pt-2 border-t border-neutral-200 mt-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newList = settings.homeVideoList.filter((_, i) => i !== index);
                            setSettings({ ...settings, homeVideoList: newList });
                          }}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg cursor-pointer flex items-center gap-2 text-xs font-bold"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove Video
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSettings({
                      ...settings,
                      homeVideoList: [
                        ...(settings.homeVideoList || []),
                        { videoUrl: '', linkedProductName: '', linkedProductPrice: 0, linkedProductUrl: '#', linkedProductImage: '' }
                      ]
                    })}
                    className="text-[#87D215] text-xs font-bold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add New Video
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{isLoading ? 'Saving...' : 'Save Reels & Videos'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* -------------------------------------------------------------
          MODAL: ADD / EDIT PRODUCT
      ------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200 mb-6">
              <h3 className="text-lg font-black text-black">
                {editingProduct ? 'Edit Product Details' : 'Add New Vrindavan Product'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center cursor-pointer text-neutral-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-bold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-700 mb-1">Product Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Royal Zardozi Crimson Peacock Poshak"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Hindi Title (हिंदी नाम) *</label>
                  <input
                    type="text"
                    value={formData.hindiName}
                    onChange={(e) => setFormData({ ...formData, hindiName: e.target.value })}
                    placeholder="e.g. राजसी जरदोजी मोर पोशाक सेट"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutral-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black cursor-pointer"
                  >
                    {(categories.length > 0
                      ? categories.filter((c) => c.id !== 'all')
                      : CATEGORIES.filter((c) => c.id !== 'all')
                    ).map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label} {'hindiLabel' in c && c.hindiLabel ? `(${c.hindiLabel})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g. 1899"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-neutral-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. 2499"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 mb-2">Available Deity Sizes (साइज)</label>
                <div className="flex flex-wrap gap-2">
                  {['All Sizes', '0', '1', '2', '3', '4', '5', '6'].map((sz) => {
                    const isChecked = formData.sizes.includes(sz);
                    return (
                      <button
                        type="button"
                        key={sz}
                        onClick={() => {
                          if (isChecked) {
                            setFormData({
                              ...formData,
                              sizes: formData.sizes.filter((s) => s !== sz),
                            });
                          } else {
                            setFormData({ ...formData, sizes: [...formData.sizes, sz] });
                          }
                        }}
                        className={`px-3 py-1 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                          isChecked
                            ? 'bg-[#87D215] text-black border-[#79BE10] font-black'
                            : 'bg-white border-neutral-300 text-neutral-600'
                        }`}
                      >
                        {sz === 'All Sizes' ? 'All' : `No. ${sz}`}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ImageUploader
                  label="Product Image — Local Upload ya URL *"
                  value={formData.images[0] || ''}
                  onChange={(url) => setFormData({ ...formData, images: url ? [url] : [] })}
                  placeholder="/images/poshak_royal_zardozi.jpg"
                  previewSize="lg"
                />

                <div>
                  <label className="block text-neutral-700 mb-1">Product Badge (टैग)</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. ★ Best Seller | Pure Silk"
                    className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-700 mb-1">Description (विवरण)</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Sacred handcrafted poshak for Thakur Ji..."
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl p-3 outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="inStockCheck"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="w-4 h-4 accent-[#87D215] cursor-pointer"
                />
                <label htmlFor="inStockCheck" className="text-neutral-800 cursor-pointer font-bold">
                  Mark Product as In Stock (उपलब्ध)
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 hover:border-black text-black font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-6 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  {editingProduct ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: VIEW ORDER DETAILS
      ------------------------------------------------------------- */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Devotee Order Details
                </span>
                <h3 className="text-xl font-mono font-black text-black">{viewingOrder.id}</h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center cursor-pointer text-neutral-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-neutral-50 p-5 rounded-2xl border border-neutral-200 space-y-3 text-xs">
              <div className="font-bold text-neutral-500 uppercase tracking-wider text-[10px]">
                Shipping Address (डिलीवरी पता)
              </div>
              <div className="text-base font-black text-black">{viewingOrder.customer.fullName}</div>
              <div className="text-neutral-700 leading-relaxed">
                {viewingOrder.customer.address}, {viewingOrder.customer.city},{' '}
                {viewingOrder.customer.state} —{' '}
                <strong className="text-black font-mono">{viewingOrder.customer.pincode}</strong>
              </div>
              <div className="flex flex-wrap gap-4 pt-1 font-semibold text-neutral-600">
                <span>📞 Phone: {viewingOrder.customer.phone}</span>
                <span>✉️ Email: {viewingOrder.customer.email}</span>
              </div>
              {viewingOrder.customer.specialNote && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 font-medium text-[11px]">
                  <strong>Special Seva Note:</strong> {viewingOrder.customer.specialNote}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">
                Items ({viewingOrder.items.length})
              </div>
              <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-2xl p-4 bg-white space-y-3">
                {viewingOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between pt-3 first:pt-0">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                        <Image
                          src={item.image || '/images/poshak_royal_zardozi.jpg'}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-black">{item.productName}</div>
                        <div className="text-[11px] text-neutral-500">
                          Size No. {item.size} × {item.quantity}
                        </div>
                      </div>
                    </div>
                    <div className="text-xs font-black text-black">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal:</span>
                <span>₹{viewingOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {viewingOrder.discount > 0 && (
                <div className="flex justify-between text-[#87D215] font-black">
                  <span>Discount:</span>
                  <span>-₹{viewingOrder.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-600">
                <span>Shipping:</span>
                <span className="text-[#87D215] font-black">FREE</span>
              </div>
              <div className="flex justify-between text-sm font-black text-black pt-2 border-t border-neutral-200">
                <span>Total Amount (कुल राशि):</span>
                <span>₹{viewingOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="flex-1 w-full flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-600 shrink-0">Update Status:</span>
                <select
                  value={viewingOrder.status}
                  onChange={(e) =>
                    handleUpdateOrderStatus(
                      viewingOrder.id,
                      e.target.value as 'confirmed' | 'processing' | 'shipped'
                    )
                  }
                  className="flex-1 bg-neutral-100 border border-neutral-300 rounded-xl p-2.5 text-xs font-bold text-black outline-none cursor-pointer"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing & Packing</option>
                  <option value="shipped">Shipped to Devotee</option>
                </select>
              </div>

              <a
                href={`https://wa.me/91${viewingOrder.customer.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                  `Radhe Radhe ${viewingOrder.customer.fullName}! Regarding your order ${viewingOrder.id} from BroCART...`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto bg-[#25D366] hover:bg-[#1EBE5D] text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>WhatsApp Devotee</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* -------------------------------------------------------------
          MODAL: ADD / EDIT CATEGORY (श्रेणी जोड़ें / संपादित करें)
      ------------------------------------------------------------- */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                  Storefront Navigation
                </span>
                <h3 className="text-lg font-black text-black">
                  {editingCategory ? 'Edit Category (श्रेणी संपादित करें)' : 'Add New Category (नई श्रेणी जोड़ें)'}
                </h3>
              </div>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center cursor-pointer text-neutral-500 hover:text-black"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs font-bold">
              <div>
                <label className="block text-neutral-700 mb-1">
                  Category Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={categoryForm.label}
                  onChange={(e) => {
                    const val = e.target.value;
                    const autoSlug = val
                      .toLowerCase()
                      .trim()
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/^-+|-+$/g, '');
                    setCategoryForm({
                      ...categoryForm,
                      label: val,
                      categoryId: editingCategory ? categoryForm.categoryId : autoSlug,
                    });
                  }}
                  placeholder="e.g. Silver Flutes & Mor Pankh"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black text-black font-semibold"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1">
                  Hindi Name (हिंदी नाम)
                </label>
                <input
                  type="text"
                  value={categoryForm.hindiLabel}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, hindiLabel: e.target.value })
                  }
                  placeholder="e.g. चांदी की बांसुरी एवं मोर पंख"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black text-black font-semibold"
                />
              </div>

              <div>
                <label className="block text-neutral-700 mb-1">
                  Category Slug / Identifier (URL Key) *
                </label>
                <input
                  type="text"
                  required
                  disabled={Boolean(editingCategory)}
                  value={categoryForm.categoryId}
                  onChange={(e) =>
                    setCategoryForm({ ...categoryForm, categoryId: e.target.value })
                  }
                  placeholder="e.g. silver-flutes-mor-pankh"
                  className="w-full bg-neutral-50 border border-neutral-300 rounded-xl px-3.5 py-2.5 outline-none focus:border-black text-black font-mono disabled:bg-neutral-100 disabled:text-neutral-500"
                />
                <p className="text-[10px] text-neutral-500 mt-1 font-normal">
                  Products are linked to this slug in database. (Lowercase letters & hyphens)
                </p>
              </div>

              {/* Quick Preset helper */}
              {!editingCategory && (
                <div className="pt-2">
                  <span className="text-[11px] text-neutral-500 font-bold block mb-1.5">
                    Popular Vrindavan Category Ideas:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { l: 'Beds & Jhulas', h: 'बिस्तर एवं झूले', s: 'beds-jhulas' },
                      { l: 'Silver Flutes', h: 'चांदी की बांसुरी', s: 'silver-flutes' },
                      { l: 'Attar & Fragrance', h: 'इत्र एवं सुगंध', s: 'attar-fragrance' },
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setCategoryForm({
                            ...categoryForm,
                            label: item.l,
                            hindiLabel: item.h,
                            categoryId: item.s,
                          })
                        }
                        className="px-2.5 py-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[11px] font-semibold transition-colors"
                      >
                        {item.l}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-neutral-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-neutral-300 hover:border-black text-black font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#87D215] hover:bg-[#78BD0E] text-black font-black px-6 py-2.5 rounded-xl uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  {editingCategory ? 'Update Category' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Admin Logout Confirm Modal ── */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4"
            style={{ animation: 'logoutModalUp 0.25s cubic-bezier(.22,.68,0,1.2)' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex flex-col items-center gap-2 pb-2">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-1">
                <LogOut className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-base font-black text-black">Logout Admin?</h3>
              <p className="text-sm text-neutral-500 text-center leading-snug">
                Are you sure you want to log out of the admin panel?
              </p>
            </div>
            <button
              onClick={confirmLogout}
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
    </div>
  );
}
