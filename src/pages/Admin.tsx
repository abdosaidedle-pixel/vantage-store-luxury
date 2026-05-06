import { useState } from 'react';
import { Lock, LayoutDashboard, Package, ShoppingCart, BarChart3, LogOut, Plus, Trash2, Edit, Eye, X, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../store';
import { Product, Order } from '../types';
import { CATEGORIES } from '../data';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import toast from 'react-hot-toast';

export default function Admin() {
  const { t, lang, dark, isAdmin, adminLogin, adminLogout, products, setProducts, orders, updateOrderStatus } = useStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [viewOrder, setViewOrder] = useState<Order | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(username, password);
    if (success) {
      toast.success(t('welcomeBack'));
    } else {
      toast.error(t('loginFailed'));
    }
  };

  if (!isAdmin) {
    return (
      <div className={`min-h-screen pt-24 flex items-center justify-center ${dark ? 'bg-black-main' : 'bg-soft-gray'}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`w-full max-w-md mx-4 p-8 rounded-2xl ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white shadow-xl'}`}
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock size={28} className="text-gold" />
            </div>
            <h2 className={`text-2xl font-bold ${dark ? 'text-white' : 'text-black-main'}`}>{t('adminLogin')}</h2>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('adminUsername')}</label>
              <input
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? 'bg-black-main border-dark-border text-white' : 'bg-soft-gray border-gray-200 text-black-main'}`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium mb-1.5 ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{t('password')}</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border text-sm ${dark ? 'bg-black-main border-dark-border text-white' : 'bg-soft-gray border-gray-200 text-black-main'}`}
              />
            </div>
            <button type="submit" className="w-full bg-gold hover:bg-gold-light text-black-main py-3.5 rounded-xl font-bold transition-all hover:scale-[1.02]">
              {t('login')}
            </button>
            <p className={`text-xs text-center ${dark ? 'text-gray-600' : 'text-gray-400'}`}>
              Demo: admin / admin123
            </p>
          </form>
        </motion.div>
      </div>
    );
  }

  const totalSales = orders.filter(o => o.status === 'approved' || o.status === 'delivered').reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'pending').length;

  const chartData = CATEGORIES.map(cat => ({
    name: lang === 'ar' ? cat.ar : cat.en,
    count: products.filter(p => p.category === cat.id).length,
  }));

  const statusData = [
    { name: t('pending'), value: orders.filter(o => o.status === 'pending').length, color: '#EAB308' },
    { name: t('approved'), value: orders.filter(o => o.status === 'approved').length, color: '#22C55E' },
    { name: t('rejected'), value: orders.filter(o => o.status === 'rejected').length, color: '#EF4444' },
    { name: t('delivered'), value: orders.filter(o => o.status === 'delivered').length, color: '#3B82F6' },
  ];

  const tabs = [
    { id: 'dashboard', icon: <LayoutDashboard size={18} />, label: t('dashboard') },
    { id: 'products', icon: <Package size={18} />, label: t('manageProducts') },
    { id: 'orders', icon: <ShoppingCart size={18} />, label: t('manageOrders') },
    { id: 'analytics', icon: <BarChart3 size={18} />, label: t('analytics') },
  ];

  return (
    <div className={`min-h-screen pt-20 lg:pt-24 ${dark ? 'bg-black-main' : 'bg-soft-gray'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className={`text-2xl md:text-3xl font-bold ${dark ? 'text-white' : 'text-black-main'}`}>{t('adminPanel')}</h1>
            <p className={`text-sm mt-1 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{t('welcomeBack')}</p>
          </div>
          <button onClick={adminLogout} className="flex items-center gap-2 text-red-500 hover:bg-red-500/10 px-4 py-2 rounded-xl transition-colors">
            <LogOut size={18} /> {t('logout')}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.id ? 'bg-gold text-black-main' : dark ? 'bg-dark-card text-gray-300 hover:bg-dark-border' : 'bg-white text-gray-600 hover:bg-gray-100'}`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: t('totalSales'), value: `${totalSales} ${t('egp')}`, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                { label: t('totalOrders'), value: orders.length, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                { label: t('totalProducts'), value: products.length, color: 'text-purple-500', bg: 'bg-purple-500/10' },
                { label: t('pending'), value: pendingOrders, color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
              ].map((stat, i) => (
                <div key={i} className={`p-6 rounded-2xl ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center mb-3`}>
                    <span className={`${stat.color} text-lg`}>📊</span>
                  </div>
                  <p className={`text-2xl font-bold ${dark ? 'text-white' : 'text-black-main'}`}>{stat.value}</p>
                  <p className={`text-sm ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Recent Orders */}
            <div className={`p-6 rounded-2xl ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
              <h3 className={`font-bold text-lg mb-4 ${dark ? 'text-white' : 'text-black-main'}`}>{t('recentOrders')}</h3>
              {orders.length === 0 ? (
                <p className={`text-center py-8 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{lang === 'ar' ? 'لا توجد طلبات' : 'No orders yet'}</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className={dark ? 'text-gray-400' : 'text-gray-500'}>
                        <th className="text-left p-3">ID</th>
                        <th className="text-left p-3">{t('customer')}</th>
                        <th className="text-left p-3">{t('total')}</th>
                        <th className="text-left p-3">{t('status')}</th>
                        <th className="text-left p-3">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order.id} className={`border-t ${dark ? 'border-dark-border' : 'border-gray-100'}`}>
                          <td className={`p-3 font-mono text-xs ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{order.id}</td>
                          <td className={`p-3 ${dark ? 'text-white' : 'text-black-main'}`}>{order.customer.fullName}</td>
                          <td className="p-3 text-gold font-semibold">{order.total} {t('egp')}</td>
                          <td className="p-3">
                            <StatusBadge status={order.status} t={t} />
                          </td>
                          <td className="p-3">
                            <button onClick={() => setViewOrder(order)} className="text-gold hover:underline text-xs">{t('orderDetails')}</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className={dark ? 'text-gray-400' : 'text-gray-500'}>{products.length} {lang === 'ar' ? 'منتج' : 'products'}</p>
              <button
                onClick={() => { setShowAddProduct(true); setEditingProduct(null); }}
                className="flex items-center gap-2 bg-gold text-black-main px-5 py-2.5 rounded-xl font-bold hover:bg-gold-light transition-colors"
              >
                <Plus size={18} /> {t('addProduct')}
              </button>
            </div>
            <div className={`rounded-2xl overflow-hidden ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={dark ? 'bg-dark-border' : 'bg-soft-gray'}>
                    <tr className={dark ? 'text-gray-400' : 'text-gray-500'}>
                      <th className="text-left p-4">{t('productName')}</th>
                      <th className="text-left p-4">{t('price')}</th>
                      <th className="text-left p-4">{t('stock')}</th>
                      <th className="text-left p-4">{t('categories')}</th>
                      <th className="text-left p-4">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product.id} className={`border-t ${dark ? 'border-dark-border' : 'border-gray-100'}`}>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={product.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <span className={`font-medium ${dark ? 'text-white' : 'text-black-main'}`}>
                              {lang === 'ar' ? product.nameAr : product.nameEn}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-gold font-semibold">{product.price} {t('egp')}</td>
                        <td className={`p-4 ${product.stock < 10 ? 'text-red-500' : dark ? 'text-gray-300' : 'text-gray-700'}`}>{product.stock}</td>
                        <td className={`p-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{product.category}</td>
                        <td className="p-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingProduct(product); setShowAddProduct(true); }} className="p-2 hover:bg-gold/10 rounded-lg text-gold">
                              <Edit size={16} />
                            </button>
                            <button onClick={() => {
                              if (confirm(t('confirm'))) {
                                setProducts(prev => prev.filter(p => p.id !== product.id));
                                toast.success(t('productDeleted'));
                              }
                            }} className="p-2 hover:bg-red-500/10 rounded-lg text-red-500">
                              <Trash2 size={16} />
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

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className={`rounded-2xl overflow-hidden ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
            {orders.length === 0 ? (
              <p className={`text-center py-12 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{lang === 'ar' ? 'لا توجد طلبات' : 'No orders yet'}</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className={dark ? 'bg-dark-border' : 'bg-soft-gray'}>
                    <tr className={dark ? 'text-gray-400' : 'text-gray-500'}>
                      <th className="text-left p-4">ID</th>
                      <th className="text-left p-4">{t('customer')}</th>
                      <th className="text-left p-4">{t('phone')}</th>
                      <th className="text-left p-4">{t('total')}</th>
                      <th className="text-left p-4">{t('paymentMethod')}</th>
                      <th className="text-left p-4">{t('status')}</th>
                      <th className="text-left p-4">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id} className={`border-t ${dark ? 'border-dark-border' : 'border-gray-100'}`}>
                        <td className={`p-4 font-mono text-xs ${dark ? 'text-gray-300' : 'text-gray-700'}`}>{order.id}</td>
                        <td className={`p-4 ${dark ? 'text-white' : 'text-black-main'}`}>{order.customer.fullName}</td>
                        <td className={`p-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>{order.customer.phone}</td>
                        <td className="p-4 text-gold font-semibold">{order.total} {t('egp')}</td>
                        <td className={`p-4 ${dark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {order.paymentMethod === 'vodafone_cash' ? t('vodafoneCash') : t('cashOnDelivery')}
                        </td>
                        <td className="p-4">
                          <select
                            value={order.status}
                            onChange={e => {
                              updateOrderStatus(order.id, e.target.value as Order['status']);
                              toast.success(t('orderUpdated'));
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border ${dark ? 'bg-dark-border border-dark-border text-white' : 'bg-soft-gray border-gray-200'}`}
                          >
                            <option value="pending">{t('pending')}</option>
                            <option value="approved">{t('approved')}</option>
                            <option value="rejected">{t('rejected')}</option>
                            <option value="shipped">{t('shipped')}</option>
                            <option value="delivered">{t('delivered')}</option>
                          </select>
                        </td>
                        <td className="p-4">
                          <button onClick={() => setViewOrder(order)} className="p-2 hover:bg-gold/10 rounded-lg text-gold">
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="grid lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-2xl ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
              <h3 className={`font-bold mb-6 ${dark ? 'text-white' : 'text-black-main'}`}>{lang === 'ar' ? 'المنتجات حسب الفئة' : 'Products by Category'}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={dark ? '#2A2A2A' : '#E5E7EB'} />
                  <XAxis dataKey="name" tick={{ fill: dark ? '#9CA3AF' : '#6B7280', fontSize: 11 }} />
                  <YAxis tick={{ fill: dark ? '#9CA3AF' : '#6B7280' }} />
                  <Tooltip contentStyle={{ background: dark ? '#1A1A1A' : '#FFF', border: '1px solid #D4AF37', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#D4AF37" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className={`p-6 rounded-2xl ${dark ? 'bg-dark-card border border-dark-border' : 'bg-white border border-gray-100'}`}>
              <h3 className={`font-bold mb-6 ${dark ? 'text-white' : 'text-black-main'}`}>{lang === 'ar' ? 'حالة الطلبات' : 'Order Status'}</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={statusData.filter(d => d.value > 0)} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" label>
                    {statusData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: dark ? '#1A1A1A' : '#FFF', border: '1px solid #D4AF37', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-3 justify-center mt-4">
                {statusData.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                    <span className={dark ? 'text-gray-400' : 'text-gray-500'}>{item.name} ({item.value})</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {showAddProduct && (
        <ProductModal
          product={editingProduct}
          onClose={() => { setShowAddProduct(false); setEditingProduct(null); }}
          onSave={(product) => {
            if (editingProduct) {
              setProducts(prev => prev.map(p => p.id === product.id ? product : p));
              toast.success(t('productUpdated'));
            } else {
              setProducts(prev => [...prev, { ...product, id: `p${Date.now()}`, createdAt: new Date().toISOString() }]);
              toast.success(t('productAdded'));
            }
            setShowAddProduct(false);
            setEditingProduct(null);
          }}
          t={t}
          lang={lang}
          dark={dark}
        />
      )}

      {/* Order Detail Modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setViewOrder(null)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={e => e.stopPropagation()}
            className={`w-full max-w-lg max-h-[80vh] overflow-auto rounded-2xl p-6 ${dark ? 'bg-dark-card' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className={`font-bold text-lg ${dark ? 'text-white' : 'text-black-main'}`}>{t('orderDetails')}</h3>
              <button onClick={() => setViewOrder(null)}><X size={20} className={dark ? 'text-gray-400' : 'text-gray-500'} /></button>
            </div>
            <div className="space-y-4 text-sm">
              <div className={`p-4 rounded-xl ${dark ? 'bg-black-main' : 'bg-soft-gray'}`}>
                <p className={dark ? 'text-gray-400' : 'text-gray-500'}>{t('customerInfo')}</p>
                <p className={`font-semibold mt-1 ${dark ? 'text-white' : 'text-black-main'}`}>{viewOrder.customer.fullName}</p>
                <p className={dark ? 'text-gray-300' : 'text-gray-700'}>{viewOrder.customer.phone}</p>
                <p className={dark ? 'text-gray-300' : 'text-gray-700'}>{viewOrder.customer.address}, {viewOrder.customer.city}, {viewOrder.customer.governorate}</p>
                {viewOrder.notes && <p className={`mt-2 italic ${dark ? 'text-gray-500' : 'text-gray-400'}`}>{viewOrder.notes}</p>}
              </div>
              <div>
                <p className={`font-semibold mb-2 ${dark ? 'text-white' : 'text-black-main'}`}>{t('items')}</p>
                {viewOrder.items.map(item => (
                  <div key={item.product.id} className={`flex justify-between py-2 border-b ${dark ? 'border-dark-border' : 'border-gray-100'}`}>
                    <span className={dark ? 'text-gray-300' : 'text-gray-700'}>
                      {lang === 'ar' ? item.product.nameAr : item.product.nameEn} × {item.quantity}
                    </span>
                    <span className="text-gold">{item.product.price * item.quantity} {t('egp')}</span>
                  </div>
                ))}
              </div>
              <div className={`flex justify-between font-bold text-lg pt-2 ${dark ? 'text-white' : 'text-black-main'}`}>
                <span>{t('total')}</span>
                <span className="text-gold">{viewOrder.total} {t('egp')}</span>
              </div>
              <div className="flex justify-between">
                <span className={dark ? 'text-gray-400' : 'text-gray-500'}>{t('paymentMethod')}</span>
                <span className={dark ? 'text-white' : 'text-black-main'}>{viewOrder.paymentMethod === 'vodafone_cash' ? t('vodafoneCash') : t('cashOnDelivery')}</span>
              </div>
              {viewOrder.paymentRef && (
                <div className="flex justify-between">
                  <span className={dark ? 'text-gray-400' : 'text-gray-500'}>{t('paymentRef')}</span>
                  <span className="text-gold font-mono">{viewOrder.paymentRef}</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status, t }: { status: string; t: (key: string) => string }) {
  const colors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-500',
    approved: 'bg-emerald-500/10 text-emerald-500',
    rejected: 'bg-red-500/10 text-red-500',
    shipped: 'bg-blue-500/10 text-blue-500',
    delivered: 'bg-emerald-600/10 text-emerald-600',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status] || ''}`}>
      {t(status)}
    </span>
  );
}

function ProductModal({ product, onClose, onSave, t, lang, dark }: {
  product: Product | null;
  onClose: () => void;
  onSave: (p: Product) => void;
  t: (k: string) => string;
  lang: string;
  dark: boolean;
}) {
  const [form, setForm] = useState<Product>(product || {
    id: '',
    nameEn: '',
    nameAr: '',
    descEn: '',
    descAr: '',
    price: 0,
    oldPrice: 0,
    discount: 0,
    category: 'mens-fashion',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=700&fit=crop'],
    stock: 0,
    rating: 4.5,
    reviews: 0,
    badge: undefined,
    featured: false,
    createdAt: '',
  });

  const inputClass = `w-full px-4 py-2.5 rounded-xl border text-sm ${dark ? 'bg-black-main border-dark-border text-white' : 'bg-soft-gray border-gray-200 text-black-main'}`;

  return (
    <div className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className={`w-full max-w-2xl max-h-[85vh] overflow-auto rounded-2xl p-6 ${dark ? 'bg-dark-card' : 'bg-white'}`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className={`font-bold text-lg ${dark ? 'text-white' : 'text-black-main'}`}>
            {product ? t('editProduct') : t('addProduct')}
          </h3>
          <button onClick={onClose}><X size={20} className={dark ? 'text-gray-400' : 'text-gray-500'} /></button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Name (EN)</label>
              <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Name (AR)</label>
              <input value={form.nameAr} onChange={e => setForm(f => ({ ...f, nameAr: e.target.value }))} className={inputClass} dir="rtl" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Desc (EN)</label>
              <textarea value={form.descEn} onChange={e => setForm(f => ({ ...f, descEn: e.target.value }))} className={`${inputClass} resize-none`} rows={2} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Desc (AR)</label>
              <textarea value={form.descAr} onChange={e => setForm(f => ({ ...f, descAr: e.target.value }))} className={`${inputClass} resize-none`} rows={2} dir="rtl" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{t('price')}</label>
              <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: +e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Old Price</label>
              <input type="number" value={form.oldPrice || ''} onChange={e => setForm(f => ({ ...f, oldPrice: +e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{t('discount')} %</label>
              <input type="number" value={form.discount || ''} onChange={e => setForm(f => ({ ...f, discount: +e.target.value }))} className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{t('stock')}</label>
              <input type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: +e.target.value }))} className={inputClass} />
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>{t('categories')}</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className={inputClass}>
                {CATEGORIES.map(c => (
                  <option key={c.id} value={c.id}>{lang === 'ar' ? c.ar : c.en}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Badge</label>
              <select value={form.badge || ''} onChange={e => setForm(f => ({ ...f, badge: e.target.value as any || undefined }))} className={inputClass}>
                <option value="">None</option>
                <option value="new">New</option>
                <option value="sale">Sale</option>
                <option value="bestseller">Bestseller</option>
                <option value="limited">Limited</option>
              </select>
            </div>
          </div>
          <div>
            <label className={`block text-xs font-medium mb-1 ${dark ? 'text-gray-400' : 'text-gray-600'}`}>Image URL</label>
            <input value={form.images[0]} onChange={e => setForm(f => ({ ...f, images: [e.target.value, ...f.images.slice(1)] }))} className={inputClass} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={form.featured} onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))} className="accent-gold w-4 h-4" />
            <label className={`text-sm ${dark ? 'text-gray-300' : 'text-gray-700'}`}>Featured Product</label>
          </div>
          <div className="flex gap-3 pt-4">
            <button onClick={() => onSave(form)} className="flex-1 flex items-center justify-center gap-2 bg-gold hover:bg-gold-light text-black-main py-3 rounded-xl font-bold transition-all">
              <Save size={18} /> {t('save')}
            </button>
            <button onClick={onClose} className={`flex-1 py-3 rounded-xl font-bold border ${dark ? 'border-dark-border text-gray-300' : 'border-gray-200 text-gray-700'}`}>
              {t('cancel')}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
