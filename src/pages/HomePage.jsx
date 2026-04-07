import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Cpu, 
  Map, 
  BarChart3, 
  Users, 
  Lock, 
  ArrowRight,
  Globe,
  Zap,
  Leaf
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

const HomePage = () => {
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      url: "/lush_farm_background_v2_1772180014783.png",
      title: "Sustainable Farm Protection",
      desc: "Harmony between nature and technology, providing unmatched security for your land."
    },
    {
      url: "/forest_perimeter_view_1772180030673.png",
      title: "Forest Edge Surveillance",
      desc: "Advanced perimeter detection at the interface of wilderness and agriculture."
    },
    {
      url: "/aerial_plantation_landscape_1772180047295.png",
      title: "Precision Aerial Mapping",
      desc: "Visualize your entire estate with crystal-clear satellite and sensor integration."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const features = [
    {
      icon: <Zap className="text-amber-500" size={24} />,
      title: "Real-time Alerts",
      desc: "Instant notifications delivered to your device the second an intrusion is detected."
    },
    {
      icon: <Map className="text-emerald-600" size={24} />,
      title: "Zone Management",
      desc: "Divide your farm into virtual security zones with unique sensitivity settings."
    },
    {
      icon: <Cpu className="text-teal-600" size={24} />,
      title: "Sensor Network",
      desc: "Seamlessly integrate vibration, motion, and acoustic sensors into one dashboard."
    },
    {
      icon: <BarChart3 className="text-green-700" size={24} />,
      title: "Deep Analytics",
      desc: "View weekly trends and animal migration patterns with advanced data visualization."
    },
    {
      icon: <Users className="text-indigo-600" size={24} />,
      title: "Team RBAC",
      desc: "Grant specific permissions to managers and workers with Role-Based Access Control."
    },
    {
      icon: <Lock className="text-emerald-800" size={24} />,
      title: "Secure Backups",
      desc: "All security logs are encrypted and backed up automatically every 14 days."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-500/30 font-['Inter']">
      {/* 🚀 NAVBAR */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex items-center justify-between backdrop-blur-xl border-b border-white/20 bg-white/40 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-800 to-green-950 rounded-xl flex items-center justify-center font-black text-xl text-emerald-400 shadow-lg shadow-emerald-900/40 border border-emerald-700/30">
            S
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">
            SmartFarm <span className="text-emerald-600">Secure</span>
          </span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-600">
          <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
          <Link to="/technology" className="hover:text-emerald-600 transition-colors">Technology</Link>
          <Link to="/about" className="hover:text-emerald-600 transition-colors">Support</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link to="/dashboard" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-emerald-600/30">
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">Login</Link>
              
            </>
          )}
        </div>
      </nav>

      {/* 🌪️ HERO SECTION (Nature Carousel Background) */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Carousel Background */}
        {slides.map((slide, idx) => (
          <div 
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/10 z-10" />
            <div className="absolute inset-0 bg-emerald-950/20 z-10" /> {/* Slight natural tint */}
            <img src={slide.url} alt={slide.title} className="w-full h-full object-cover scale-105" />
          </div>
        ))}

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 mb-6 shadow-xl">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-white shadow-sm">Eco-Smart Security</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 text-white drop-shadow-2xl">
            Technology Rooted <br /> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-100 to-green-300">In Nature.</span>
          </h1>
          <p className="text-lg md:text-xl text-white font-medium mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-lg">
            Protecting your livestock and crops with invisible shields. The industry's first autonomous system built for the peaceful coexistence of farm and forest.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/login" className="group w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-lg font-black transition-all shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-2">
              Launch Security Center <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/technology" className="w-full sm:w-auto px-8 py-4 bg-white/20 hover:bg-white/30 border border-white/30 text-white rounded-2xl text-lg font-bold transition-all backdrop-blur-md flex items-center justify-center">
              Technical Specs
            </Link>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-10 flex gap-2 z-30">
          {slides.map((_, idx) => (
            <button 
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${idx === currentSlide ? 'w-12 bg-white' : 'w-4 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>
      </section>

      {/* 📦 FEATURES GRID section */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto relative">
        <div className="text-center mb-16">
          <h2 className="text-emerald-600 font-black uppercase tracking-[0.2em] text-xs mb-3">Modern Capabilities</h2>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">Designed for Growth. <br className="md:hidden" /> Secured by Science.</h3>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Our system adapts to your terrain, whether it's dense forest perimeters or open rolling pastures.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div 
              key={idx}
              className="group p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-500 hover:translate-y-[-8px] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-500" />
              <div className="relative z-10">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                  {React.cloneElement(feature.icon, { className: "group-hover:text-white transition-colors" })}
                </div>
                <h4 className="text-xl font-black text-slate-800 mb-3 group-hover:text-emerald-700 transition-colors">{feature.title}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🌿 APP STATUS / STATS (Glass Card) */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="relative overflow-hidden bg-gradient-to-br from-emerald-600 to-green-700 rounded-[3rem] p-10 md:p-20 text-center shadow-2xl shadow-emerald-200">
          <div className="absolute top-0 right-0 p-10 opacity-20 blur-3xl w-80 h-80 bg-white rounded-full -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 p-10 opacity-10 blur-3xl w-80 h-80 bg-yellow-200 rounded-full -ml-20 -mb-20" />
          
          <div className="relative z-10 max-w-3xl mx-auto space-y-8">
            <div className="inline-flex p-3 bg-white/20 rounded-2xl backdrop-blur-md mb-4 text-white">
               <Leaf size={32} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              A Greener Approach <br /> to High-Tech Security.
            </h2>
            <p className="text-lg text-emerald-50 font-medium">
              Join 450+ eco-conscious farm owners. Our low-power sensor network is designed to be non-intrusive to local wildlife while maintaining 100% vigilance.
            </p>
            <div className="flex flex-wrap justify-center gap-10 pt-4">
              <div className="text-center">
                <div className="text-5xl font-black text-white">100%</div>
                <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-[0.3em] mt-2">Renewable Powered</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-black text-white">24/7</div>
                <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-[0.3em] mt-2">Forest Guard</div>
              </div>
              <div className="text-center border-l border-white/20 pl-10 hidden sm:block">
                <div className="text-5xl font-black text-white">Zero</div>
                <div className="text-[10px] font-bold text-emerald-200 uppercase tracking-[0.3em] mt-2">False Positives</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🏮 FOOTER */}
      <footer id="contact" className="bg-slate-900 border-t border-slate-800 py-16 px-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 blur-3xl rounded-full -mr-48 -mb-48" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 relative z-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center font-bold text-lg text-white">S</div>
              <span className="text-lg font-black text-white tracking-tight">SmartFarm</span>
            </div>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">
              Sustainable agrotechnology for the next generation of farmers and land owners.
            </p>
          </div>
          
          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Navigation</h5>
            <ul className="text-xs font-bold text-slate-400 space-y-2">
              <li><Link to="/sensors" className="hover:text-white transition-colors cursor-pointer">Sensors</Link></li>
              <li><Link to="/zones" className="hover:text-white transition-colors cursor-pointer">Zone Management</Link></li>
              <li><Link to="/alerts" className="hover:text-white transition-colors cursor-pointer">Security Alerts</Link></li>
              <li><Link to="/dashboard" className="hover:text-white transition-colors cursor-pointer">Dashboard</Link></li>
            </ul>
          </div>

          <div className="space-y-4">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Resources</h5>
            <ul className="text-xs font-bold text-slate-400 space-y-2">
              <li><Link to="/technology" className="hover:text-white transition-colors cursor-pointer">Our Technology</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors cursor-pointer">About Us</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors cursor-pointer">Apply for Entry</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors cursor-pointer">Personnel Login</Link></li>
            </ul>
          </div>

          <div className="space-y-4 text-xs font-medium text-slate-400">
            <h5 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Contact</h5>
            <p className="flex items-center gap-2 italic">Monitoring the grid from Kerala, India.</p>
            <p className="hover:text-white transition-colors cursor-pointer">support@smartfarm-security.com</p>
            <div className="flex gap-4 pt-2">
               <Link to="/technology" title="Global Standards">
                 <Globe size={18} className="hover:text-emerald-500 cursor-pointer transition-colors" />
               </Link>
               <Link to="/about" title="Eco-Friendly Commitment">
                 <Leaf size={18} className="hover:text-emerald-500 cursor-pointer transition-colors" />
               </Link>
               <Link to="/about" title="Secure Grid Access">
                 <Lock size={18} className="hover:text-emerald-500 cursor-pointer transition-colors" />
               </Link>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 relative z-10">
          © 2026 SmartFarm Agri-Security Systems.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
