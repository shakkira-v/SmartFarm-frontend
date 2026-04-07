import React from "react";
import Layout from "../components/Layout";
import { 
  Server, 
  Database, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  Globe, 
  Share2,
  Code2,
  Lock,
  Workflow
} from "lucide-react";

const TechCard = ({ icon: Icon, title, desc, tech }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
      <Icon size={80} className="text-emerald-600" />
    </div>
    <div className="relative z-10">
      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">{desc}</p>
      <div className="flex flex-wrap gap-2">
        {tech.map((t, i) => (
          <span key={i} className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
            {t}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const TechnologyPage = () => {
  const stack = [
    {
      icon: Code2,
      title: "React Frontend",
      desc: "Modern reactive interface built with Vite for sub-second hot-reloads and optimized production bundles.",
      tech: ["React 19", "Vite 7", "Tailwind CSS", "Lucide Icons"]
    },
    {
      icon: Server,
      title: "Node.js Backend",
      desc: "Robust REST API and WebSocket server handling high-concurrency security events and simulation logic.",
      tech: ["Node.js", "Express", "REST API", "MVC Pattern"]
    },
    {
      icon: Zap,
      title: "Real-time Engine",
      desc: "Low-latency bidirectional communication for instant intrusion alerts and dashboard synchronization.",
      tech: ["Socket.io", "WebSockets", "Event-Driven", "Pub/Sub"]
    },
    {
      icon: Database,
      title: "Data Persistence",
      desc: "Scalable NoSQL storage designed for rapid insert operations and complex sensor data relationships.",
      tech: ["MongoDB", "Mongoose", "Indexing", "Aggregations"]
    },
    {
      icon: Lock,
      title: "Security & Auth",
      desc: "Enterprise-grade protection using stateless tokens and granular role permissions.",
      tech: ["JWT", "Bcrypt", "RBAC Middleware", "CORS"]
    },
    {
      icon: Workflow,
      title: "Automation & CRON",
      desc: "System-level task scheduling for automated 14-day backups, data reset, and maintenance cycles.",
      tech: ["Node-Cron", "FS Stream", "JSON Export", "PDFKit"]
    }
  ];

  return (
    <Layout 
      title="Technical Architecture" 
      subtitle="Deep dive into the SmartFarm Security grid's engine and infrastructure."
    >
      <div className="space-y-12 pb-20">
        {/* 🌟 System Overview */}
        <div className="bg-[#022c22] p-10 md:p-16 rounded-[3rem] border border-emerald-900/40 shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-10 opacity-10 blur-3xl w-96 h-96 bg-emerald-400 rounded-full -mr-32 -mt-32" />
          
          <div className="relative z-10 flex flex-col lg:flex-row gap-12 items-center">
            <div className="lg:w-1/2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Military Grade Infrastructure</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tighttracking-tight">
                Designed for Reliability. <br /> Built for Nature.
              </h2>
              <p className="text-emerald-100/60 font-medium leading-relaxed pr-8">
                The SmartFarm Security system is an event-driven architecture that bridges the gap between IoT sensor hardware and human-friendly visualization. Our backend processes thousands of micro-signals, filters false positives using algorithmic thresholds, and delivers sub-200ms notifications via WebSockets.
              </p>
              <div className="flex gap-4 pt-4">
                <div className="p-4 bg-emerald-900/40 rounded-3xl border border-emerald-800/30">
                  <p className="text-2xl font-black text-white">200ms</p>
                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Avg. Latency</p>
                </div>
                <div className="p-4 bg-emerald-900/40 rounded-3xl border border-emerald-800/30">
                  <p className="text-2xl font-black text-white">99.9%</p>
                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Uptime Grid</p>
                </div>
                <div className="p-4 bg-emerald-900/40 rounded-3xl border border-emerald-800/30">
                  <p className="text-2xl font-black text-white">AES</p>
                  <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Encryption</p>
                </div>
              </div>
            </div>
            
            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
               {[
                 { icon: Globe, label: "Cloud Scalable" },
                 { icon: Share2, label: "API Integrated" },
                 { icon: Cpu, label: "Edge Optimized" },
                 { icon: Zap, label: "Real-time Ready" }
               ].map((item, i) => (
                 <div key={i} className="bg-emerald-900/20 border border-emerald-800/30 p-8 rounded-[2rem] flex flex-col items-center gap-4 group-hover:bg-emerald-900/40 transition-all">
                    <item.icon size={32} className="text-emerald-500" />
                    <span className="text-xs font-black text-white uppercase tracking-widest">{item.label}</span>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* 🛠️ Tech Stack Grid */}
        <div>
          <h3 className="text-2xl font-black text-slate-900 mb-8 px-4 flex items-center gap-3">
             <Workflow className="text-emerald-600" /> The Full Stack Reveal
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stack.map((item, idx) => (
              <TechCard key={idx} {...item} />
            ))}
          </div>
        </div>

        {/* 📜 Developer Note */}
        <div className="p-8 bg-white rounded-[2rem] border border-slate-100 text-center">
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">
               Developed for the Next-Gen Digital Farming Revolution
            </p>
        </div>
      </div>
    </Layout>
  );
};

export default TechnologyPage;
