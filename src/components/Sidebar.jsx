import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Map,
  Bell,
  Cpu,
  Users,
  X,
  LogOut,
  ChevronRight,
  Workflow,
  Info
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };


  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: "Dashboard", path: "/dashboard", roles: ["admin", "manager", "user"] },
    { icon: <Map size={20} />, label: "Zones", path: "/zones", roles: ["admin", "manager", "user"] },
    { icon: <Cpu size={20} />, label: "Sensors", path: "/sensors", roles: ["admin", "manager", "user"] },
    { icon: <Bell size={20} />, label: "Alerts", path: "/alerts", roles: ["admin", "manager", "user"] },
    { icon: <Workflow size={20} />, label: "Technology", path: "/technology", roles: ["admin", "manager", "user"] },
    { icon: <Info size={20} />, label: "About", path: "/about", roles: ["admin", "manager", "user"] },
    { icon: <Users size={20} />, label: "Users", path: "/users", roles: ["admin"] },
  ];


  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Sidebar Content */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#052e16] text-white z-50 transition-transform duration-300 transform flex flex-col border-r border-emerald-900/30 ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between border-b border-emerald-900/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-800 to-green-950 rounded-xl flex items-center justify-center font-black text-xl shadow-lg border border-emerald-700/30">
              <span className="text-emerald-400 drop-shadow-md">S</span>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tighter text-white leading-none">SmartFarm</span>
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Security Grid</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 hover:bg-emerald-900/50 rounded-lg text-emerald-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="mt-6 flex-1 px-4 space-y-3 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            (!item.roles || item.roles.includes(user?.role)) && (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) => `
                  flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group
                  ${isActive 
                    ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-950/20" 
                    : "text-emerald-100/50 hover:bg-emerald-900/30 hover:text-white border border-transparent"}
                `}
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center gap-4">
                      <span className={`transition-colors duration-200 ${isActive ? 'text-emerald-400' : 'text-emerald-600/60 group-hover:text-emerald-400'}`}>
                        {item.icon}
                      </span>
                      <span className="font-bold tracking-tight">{item.label}</span>
                    </div>
                    <ChevronRight size={14} className={`transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                  </>
                )}
              </NavLink>
            )
          ))}
        </nav>

        {/* User Badge Section */}
        <div className="px-4 py-6">
           <div className="bg-emerald-950/40 rounded-[1.5rem] p-4 border border-emerald-900/30 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-800 flex items-center justify-center font-black text-emerald-100 shadow-inner">
                 {user?.name?.[0] || 'A'}
              </div>
              <div className="flex-1 min-w-0">
                 <p className="text-xs font-black text-white truncate">{user?.name || 'Authorized Personnel'}</p>
                 <p className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest">{user?.role || 'Guest'}</p>
              </div>
           </div>
        </div>

        {/* Logout Section */}
        <div className="p-4 border-t border-emerald-900/30 bg-black/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-2xl transition-all font-black text-sm group"
          >
            <LogOut size={20} className="transition-transform group-hover:-translate-x-1" />
            <span>Terminate Session</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
