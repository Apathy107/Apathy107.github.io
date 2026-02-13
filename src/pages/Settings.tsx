import React from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/layouts/DashboardLayout';
import { User, Smartphone, Shield, LogOut, ChevronRight } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();

  return (
    <DashboardLayout title="系统设置">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Current User Card */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg border border-primary/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
              <User size={32} />
            </div>
            <div>
              <h2 className="text-xl font-bold">张警官</h2>
              <p className="text-blue-100 text-sm mt-1">警号：PJ10086</p>
              <p className="text-blue-100 text-xs opacity-80">北京市公安局朝阳分局交通支队</p>
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-custom overflow-hidden">
          <div className="divide-y divide-gray-100">
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <User size={18} />
                </div>
                <span className="font-medium text-gray-700">个人信息修改</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <Smartphone size={18} />
                </div>
                <span className="font-medium text-gray-700">设备绑定管理</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">华为 MatePad Pro</span>
                <ChevronRight size={18} className="text-gray-400" />
              </div>
            </button>
            <button className="w-full p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors text-left">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                  <Shield size={18} />
                </div>
                <span className="font-medium text-gray-700">安全设置与密码</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </button>
          </div>
        </div>

        <div className="text-center pt-6 space-y-4">
          <p className="text-sm text-gray-400">当前版本 V2.0.1 (Build 20240501)</p>
          <button
            onClick={() => navigate('/login')}
            className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 bg-white border border-red-200 text-red-600 font-medium py-3 rounded-xl hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            退出当前账号
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
