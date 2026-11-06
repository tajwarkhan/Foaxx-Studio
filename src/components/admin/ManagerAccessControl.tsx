import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  Flame,
  HelpCircle,
  Image as ImageIcon,
  KeyRound,
  Lock,
  Mail,
  Package,
  Phone,
  Plus,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Trash2,
  Truck,
  User,
  UserCheck,
  UserPlus,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ManagerAccount, ManagerPermission } from '../../types';
import { PERMISSION_DEFINITIONS, PermissionDefinition } from '../../data/initialManagers';

export const ManagerAccessControl: React.FC = () => {
  const {
    managers,
    activeManager,
    addManager,
    updateManager,
    deleteManager,
    toggleManagerPermission,
    loginAsManager,
    showToast,
  } = useStore();

  const [selectedManagerId, setSelectedManagerId] = useState<string>(() => {
    return managers[0]?.id || '';
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newManagerForm, setNewManagerForm] = useState({
    name: '',
    email: '',
    roleTitle: 'Catalog & Upload Manager',
    phone: '',
    accessPin: '1234',
    preset: 'catalog' as 'catalog' | 'marketing' | 'operations' | 'all',
  });

  const selectedManager = managers.find((m) => m.id === selectedManagerId) || managers[0];

  const handleCreateManager = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newManagerForm.name.trim()) {
      showToast('Please enter manager name', 'error');
      return;
    }
    if (!newManagerForm.email.trim() || !newManagerForm.email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }

    let initialPerms: ManagerPermission[] = ['products'];
    if (newManagerForm.preset === 'catalog') {
      initialPerms = ['products', 'reviews', 'faqs'];
    } else if (newManagerForm.preset === 'marketing') {
      initialPerms = ['banners', 'deals', 'festive', 'notifications', 'coupons'];
    } else if (newManagerForm.preset === 'operations') {
      initialPerms = ['orders', 'subscribers', 'faqs'];
    } else if (newManagerForm.preset === 'all') {
      initialPerms = PERMISSION_DEFINITIONS.map((p) => p.id);
    }

    const created = addManager({
      name: newManagerForm.name,
      email: newManagerForm.email,
      roleTitle: newManagerForm.roleTitle,
      phone: newManagerForm.phone,
      accessPin: newManagerForm.accessPin || '1234',
      permissions: initialPerms,
    });

    setSelectedManagerId(created.id);
    setIsAddModalOpen(false);
    setNewManagerForm({
      name: '',
      email: '',
      roleTitle: 'Catalog & Upload Manager',
      phone: '',
      accessPin: '1234',
      preset: 'catalog',
    });
  };

  const handleSelectAll = (managerId: string) => {
    const allPerms = PERMISSION_DEFINITIONS.map((p) => p.id);
    updateManager(managerId, { permissions: allPerms });
    showToast('Granted full access to all store sections', 'success');
  };

  const handleClearAll = (managerId: string) => {
    updateManager(managerId, { permissions: [] });
    showToast('Removed all permissions for this manager', 'info');
  };

  const renderIcon = (iconName: string, className: string = 'w-5 h-5') => {
    switch (iconName) {
      case 'Package':
        return <Package className={className} />;
      case 'ImageIcon':
        return <ImageIcon className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'Tag':
        return <Tag className={className} />;
      case 'Truck':
        return <Truck className={className} />;
      case 'Star':
        return <Star className={className} />;
      case 'HelpCircle':
        return <HelpCircle className={className} />;
      case 'Bell':
        return <Mail className={className} />;
      case 'Users':
        return <Users className={className} />;
      default:
        return <Shield className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-amber-500/10 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-wide">
              Manager Duties & Permissions Hub
            </h2>
            <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Select any manager from the roster and check or uncheck boxes to instantly grant or revoke section access across uploads, orders, banners, and notifications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#d4af37] to-[#b38f2a] hover:from-[#e5bf43] hover:to-[#c49f34] text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Add New Manager</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Managers List on Left, Checkbox Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Manager Directory (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Active Managers ({managers.length})
              </h3>
              <span className="text-[11px] text-stone-400">Select to assign duties</span>
            </div>

            <div className="space-y-2">
              {managers.map((mgr) => {
                const isSelected = selectedManager?.id === mgr.id;
                const dutiesCount = mgr.permissions.length;

                return (
                  <div
                    key={mgr.id}
                    onClick={() => setSelectedManagerId(mgr.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-400 shadow-sm ring-1 ring-amber-300'
                        : 'bg-stone-50/70 hover:bg-stone-100/70 border-stone-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${
                            isSelected
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-800 text-amber-200'
                          }`}
                        >
                          {mgr.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-stone-900 leading-snug">
                              {mgr.name}
                            </h4>
                            {!mgr.isActive && (
                              <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-medium">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-amber-700 font-medium">{mgr.roleTitle}</p>
                          <p className="text-[11px] text-stone-500 font-mono">{mgr.email}</p>
                        </div>
                      </div>

                      <ChevronRight
                        className={`w-4 h-4 mt-1 transition-transform ${
                          isSelected ? 'text-amber-600 translate-x-0.5' : 'text-stone-400'
                        }`}
                      />
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-stone-200/70 flex items-center justify-between text-[11px]">
                      <span className="inline-flex items-center gap-1 font-semibold text-stone-700">
                        <Shield className="w-3 h-3 text-amber-600" />
                        <span>{dutiesCount} duties assigned</span>
                      </span>

                      <span className="text-stone-400">{mgr.lastActive || 'Active'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Helper Box */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-xs text-stone-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-stone-900">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>How Manager Duties Work</span>
            </div>
            <p className="leading-relaxed text-[11px]">
              1. <strong>Select a manager</strong> from this list.
            </p>
            <p className="leading-relaxed text-[11px]">
              2. <strong>Tick / Untick boxes</strong> on the right. Changes save instantly.
            </p>
            <p className="leading-relaxed text-[11px]">
              3. Click <strong>"Test Manager Dashboard"</strong> below to preview what that manager sees.
            </p>
          </div>
        </div>

        {/* Right Column: Permission Matrix (8 cols) */}
        {selectedManager ? (
          <div className="lg:col-span-8 space-y-5">
            {/* Selected Manager Profile Card */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-base shadow-sm">
                    {selectedManager.name
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base sm:text-lg font-bold text-stone-900">
                        {selectedManager.name}
                      </h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          selectedManager.isActive
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {selectedManager.isActive ? 'Active Account' : 'Suspended'}
                      </span>
                    </div>
                    <p className="text-xs text-amber-700 font-semibold">{selectedManager.roleTitle}</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-stone-500 mt-1">
                      <span>Email: <strong className="text-stone-700 font-mono">{selectedManager.email}</strong></span>
                      {selectedManager.phone && (
                        <span>Phone: <strong className="text-stone-700">{selectedManager.phone}</strong></span>
                      )}
                      <span>PIN: <strong className="text-stone-700 font-mono">{selectedManager.accessPin || '1234'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Quick actions for selected manager */}
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    onClick={() => loginAsManager(selectedManager.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-stone-900 hover:bg-stone-800 text-amber-300 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                    title="Switch view to this manager's dashboard"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Test Manager Dashboard</span>
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete manager "${selectedManager.name}"?`)) {
                        deleteManager(selectedManager.id);
                      }
                    }}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete manager"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Status and Bulk Permission Toggles */}
              <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-700">Quick Presets:</span>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(selectedManager.id)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors cursor-pointer"
                  >
                    Select All (10)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleClearAll(selectedManager.id)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-600 transition-colors cursor-pointer"
                  >
                    Clear All
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateManager(selectedManager.id, {
                        permissions: ['products', 'reviews', 'faqs'],
                      });
                      showToast('Assigned Catalog duties preset', 'success');
                    }}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors cursor-pointer"
                  >
                    Catalog Only
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      updateManager(selectedManager.id, {
                        permissions: ['banners', 'deals', 'festive', 'notifications'],
                      });
                      showToast('Assigned Marketing duties preset', 'success');
                    }}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors cursor-pointer"
                  >
                    Marketing Only
                  </button>
                </div>

                <div className="text-xs font-bold text-stone-900 bg-amber-100/60 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-lg">
                  {selectedManager.permissions.length} of {PERMISSION_DEFINITIONS.length} Functionalities Enabled
                </div>
              </div>
            </div>

            {/* Checkbox Matrix: The 10 Sections */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                  Assign / Revoke Section Functionalities
                </h4>
                <span className="text-[11px] text-stone-400">
                  Click on box to enable/disable immediately
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {PERMISSION_DEFINITIONS.map((perm) => {
                  const isChecked = selectedManager.permissions.includes(perm.id);

                  return (
                    <label
                      key={perm.id}
                      onClick={(e) => {
                        e.preventDefault();
                        toggleManagerPermission(selectedManager.id, perm.id);
                      }}
                      className={`flex items-start gap-3.5 p-4 rounded-xl border transition-all cursor-pointer select-none relative ${
                        isChecked
                          ? 'bg-amber-50/50 border-amber-400 shadow-xs ring-1 ring-amber-300/60'
                          : 'bg-white hover:bg-stone-50 border-stone-200 opacity-75 hover:opacity-100'
                      }`}
                    >
                      {/* Big clear checkbox */}
                      <div className="pt-0.5">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            isChecked
                              ? 'bg-[#d4af37] text-stone-950 font-bold shadow-xs'
                              : 'border-2 border-stone-300 bg-white'
                          }`}
                        >
                          {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span
                            className={`p-1 rounded-md text-stone-800 ${
                              isChecked ? 'bg-amber-200 text-stone-950' : 'bg-stone-100 text-stone-600'
                            }`}
                          >
                            {renderIcon(perm.icon, 'w-3.5 h-3.5')}
                          </span>
                          <h5 className="text-xs sm:text-sm font-bold text-stone-900 leading-tight">
                            {perm.name}
                          </h5>
                        </div>

                        <p className="text-[11px] text-amber-800/80 font-medium mb-1">
                          {perm.subLabel}
                        </p>

                        <p className="text-[11px] text-stone-500 leading-relaxed">
                          {perm.description}
                        </p>

                        <div className="mt-2 flex items-center justify-between text-[10px]">
                          <span
                            className={`font-semibold px-1.5 py-0.5 rounded border text-[10px] ${perm.badgeColor}`}
                          >
                            {perm.category}
                          </span>

                          <span
                            className={`font-bold ${
                              isChecked ? 'text-emerald-700' : 'text-stone-400'
                            }`}
                          >
                            {isChecked ? '✓ Access Granted' : '✕ No Access'}
                          </span>
                        </div>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-stone-50 border border-dashed border-stone-300 rounded-2xl p-12 text-center text-stone-500">
            <Users className="w-10 h-10 text-stone-400 mx-auto mb-3" />
            <p className="font-semibold text-stone-700">No Manager Selected</p>
            <p className="text-xs mt-1">Select a manager from the left or create a new manager.</p>
          </div>
        )}
      </div>

      {/* Add New Manager Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center">
                  <UserPlus className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-stone-900">Add New Store Manager</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManager} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Manager Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikramaditya Singh"
                  value={newManagerForm.name}
                  onChange={(e) =>
                    setNewManagerForm({ ...newManagerForm, name: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="vikram@foaxx.com"
                    value={newManagerForm.email}
                    onChange={(e) =>
                      setNewManagerForm({ ...newManagerForm, email: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Designation / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Products & Upload Specialist"
                    value={newManagerForm.roleTitle}
                    onChange={(e) =>
                      setNewManagerForm({ ...newManagerForm, roleTitle: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98376 00000"
                    value={newManagerForm.phone}
                    onChange={(e) =>
                      setNewManagerForm({ ...newManagerForm, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Quick Access PIN (for Manager Login)
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    placeholder="1234"
                    value={newManagerForm.accessPin}
                    onChange={(e) =>
                      setNewManagerForm({ ...newManagerForm, accessPin: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Initial Duties Preset (You can modify individual boxes later)
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    { id: 'catalog', label: 'Catalog & Uploads', desc: 'Products, Reviews, FAQs' },
                    { id: 'marketing', label: 'Marketing Lead', desc: 'Banners, Deals, Festive, Mails' },
                    { id: 'operations', label: 'Logistics & Orders', desc: 'Orders, Subscribers, FAQs' },
                    { id: 'all', label: 'All Duties (Full)', desc: 'Access all 10 store sections' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() =>
                        setNewManagerForm({ ...newManagerForm, preset: preset.id as any })
                      }
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        newManagerForm.preset === preset.id
                          ? 'border-amber-500 bg-amber-50/70 text-amber-950 font-semibold ring-1 ring-amber-400'
                          : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                      }`}
                    >
                      <div className="text-xs font-bold">{preset.label}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#d4af37] hover:bg-[#c49f2c] text-stone-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                >
                  Create Manager Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
