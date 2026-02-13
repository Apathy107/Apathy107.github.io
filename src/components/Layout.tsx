import React from 'react';
import { 
  Menu, FileText, PenTool, BarChart3, Settings, 
  Map, LayoutDashboard, LogOut, ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  showBack?: boolean;
}

const Layout = ({ children, title }: LayoutProps) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const navItems = [
    { icon: LayoutDashboard, label: "事故列表", path: "/accidents" },
    { icon: Map, label: "事故绘图", path: "/diagram" }, // Direct link usually enters via accident, but for demo
    { icon: FileText, label: "笔录管理", path: "/records" },
    { icon: BarChart3, label: "事故统计", path: "/statistics" },
    { icon: Settings, label: "系统管理", path: "/system" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Sidebar for Tablet/Desktop */}
      <aside className={cn(
        "hidden md:flex flex-col w-64 border-r border-border bg-card transition-all duration-300",
        !isSidebarOpen && "w-20"
      )}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {isSidebarOpen && <span className="font-bold text-lg text-primary">事故绘图系统</span>}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-muted rounded-md text-muted-foreground">
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-3 mx-2 my-1 rounded-md transition-colors",
                  isActive 
                    ? "bg-primary/10 text-primary font-medium" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <item.icon size={20} />
                {isSidebarOpen && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <Link to="/" className="flex items-center text-destructive hover:bg-destructive/10 p-2 rounded-md transition-colors">
            <LogOut size={20} />
            {isSidebarOpen && <span className="ml-3">退出登录</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-14 md:h-16 flex items-center justify-between px-4 bg-primary text-primary-foreground md:bg-card md:text-foreground border-b border-border shrink-0">
          <div className="flex items-center">
             <h1 className="text-lg font-bold">{title}</h1>
          </div>
          <div className="flex items-center space-x-2">
             <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
               警员
             </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6 pb-20 md:pb-6">
          {children}
        </main>

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border flex items-center justify-around z-50">
          {navItems.map((item) => {
             const isActive = location.pathname.startsWith(item.path);
             return (
               <Link 
                 key={item.path} 
                 to={item.path} 
                 className={cn(
                   "flex flex-col items-center justify-center w-full h-full space-y-1",
                   isActive ? "text-primary" : "text-muted-foreground"
                 )}
               >
                 <item.icon size={20} />
                 <span className="text-[10px]">{item.label}</span>
               </Link>
             )
          })}
        </div>
      </div>
    </div>
  );
};

export default Layout;