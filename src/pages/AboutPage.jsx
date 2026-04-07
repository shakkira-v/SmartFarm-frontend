import { useState } from "react";
import Layout from "../components/Layout";
import { 
  ShieldCheck, 
  Users, 
  Eye, 
  Zap, 
  MessageSquare, 
  UserCircle, 
  Briefcase, 
  Sprout,
  Send,
  Info
} from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/api";

const AboutPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await api.post("/system/contact", formData);
      toast.success(res.data.message || "Message sent successfully!", {
        style: { borderRadius: '16px', background: '#052e16', color: '#fff', fontWeight: 'bold' }
      });
      setFormData({ name: "", subject: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Transmission failed.");
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    {
      role: "System Admin",
      icon: ShieldCheck,
      color: "text-blue-500",
      bg: "bg-blue-50",
      description: "Oversees the entire infrastructure, manages user approvals, and monitors system-wide health and security protocols."
    },
    {
      role: "Farm Manager",
      icon: Briefcase,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
      description: "Controls the grid, configures zones and IR sensors, manages intrusion simulations, and coordinates priority responses."
    },
    {
      role: "System Viewer",
      icon: Eye,
      color: "text-amber-500",
      bg: "bg-amber-50",
      description: "Monitors personal land zones via real-time vision feeds, receives instant alerts, and ensures crop safety."
    }
  ];

  return (
    <Layout 
      title="Project Overview & Protocol" 
      subtitle="Smart Farm Security: Where advanced surveillance meets sustainable agriculture"
    >
      <div className="max-w-6xl mx-auto py-12 px-4 space-y-24">
        
        {/* Project Mission Section */}
        <section className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100/50 rounded-full text-emerald-700 text-xs font-black uppercase tracking-widest">
            <Zap size={14} className="fill-emerald-700" />
            Our Mission
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">
            Protecting the Future of <span className="text-emerald-600">Agriculture</span>
          </h2>
          <p className="max-w-3xl mx-auto text-gray-500 font-medium leading-relaxed">
            The Smart Farm Security system is a comprehensive surveillance ecosystem designed to prevent wildlife intrusion using non-invasive technology. By combining IoT sensors and AI-powered thermal vision, we ensure that both the crops and the wildlife remain safe.
          </p>
        </section>

        {/* Role Hierarchy Section */}
        <section className="space-y-12">
          <div className="text-center">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">The Command Hierarchy</h3>
            <p className="text-sm text-gray-400 font-bold mt-2">Clearly defined roles for streamlined farm operations</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, idx) => (
              <div key={idx} className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 hover:scale-105 transition-transform duration-300">
                <div className={`w-14 h-14 ${role.bg} ${role.color} rounded-2xl flex items-center justify-center mb-6`}>
                  <role.icon size={28} />
                </div>
                <h4 className="text-xl font-black text-gray-800 mb-3">{role.role}</h4>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">{role.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Protocol Section */}
        <section className="bg-[#022c22] rounded-[3rem] p-8 md:p-16 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5">
             <Eye size={300} />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="px-4 py-1 bg-emerald-500/20 rounded-full border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] inline-block">
                Technical Protocol
              </div>
              <h3 className="text-3xl font-black leading-tight">AI Integrated Thermal Surveillance</h3>
              <p className="text-emerald-100/60 font-medium leading-relaxed">
                Our system utilizes high-frequency IR sensor grids coupled with real-time computer vision simulation. In night monitoring mode, the AI analyzes heat signatures to identify moving objects—tracking elephants, boars, and other animals with 98% accuracy.
              </p>
              <ul className="space-y-3">
                {["In-App Messaging Gateway", "Thermal Vision Simulation", "Dynamic Zone Risk Assessment"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-bold text-emerald-200">
                    <ShieldCheck size={18} className="text-emerald-400" /> {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 space-y-6">
               <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-black">
                     <Users size={20} />
                  </div>
                  <div>
                    <h5 className="font-bold">System Status</h5>
                    <p className="text-[10px] text-emerald-400 uppercase font-black">Protocols Optimized</p>
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold">
                     <span className="text-white/60">IR Grid Active</span>
                     <span className="text-emerald-400">100%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                     <div className="w-full h-full bg-emerald-500" />
                  </div>
                  <div className="flex justify-between text-xs font-bold">
                     <span className="text-white/60">Vision AI Processing</span>
                     <span className="text-emerald-400">92%</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                     <div className="w-full h-full bg-emerald-500" style={{width: '92%'}} />
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="max-w-2xl mx-auto space-y-12">
          <div className="text-center">
            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">System Feedback</h3>
            <p className="text-sm text-gray-400 font-bold mt-2">Submit technical reports to the Admin Council</p>
          </div>
          
          <div className="bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Name</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-800"
                    placeholder="Manager ID / Name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Subject</label>
                  <input 
                    type="text" 
                    required 
                    className="w-full px-6 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-800"
                    placeholder="e.g. Protocol Update"
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Detailed Report</label>
                <textarea 
                  required 
                  rows="4"
                  className="w-full px-6 py-4 bg-gray-50 border-none rounded-[2rem] focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-gray-800 resize-none"
                  placeholder="Describe your request..."
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-[#022c22] hover:bg-emerald-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all shadow-xl shadow-emerald-950/20"
              >
                {loading ? <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><Send size={18} className="text-emerald-400" /> Send Transmission</>}
              </button>
            </form>
          </div>
        </section>

        <footer className="text-center pb-12">
           <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-300">
             Vigilance Protocols Active // © 2026 Smart Farm Grid
           </p>
        </footer>
      </div>
    </Layout>
  );
};

export default AboutPage;
