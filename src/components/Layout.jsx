import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "../hooks/useAuth";

const Layout = ({ children, title, subtitle }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-[#f1f5f9] bg-[radial-gradient(#10b98115_1.5px,transparent_1.5px)] [background-size:32px_32px] text-slate-900 font-['Inter']">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 transition-all duration-300 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-emerald-100 sticky top-0 z-30">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 hover:bg-emerald-50 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6 text-emerald-600" />
          </button>
          <span className="font-black text-slate-900 tracking-tight">SmartFarm <span className="text-emerald-600">Secure</span></span>
          <button 
            onClick={handleLogout}
            className="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 font-bold shadow-sm border border-rose-100 active:scale-95 transition-all"
            title="Logout"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="p-4 md:p-8">
          {/* Page Header */}
          <header className="mb-8 hidden lg:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-slate-900 font-['Outfit'] tracking-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500 font-medium tracking-wide">
                  {subtitle}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-slate-400">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              {loading ? (
                 <div className="h-10 w-32 bg-emerald-100/50 animate-pulse rounded-xl"></div>
              ) : (
                <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-900 leading-none">{user?.name || 'Anonymous'}</p>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 leading-none">{user?.role || 'Guest'}</p>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold font-['Outfit'] shadow-lg shadow-emerald-200">
                    {user?.name?.[0] || 'A'}
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* Main Content */}
          <main className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                </div>
             ) : children}
          </main>
        </div>
      </div>
    </div>

  );
};


export default Layout;
