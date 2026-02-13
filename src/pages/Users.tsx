import React, { useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import {
  Search, Filter, Plus, User, Shield,
  Edit, Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_USERS = [
  { id: 'U001', name: '张警官', badge: 'PJ10086', role: '管理员', org: '朝阳支队', phone: '138****8001', status: 'active' },
  { id: 'U002', name: '李警官', badge: 'PJ10087', role: '办案员', org: '朝阳支队', phone: '139****8002', status: 'active' },
  { id: 'U003', name: '王警官', badge: 'PJ10088', role: '办案员', org: '海淀支队', phone: '136****8003', status: 'active' },
  { id: 'U004', name: '赵警官', badge: 'PJ10089', role: '审核员', org: '朝阳支队', phone: '137****8004', status: 'inactive' },
];

const Users = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = MOCK_USERS.filter(
    (u) =>
      u.name.includes(search) ||
      u.badge.includes(search) ||
      u.org.includes(search)
  );

  return (
    <DashboardLayout title="用户管理">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Toolbar */}
        <div className="bg-white p-4 rounded-xl shadow-custom mb-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center sticky top-0 z-10 border border-gray-100">
          <div className="flex gap-3 w-full md:w-auto flex-1">
            <div className="relative group flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary" size={18} />
              <input
                type="text"
                placeholder="搜索姓名、警号、组织..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={cn(
                'px-4 py-2.5 rounded-lg border flex items-center gap-2 transition-all font-medium',
                filterOpen ? 'bg-primary text-white border-primary shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              <Filter size={18} />
              <span className="hidden sm:inline">筛选</span>
            </button>
          </div>
          <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold shadow-md transition-all active:scale-95 whitespace-nowrap">
            <Plus size={20} />
            新增用户
          </button>
        </div>

        {filterOpen && (
          <div className="bg-white p-5 rounded-xl shadow-custom mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in slide-in-from-top-2 border border-gray-100">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">角色</label>
              <select className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50">
                <option>全部角色</option>
                <option>管理员</option>
                <option>办案员</option>
                <option>审核员</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">所属组织</label>
              <select className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50">
                <option>全部组织</option>
                <option>朝阳支队</option>
                <option>海淀支队</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase">状态</label>
              <select className="w-full border border-gray-200 rounded-md p-2 text-sm bg-gray-50">
                <option>全部状态</option>
                <option>在用</option>
                <option>停用</option>
              </select>
            </div>
          </div>
        )}

        {/* User List Card */}
        <div className="bg-white rounded-xl shadow-custom border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-lg text-gray-800">用户列表</h3>
            <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-mono">{filtered.length}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                <tr>
                  <th className="px-6 py-3">姓名 / 警号</th>
                  <th className="px-6 py-3">角色</th>
                  <th className="px-6 py-3">所属组织</th>
                  <th className="px-6 py-3">联系电话</th>
                  <th className="px-6 py-3">状态</th>
                  <th className="px-6 py-3 w-24">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-800">{user.name}</div>
                          <div className="text-xs text-gray-500 font-mono">{user.badge}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium">
                        <Shield size={12} /> {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{user.org}</td>
                    <td className="px-6 py-4 text-gray-600">{user.phone}</td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-md text-xs font-medium',
                          user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                        )}
                      >
                        {user.status === 'active' ? '在用' : '停用'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 rounded-lg hover:bg-blue-50 text-gray-500 hover:text-primary" title="编辑">
                          <Edit size={16} />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600" title="删除">
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
    </DashboardLayout>
  );
};

export default Users;
