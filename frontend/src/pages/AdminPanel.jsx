import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Spinner from '../components/Spinner';
import Button from '../components/Button';
import { toast } from 'react-hot-toast';
import { FiUsers, FiTrash2 } from 'react-icons/fi';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/auth/users');
      if (res.data.success) setUsers(res.data.users);
    } catch (error) {
      toast.error('Failed to load user list');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleRoleToggle = (userId, currentRole) => {
    const newRole = currentRole === 'Admin' ? 'Member' : 'Admin';
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast.success(`User role adjusted to ${newRole}`);
  };

  const handleUserDelete = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
    toast.success('User removed from team roster');
  };

  if (loading) return <div className="flex h-[60vh] items-center justify-center"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-text-heading font-heading tracking-tight">Admin Control Panel</h1>
        <p className="text-sm text-text-muted font-medium mt-1">Manage team members, roles, and administrative security.</p>
      </div>

      <div className="glass-panel p-4 sm:p-6 rounded-xl border border-border-color shadow-xl space-y-5">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border-color pb-4">
          <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
            <FiUsers size={20} />
          </div>
          <div>
            <h3 className="font-bold text-text-heading">Registered Accounts ({users.length})</h3>
            <p className="text-xs text-text-muted">Configure global roles or revoke access.</p>
          </div>
        </div>

        {/* Table — horizontally scrollable on mobile */}
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[500px] px-4 sm:px-0">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border-color text-text-muted font-semibold uppercase text-[10px] sm:text-[11px] tracking-wider">
                  <th className="pb-3 pr-4">User</th>
                  <th className="pb-3 pr-4">Email</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color">
                {users.map((item) => (
                  <tr key={item.id} className="text-text-main font-medium hover:bg-bg-surface/20 transition">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-bg-surface border border-border-color flex items-center justify-center text-xs font-bold text-indigo-500 shrink-0">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="truncate max-w-[80px] sm:max-w-none">{item.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-text-muted">
                      <span className="truncate block max-w-[120px] sm:max-w-none">{item.email}</span>
                    </td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        item.role === 'Admin'
                          ? 'bg-red-500/10 text-red-500 border-red-500/20'
                          : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                      }`}>
                        {item.role}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRoleToggle(item.id, item.role)}
                          className="text-[10px] sm:text-xs px-2 sm:px-3"
                        >
                          Toggle
                        </Button>
                        <button
                          onClick={() => handleUserDelete(item.id)}
                          className="p-1.5 text-text-muted hover:text-red-500 hover:bg-red-500/5 rounded transition"
                          title="Delete User"
                        >
                          <FiTrash2 size={14} />
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
    </div>
  );
};

export default AdminPanel;
