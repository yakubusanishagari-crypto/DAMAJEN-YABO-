import React, { useState } from 'react';
import { ConstituencyOffice, AdminUser } from '../types';
import { 
  Building2, Users, Shield, Plus, Edit, Trash2, CheckCircle2, 
  X, Check, AlertCircle, Lock, Eye, EyeOff, Sparkles, Filter, 
  Search, ShieldCheck, Power, Key, ChevronRight, Compass
} from 'lucide-react';

interface Props {
  offices: ConstituencyOffice[];
  setOffices: React.Dispatch<React.SetStateAction<ConstituencyOffice[]>>;
  adminUsers: AdminUser[];
  setAdminUsers: React.Dispatch<React.SetStateAction<AdminUser[]>>;
  currentAdminEmail: string;
  onPreviewOffice?: (office: ConstituencyOffice) => void;
  onLogActivity?: (action: string) => void;
}

const AVAILABLE_MODULES: { id: string; label: string; description: string }[] = [
  { id: 'projects', label: 'Projects & Infrastructure', description: 'Civil works, site evidence, GIS tracking' },
  { id: 'news', label: 'News & Press Releases', description: 'Official press statements and news dispatches' },
  { id: 'legislative', label: 'Legislative (Bills & Motions)', description: 'Bills, motions, and parliamentary records' },
  { id: 'empowerment', label: 'Empowerment Schemes', description: 'Vocational programs, grants, and bursaries' },
  { id: 'applications', label: 'Applications Vetting', description: 'Screening and approving constituent applications' },
  { id: 'gallery', label: 'Photo & Video Gallery', description: 'Multimedia archives and YouTube broadcasts' },
  { id: 'townhall', label: 'Town Hall & Voting Polls', description: 'Constituency civic polling and digital voting' },
  { id: 'petitions', label: 'Community Petitions', description: 'Grassroots grievance redress and decision dispatch' },
  { id: 'enquiries', label: 'Citizen Enquiries', description: 'Public inquiries and constituent feedback' },
  { id: 'election', label: 'Election Results & Agents', description: 'Ward agents roster and polling unit verification' },
  { id: 'analytics', label: 'Visitor Analytics', description: 'Public portal demographic and view metrics' }
];

export const AdminOfficesTab: React.FC<Props> = ({
  offices,
  setOffices,
  adminUsers,
  setAdminUsers,
  currentAdminEmail,
  onPreviewOffice,
  onLogActivity
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'Active' | 'Inactive'>('ALL');
  const [notice, setNotice] = useState<string | null>(null);

  // Office Modals
  const [showCreateOfficeModal, setShowCreateOfficeModal] = useState(false);
  const [editingOffice, setEditingOffice] = useState<ConstituencyOffice | null>(null);

  // User Modals
  const [showCreateUserModal, setShowCreateUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [showUserPassword, setShowUserPassword] = useState(false);

  // Office Form State
  const [officeForm, setOfficeForm] = useState({
    name: '',
    code: '',
    location: '',
    description: '',
    headOfOffice: '',
    contactEmail: '',
    contactPhone: '',
    status: 'Active' as 'Active' | 'Inactive',
    authorizedTabs: ['overview', 'projects'] as string[],
    assignedAdminEmails: [] as string[]
  });

  // User Form State
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'Office Administrator' as 'Super Administrator' | 'Office Administrator',
    officeId: '',
    password: ''
  });

  const showNotification = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  // Toggle Office Active/Inactive
  const handleToggleOfficeStatus = async (office: ConstituencyOffice) => {
    const nextStatus = office.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await fetch(`/api/offices/${office.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setOffices(prev => prev.map(o => o.id === office.id ? updated : o));
        showNotification(`Office "${office.name}" marked as ${nextStatus.toUpperCase()}.`);
        onLogActivity?.(`Toggled status of office "${office.name}" to ${nextStatus}`);
      }
    } catch {
      // Fallback local update
      setOffices(prev => prev.map(o => o.id === office.id ? { ...o, status: nextStatus } : o));
      showNotification(`Office "${office.name}" status updated locally to ${nextStatus}.`);
    }
  };

  // Save New Office
  const handleCreateOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!officeForm.name.trim() || !officeForm.code.trim()) return;

    try {
      const res = await fetch('/api/offices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...officeForm,
          authorizedTabs: ['overview', ...officeForm.authorizedTabs.filter(t => t !== 'overview')]
        })
      });

      if (res.ok) {
        const created = await res.json();
        setOffices(prev => [created, ...prev]);
        showNotification(`New office "${created.name}" created successfully.`);
        onLogActivity?.(`Created constituency office: ${created.name} (${created.code})`);
      }
    } catch {
      const fallback: ConstituencyOffice = {
        id: `off-${Date.now()}`,
        ...officeForm,
        code: officeForm.code.toUpperCase(),
        createdAt: new Date().toISOString().split('T')[0]
      };
      setOffices(prev => [fallback, ...prev]);
      showNotification(`Office created in local workspace.`);
    }

    setShowCreateOfficeModal(false);
    setOfficeForm({
      name: '',
      code: '',
      location: '',
      description: '',
      headOfOffice: '',
      contactEmail: '',
      contactPhone: '',
      status: 'Active',
      authorizedTabs: ['overview', 'projects'],
      assignedAdminEmails: []
    });
  };

  // Update Existing Office
  const handleUpdateOffice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffice) return;

    try {
      const res = await fetch(`/api/offices/${editingOffice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingOffice)
      });
      if (res.ok) {
        const updated = await res.json();
        setOffices(prev => prev.map(o => o.id === editingOffice.id ? updated : o));
        showNotification(`Office "${editingOffice.name}" updated successfully.`);
        onLogActivity?.(`Updated office settings for: ${editingOffice.name}`);
      }
    } catch {
      setOffices(prev => prev.map(o => o.id === editingOffice.id ? editingOffice : o));
    }
    setEditingOffice(null);
  };

  // Delete Office
  const handleDeleteOffice = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete the office "${name}"? Assigned staff will be unassigned.`)) return;

    try {
      await fetch(`/api/offices/${id}`, { method: 'DELETE' });
    } catch {}

    setOffices(prev => prev.filter(o => o.id !== id));
    showNotification(`Office "${name}" removed.`);
    onLogActivity?.(`Deleted office: ${name}`);
  };

  // Create Admin User
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userForm.name.trim() || !userForm.email.trim()) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userForm)
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to create admin user.');
        return;
      }

      setAdminUsers(prev => [data, ...prev]);
      showNotification(`Administrator "${data.name}" registered and assigned.`);
      onLogActivity?.(`Created admin account for: ${data.name} (${data.email})`);
      setShowCreateUserModal(false);
      setUserForm({
        name: '',
        email: '',
        role: 'Office Administrator',
        officeId: '',
        password: ''
      });
    } catch (err: any) {
      alert('Network error registering administrator.');
    }
  };

  // Update Admin User
  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });
      if (res.ok) {
        const updated = await res.json();
        setAdminUsers(prev => prev.map(u => u.id === editingUser.id ? updated : u));
        showNotification(`Administrator account "${editingUser.name}" updated.`);
      }
    } catch {}
    setEditingUser(null);
  };

  // Delete Admin User
  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete admin account "${name}"?`)) return;
    try {
      await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
    } catch {}
    setAdminUsers(prev => prev.filter(u => u.id !== id));
    showNotification(`Administrator "${name}" removed.`);
  };

  const filteredOffices = offices.filter(o => {
    const matchesSearch = !searchTerm || 
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.headOfOffice.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="w-full min-w-0 space-y-8 animate-fadeIn">
      {/* Top Banner Notice */}
      {notice && (
        <div className="bg-emerald-50 border-2 border-emerald-500 p-4 rounded-2xl text-emerald-900 font-bold text-xs sm:text-sm flex items-center justify-between shadow-md animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{notice}</span>
          </div>
          <button onClick={() => setNotice(null)} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-['Manrope'] font-extrabold text-2xl text-[#103C2E] uppercase">
              CONSTITUENCY OFFICES & RBAC ACCESS CONTROL ({offices.length})
            </h3>
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black border border-emerald-300 uppercase">
              SUPER ADMIN MASTER AUTHORITY
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage functional constituency bureaus, enforce role-based permissions, activate or deactivate offices, and assign designated administrators.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowCreateUserModal(true)}
            className="bg-white hover:bg-stone-50 text-[#103C2E] border border-stone-300 px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition uppercase"
          >
            <Users className="w-4 h-4 text-[#C6A15B]" />
            <span>ADD ADMIN USER</span>
          </button>

          <button
            onClick={() => setShowCreateOfficeModal(true)}
            className="bg-[#103C2E] hover:bg-[#09291F] text-[#D4AF37] border border-[#C6A15B]/50 px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-md cursor-pointer transition uppercase tracking-wider"
          >
            <Plus className="w-4 h-4 text-[#D4AF37]" />
            <span>CREATE NEW OFFICE</span>
          </button>
        </div>
      </div>

      {/* Quick KPI Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase block">Total Configured Offices</span>
          <strong className="text-3xl font-extrabold text-[#103C2E] block">{offices.length}</strong>
          <span className="text-[10px] text-emerald-600 font-semibold">Functional Bureaus</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase block">Active Operational Bureaus</span>
          <strong className="text-3xl font-extrabold text-emerald-700 block">
            {offices.filter(o => o.status === 'Active').length}
          </strong>
          <span className="text-[10px] text-stone-500 font-semibold">Online & Accessible</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase block">Assigned Administrators</span>
          <strong className="text-3xl font-extrabold text-[#103C2E] block">{adminUsers.length}</strong>
          <span className="text-[10px] text-stone-500 font-semibold">Staff Accounts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase block">Backend Security & RBAC</span>
          <strong className="text-xl font-extrabold text-[#D4AF37] block mt-1">ENFORCED</strong>
          <span className="text-[10px] text-emerald-700 font-bold">Role Scoping Active</span>
        </div>
      </div>

      {/* Search & Status Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search offices by name, bureau code, location, or bureau chief..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-stone-400 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-[#103C2E] focus:outline-none focus:border-[#103C2E]"
          >
            <option value="ALL">All Statuses ({offices.length})</option>
            <option value="Active">Active Only ({offices.filter(o => o.status === 'Active').length})</option>
            <option value="Inactive">Inactive Only ({offices.filter(o => o.status === 'Inactive').length})</option>
          </select>
        </div>
      </div>

      {/* Section 1: Office Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-['Manrope'] font-bold text-sm text-[#103C2E] uppercase flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#C6A15B]" />
            <span>Constituency Operational Offices ({filteredOffices.length})</span>
          </h4>
          <span className="text-[11px] text-stone-500 font-medium">Click status toggle to activate/deactivate an office</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredOffices.map((office) => {
            const isActive = office.status === 'Active';
            const assignedStaff = adminUsers.filter(u => u.officeId === office.id || office.assignedAdminEmails?.includes(u.email));

            return (
              <div 
                key={office.id} 
                className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all space-y-4 shadow-sm hover:shadow-md ${
                  isActive ? 'border-stone-200 hover:border-[#103C2E]' : 'border-rose-200 bg-rose-50/20'
                }`}
              >
                {/* Office Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md font-mono text-[10px] font-black uppercase bg-[#103C2E] text-[#D4AF37]">
                        {office.code}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {office.status}
                      </span>
                    </div>
                    <h5 className="font-['Manrope'] font-black text-lg text-[#103C2E] leading-snug">
                      {office.name}
                    </h5>
                    <p className="text-xs text-stone-500">
                      <strong>Head of Office:</strong> {office.headOfOffice} • <strong>Location:</strong> {office.location}
                    </p>
                  </div>

                  {/* Quick Status Toggle Button */}
                  <button
                    onClick={() => handleToggleOfficeStatus(office)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs uppercase cursor-pointer transition shadow-xs ${
                      isActive 
                        ? 'bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200' 
                        : 'bg-emerald-50 hover:bg-emerald-600 text-emerald-800 hover:text-white border border-emerald-200'
                    }`}
                    title={isActive ? 'Deactivate Office' : 'Activate Office'}
                  >
                    <Power className="w-3.5 h-3.5" />
                    <span>{isActive ? 'Deactivate' : 'Activate'}</span>
                  </button>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed font-light">
                  {office.description}
                </p>

                {/* Authorized Modules */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                    Authorized Dashboard Modules ({office.authorizedTabs?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {(office.authorizedTabs || ['overview']).map(tabId => {
                      const mod = AVAILABLE_MODULES.find(m => m.id === tabId);
                      return (
                        <span key={tabId} className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200">
                          {mod ? mod.label : tabId.toUpperCase()}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Assigned Staff */}
                <div className="space-y-1.5 bg-stone-50 p-3.5 rounded-2xl border border-stone-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#103C2E] block">
                    Assigned Personnel ({assignedStaff.length}):
                  </span>
                  {assignedStaff.length > 0 ? (
                    <div className="space-y-1">
                      {assignedStaff.map(staff => (
                        <div key={staff.id} className="flex items-center justify-between text-xs text-stone-700">
                          <span className="font-bold text-[#103C2E]">{staff.name}</span>
                          <span className="text-[11px] font-mono text-stone-500">{staff.email}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 italic">No admin user assigned yet.</span>
                  )}
                </div>

                {/* Office Card Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100">
                  <div className="text-[11px] text-stone-400 font-mono">
                    Contact: {office.contactEmail} • {office.contactPhone}
                  </div>

                  <div className="flex items-center gap-2">
                    {onPreviewOffice && (
                      <button
                        onClick={() => onPreviewOffice(office)}
                        className="bg-emerald-50 hover:bg-[#103C2E] text-[#103C2E] hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1 border border-emerald-200"
                        title="Simulate Office Admin View"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Preview View</span>
                      </button>
                    )}

                    <button
                      onClick={() => setEditingOffice(office)}
                      className="bg-stone-100 hover:bg-stone-200 text-stone-800 px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => handleDeleteOffice(office.id, office.name)}
                      className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2.5 py-1.5 rounded-xl text-xs font-bold uppercase transition"
                      title="Delete Office"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Administrator Accounts Directory */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
          <div>
            <h4 className="font-['Manrope'] font-bold text-base text-[#103C2E] uppercase flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#C6A15B]" />
              <span>Administrator Directory & Role Assignments ({adminUsers.length})</span>
            </h4>
            <p className="text-xs text-stone-500">
              Staff accounts verified through cryptographic salted scrypt password hashing.
            </p>
          </div>

          <button
            onClick={() => setShowCreateUserModal(true)}
            className="bg-[#103C2E] hover:bg-[#09291F] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4 text-[#C6A15B]" />
            <span>Register New Admin</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                <th className="p-3">Administrator Name</th>
                <th className="p-3">Official Email</th>
                <th className="p-3">Access Role</th>
                <th className="p-3">Assigned Office</th>
                <th className="p-3">Account Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {adminUsers.map((user) => {
                const assignedOffice = offices.find(o => o.id === user.officeId);
                const isSuper = user.role === 'Super Administrator';

                return (
                  <tr key={user.id} className="hover:bg-stone-50 transition">
                    <td className="p-3 font-bold text-[#103C2E]">
                      {user.name}
                      {user.email === currentAdminEmail && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                          You
                        </span>
                      )}
                    </td>
                    <td className="p-3 font-mono text-stone-600">{user.email}</td>
                    <td className="p-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        isSuper ? 'bg-[#103C2E] text-[#D4AF37]' : 'bg-stone-100 text-stone-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">
                      {isSuper ? (
                        <span className="font-semibold text-emerald-800 text-[11px]">All Offices (Master Control)</span>
                      ) : (
                        <span className="font-semibold text-stone-800 text-[11px]">
                          {assignedOffice ? assignedOffice.name : (user.officeName || 'Unassigned')}
                        </span>
                      )}
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        user.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Deactivated'}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-1.5">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-2.5 py-1 rounded-lg font-bold text-[11px] uppercase transition cursor-pointer"
                      >
                        Edit
                      </button>
                      {!isSuper && (
                        <button
                          onClick={() => handleDeleteUser(user.id, user.name)}
                          className="bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white px-2 py-1 rounded-lg font-bold text-[11px] uppercase transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Create New Office */}
      {showCreateOfficeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 my-8">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#C6A15B]">BUREAU CONFIGURATION</span>
                <h4 className="font-bold text-lg text-[#103C2E] uppercase">Create New Constituency Office</h4>
              </div>
              <button onClick={() => setShowCreateOfficeModal(false)} className="p-1 hover:bg-stone-100 rounded-lg text-stone-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateOffice} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Office Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Media & Public Relations Bureau"
                    value={officeForm.name}
                    onChange={(e) => setOfficeForm({ ...officeForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Bureau Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. OFF-MEDIA"
                    value={officeForm.code}
                    onChange={(e) => setOfficeForm({ ...officeForm, code: e.target.value.toUpperCase() })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Head of Office / Director *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alhaji Bello Dan-Yabo"
                    value={officeForm.headOfOffice}
                    onChange={(e) => setOfficeForm({ ...officeForm, headOfOffice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Physical Location *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Danmaje Civic Secretariat, Yabo"
                    value={officeForm.location}
                    onChange={(e) => setOfficeForm({ ...officeForm, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Official Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="office@danmayeyabo.gov.ng"
                    value={officeForm.contactEmail}
                    onChange={(e) => setOfficeForm({ ...officeForm, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Official Helpline *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+234 803 000 0000"
                    value={officeForm.contactPhone}
                    onChange={(e) => setOfficeForm({ ...officeForm, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Description & Mandate</label>
                <textarea
                  rows={2}
                  placeholder="Describe the core statutory purpose, citizen interface, or operational duties of this office..."
                  value={officeForm.description}
                  onChange={(e) => setOfficeForm({ ...officeForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                />
              </div>

              {/* Module Checkboxes */}
              <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <label className="font-bold text-[#103C2E] uppercase block">
                  Authorized Dashboard Modules for this Office *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_MODULES.map(mod => {
                    const isChecked = officeForm.authorizedTabs.includes(mod.id);
                    return (
                      <label 
                        key={mod.id} 
                        className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition ${
                          isChecked ? 'bg-white border-[#103C2E] shadow-xs' : 'bg-stone-100/60 border-stone-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setOfficeForm({ ...officeForm, authorizedTabs: [...officeForm.authorizedTabs, mod.id] });
                            } else {
                              setOfficeForm({ ...officeForm, authorizedTabs: officeForm.authorizedTabs.filter(id => id !== mod.id) });
                            }
                          }}
                          className="mt-0.5 rounded text-[#103C2E]"
                        />
                        <div>
                          <strong className="block text-[#103C2E] text-xs font-bold">{mod.label}</strong>
                          <span className="text-[10px] text-stone-500 block leading-tight">{mod.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateOfficeModal(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#103C2E] hover:bg-[#09291F] text-[#D4AF37] px-6 py-2 rounded-xl font-black uppercase shadow cursor-pointer border border-[#C6A15B]/50"
                >
                  Commit & Create Office
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Office & Permissions */}
      {editingOffice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 my-8">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#C6A15B]">EDIT BUREAU & PERMISSIONS</span>
                <h4 className="font-bold text-lg text-[#103C2E] uppercase">{editingOffice.name}</h4>
              </div>
              <button onClick={() => setEditingOffice(null)} className="p-1 hover:bg-stone-100 rounded-lg text-stone-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateOffice} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Office Name</label>
                  <input
                    type="text"
                    required
                    value={editingOffice.name}
                    onChange={(e) => setEditingOffice({ ...editingOffice, name: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Bureau Status</label>
                  <select
                    value={editingOffice.status}
                    onChange={(e) => setEditingOffice({ ...editingOffice, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  >
                    <option value="Active">Active (Operational)</option>
                    <option value="Inactive">Inactive (Deactivated)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Head of Office</label>
                  <input
                    type="text"
                    required
                    value={editingOffice.headOfOffice}
                    onChange={(e) => setEditingOffice({ ...editingOffice, headOfOffice: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Location</label>
                  <input
                    type="text"
                    required
                    value={editingOffice.location}
                    onChange={(e) => setEditingOffice({ ...editingOffice, location: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              {/* Module Checkboxes */}
              <div className="space-y-2 bg-stone-50 p-4 rounded-2xl border border-stone-200">
                <label className="font-bold text-[#103C2E] uppercase block">
                  Authorized Dashboard Modules
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AVAILABLE_MODULES.map(mod => {
                    const isChecked = (editingOffice.authorizedTabs || []).includes(mod.id);
                    return (
                      <label 
                        key={mod.id} 
                        className={`flex items-start gap-2 p-2.5 rounded-xl border cursor-pointer transition ${
                          isChecked ? 'bg-white border-[#103C2E]' : 'bg-stone-100/60 border-stone-200'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            const cur = editingOffice.authorizedTabs || [];
                            if (e.target.checked) {
                              setEditingOffice({ ...editingOffice, authorizedTabs: [...cur, mod.id] });
                            } else {
                              setEditingOffice({ ...editingOffice, authorizedTabs: cur.filter(id => id !== mod.id) });
                            }
                          }}
                          className="mt-0.5 rounded text-[#103C2E]"
                        />
                        <div>
                          <strong className="block text-[#103C2E] text-xs font-bold">{mod.label}</strong>
                          <span className="text-[10px] text-stone-500 block leading-tight">{mod.description}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingOffice(null)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2 rounded-xl font-bold uppercase shadow cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Create New Admin User */}
      {showCreateUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 my-8">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#C6A15B]">STAFF CREDENTIALS</span>
                <h4 className="font-bold text-base text-[#103C2E] uppercase">Register Administrator</h4>
              </div>
              <button onClick={() => setShowCreateUserModal(false)} className="p-1 hover:bg-stone-100 rounded-lg text-stone-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Engr. Faruq Shagari"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Official Email *</label>
                <input
                  type="email"
                  required
                  placeholder="staff.name@danmayeyabo.gov.ng"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Access Role *</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                >
                  <option value="Office Administrator">Office Administrator (Scoped to specific office)</option>
                  <option value="Super Administrator">Super Administrator (Chief overall master control)</option>
                </select>
              </div>

              {userForm.role === 'Office Administrator' && (
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Assigned Constituency Office *</label>
                  <select
                    required
                    value={userForm.officeId}
                    onChange={(e) => setUserForm({ ...userForm, officeId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  >
                    <option value="">-- Select Office --</option>
                    {offices.map(o => (
                      <option key={o.id} value={o.id}>{o.name} ({o.code})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Account Password *</label>
                <div className="relative">
                  <input
                    type={showUserPassword ? 'text' : 'password'}
                    required
                    placeholder="Set strong initial password..."
                    value={userForm.password}
                    onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                    className="w-full pl-3.5 pr-10 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowUserPassword(!showUserPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    {showUserPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-stone-400">Password will be cryptographically hashed with scrypt salt.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateUserModal(false)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2 rounded-xl font-bold uppercase shadow cursor-pointer"
                >
                  Register Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Edit Admin User */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-stone-200 my-8">
            <div className="flex justify-between items-center border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-black uppercase text-[#C6A15B]">UPDATE ACCOUNT</span>
                <h4 className="font-bold text-base text-[#103C2E] uppercase">{editingUser.name}</h4>
              </div>
              <button onClick={() => setEditingUser(null)} className="p-1 hover:bg-stone-100 rounded-lg text-stone-500 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Full Legal Name</label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                >
                  <option value="Office Administrator">Office Administrator</option>
                  <option value="Super Administrator">Super Administrator</option>
                </select>
              </div>

              {editingUser.role === 'Office Administrator' && (
                <div className="space-y-1">
                  <label className="font-bold text-[#103C2E] uppercase">Assigned Office</label>
                  <select
                    value={editingUser.officeId || ''}
                    onChange={(e) => setEditingUser({ ...editingUser, officeId: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                  >
                    <option value="">-- No Office Assigned --</option>
                    {offices.map(o => (
                      <option key={o.id} value={o.id}>{o.name} ({o.code})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1">
                <label className="font-bold text-[#103C2E] uppercase">Account Active Status</label>
                <select
                  value={editingUser.isActive ? 'true' : 'false'}
                  onChange={(e) => setEditingUser({ ...editingUser, isActive: e.target.value === 'true' })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl font-bold"
                >
                  <option value="true">Active (Access Allowed)</option>
                  <option value="false">Deactivated (Access Blocked)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 rounded-xl font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#103C2E] hover:bg-[#09291F] text-white px-5 py-2 rounded-xl font-bold uppercase shadow cursor-pointer"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
