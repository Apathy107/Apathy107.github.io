import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, AlertTriangle, FileText, BarChart3, Settings, 
  LogOut, Menu, ShieldCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, title }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // 菜单配置 - 适配平板操作
  const menuItems = [
    { label: '事故管理', icon: AlertTriangle, path: '/' },
    { label: '笔录管理', icon: FileText, path: '/records' },
    { label: '事故统计', icon: BarChart3, path: '/stats' },
    { label: '用户管理', icon: Users, path: '/users' },
    { label: '系统设置', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden font-sans">
      {/* Sidebar - Tablet Optimized */}
      <aside 
        className={cn(
          "bg-primary text-white flex flex-col transition-all duration-300 relative shadow-xl z-20",
          collapsed ? "w-20" : "w-64"
        )}
      >
        {/* Header/Logo */}
        <div className="h-16 flex items-center justify-center border-b border-white/10 relative">
          <div className="flex items-center gap-3">
            <ShieldCheck size={28} className="text-blue-300" />
            {!collapsed && <span className="text-lg font-bold tracking-wide">智慧交管绘图</span>}
          </div>
          {/* Toggle Button */}
          <button 
            onClick={() => setCollapsed(!collapsed)}
            className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white text-primary p-1 rounded-full shadow-md border border-gray-100 hover:bg-gray-50 z-30"
          >
            <Menu size={14} />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group text-left",
                  isActive 
                    ? "bg-white/15 text-white shadow-sm font-medium border-l-4 border-blue-300" 
                    : "text-white/70 hover:bg-white/5 hover:text-white border-l-4 border-transparent"
                )}
                title={collapsed ? item.label : undefined}
              >
                <div className="min-w-[22px]">
                   <item.icon size={22} className={cn(isActive ? "text-blue-300" : "group-hover:text-blue-200")} />
                </div>
                {!collapsed && <span className="whitespace-nowrap">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User / Footer */}
        <div className="p-4 border-t border-white/10">
          <button 
            onClick={() => navigate('/login')}
            className={cn(
              "w-full flex items-center rounded-lg hover:bg-white/5 transition-colors text-white/80 hover:text-white",
              collapsed ? "justify-center p-2" : "gap-3 p-2"
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span className="text-sm">退出登录</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50 relative">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-border px-6 flex items-center justify-between shadow-sm flex-shrink-0 z-10">
          <h1 className="text-xl font-bold text-gray-800 tracking-tight">{title || '工作台'}</h1>
          <div className="flex items-center gap-4">
             <div className="text-xs md:text-sm text-gray-500 hidden md:block">
                设备编号: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-700 font-bold">HUA-PAD-092</span>
             </div>
             <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold shadow-custom ring-2 ring-blue-100">
               警
             </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-6 pb-20">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;