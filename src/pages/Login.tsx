import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowRight } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-[55%] bg-primary z-0" />
      <div className="absolute bottom-0 w-full h-[45%] bg-gray-100 z-0" />
      
      {/* Decorative diagonal split */}
      <div className="absolute top-[50%] left-0 w-full h-32 bg-gray-100 z-0 -skew-y-3 origin-top-right transform -translate-y-1/2 scale-110" />

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative z-10 mx-4 border border-gray-100">
        <div className="text-center mb-8">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary shadow-inner ring-4 ring-white border border-blue-100">
            <ShieldCheck size={42} />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">事故现场图绘制系统</h1>
          <p className="text-gray-500 text-sm mt-2 font-medium">智慧交管 · 高效勘察 · 平板专用</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider">警员编号 / 账号</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                defaultValue="PC-88092"
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="请输入账号"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-600 ml-1 uppercase tracking-wider">登录密码</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="password" 
                defaultValue="123456"
                className="w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                placeholder="请输入密码"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-2"
          >
            <span>登录系统</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-gray-100 text-center text-xs text-gray-400 flex flex-col gap-1">
          <span>V 2.0.1 | 适配各型警务平板终端</span>
          <span>© 2024 智慧警务科技有限公司</span>
        </div>
      </div>
    </div>
  );
};

export default Login;