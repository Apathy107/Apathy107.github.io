import { User, Smartphone, Shield, LogOut, ChevronRight } from 'lucide-react';
import Layout from '@/components/Layout';

const System = () => {
  return (
    <Layout title="系统管理">
      <div className="space-y-6">
        {/* User Card */}
        <div className="bg-gradient-to-r from-primary to-blue-600 rounded-xl p-6 text-white shadow-lg">
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
        <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
           <div className="divide-y divide-border">
             <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={18} /></div>
                   <span className="font-medium text-gray-700">个人信息修改</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
             </div>
             <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Smartphone size={18} /></div>
                   <span className="font-medium text-gray-700">设备绑定管理</span>
                </div>
                <div className="flex items-center gap-2">
                   <span className="text-xs text-gray-400">华为 MatePad Pro</span>
                   <ChevronRight size={18} className="text-gray-400" />
                </div>
             </div>
             <div className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Shield size={18} /></div>
                   <span className="font-medium text-gray-700">安全设置与密码</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
             </div>
           </div>
        </div>

        <div className="text-center pt-8">
           <p className="text-sm text-gray-400 mb-4">当前版本 V1.0.0 (Build 20240501)</p>
           <button className="w-full bg-white border border-destructive/30 text-destructive font-medium py-3 rounded-xl hover:bg-destructive/5 transition-colors">
             退出当前账号
           </button>
        </div>
      </div>
    </Layout>
  );
};

export default System;