import { useState, useRef, useEffect, useCallback } from "react";
import { Eye, Video, Scan, AlertTriangle, Play, Pause, Zap, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../api/api";

// Sample motion-heavy videos for night/thermal simulation
const videoSources = {
  elephant: "https://assets.mixkit.co/videos/preview/mixkit-elephants-walking-in-the-grass-1172-large.mp4",
  boar: "https://v.ftcdn.net/05/24/85/38/700_F_524853828_oYlXJ9zN8GjWunT9i8JjZ8Y1iLzXh5zQ_ST.mp4",
  deer: "https://assets.mixkit.co/videos/preview/mixkit-deer-in-the-wild-at-night-42668-large.mp4",
  dog: "https://assets.mixkit.co/videos/preview/mixkit-stray-dog-walking-on-a-pavement-42665-large.mp4",
  cow: "https://assets.mixkit.co/videos/preview/mixkit-cows-grazing-in-the-field-1176-large.mp4",
  monkey: "https://assets.mixkit.co/videos/preview/mixkit-monkey-climbing-a-tree-42667-large.mp4",
  bear: "https://assets.mixkit.co/videos/preview/mixkit-brown-bear-walking-in-the-forest-42664-large.mp4",
  leopard: "https://assets.mixkit.co/videos/preview/mixkit-leopard-walking-in-the-wild-42663-large.mp4",
  rabbit: "https://assets.mixkit.co/videos/preview/mixkit-rabbit-eating-grass-in-the-field-42662-large.mp4"
};

const VisionSimulation = ({ zones, onRefresh }) => {
  const [selectedZone, setSelectedZone] = useState("");
  const [animal, setAnimal] = useState("elephant");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAutoScanning, setIsAutoScanning] = useState(false);
  const [crosshairPos, setCrosshairPos] = useState({ x: 50, y: 50 });
  const videoRef = useRef(null);

  const handleTogglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const triggerVisionAlert = useCallback(async () => {
    if (!selectedZone) {
      toast.error("Please select a target zone first");
      return;
    }

    setIsAnalyzing(true);
    
    // Artificial delay to simulate AI processing
    setTimeout(async () => {
      try {
        await api.post("/simulate/vision", {
          zoneId: selectedZone,
          animalType: animal,
          videoUrl: videoSources[animal],
          severity: "high"
        });
        
        toast.success(`AI Vision: ${animal} detected and logged via Infrared Feed!`, {
          icon: '🌃',
          style: { borderRadius: '10px', background: '#022c22', color: '#fff' }
        });
        
        onRefresh();
      } catch (err) {
        console.error("Vision trigger error:", err);
        toast.error("Failed to trigger vision alert");
      } finally {
        setIsAnalyzing(false);
      }
    }, 1500);
  }, [selectedZone, animal, onRefresh]);

  // 🤖 Automatic Scanning Logic: Periodically triggers alerts
  useEffect(() => {
    let timeout;
    if (isAutoScanning && isPlaying && !isAnalyzing && selectedZone) {
      const nextScanDelay = 10000 + Math.random() * 8000; // Trigger every 10-18 seconds
      timeout = setTimeout(() => {
        triggerVisionAlert();
      }, nextScanDelay);
    }
    return () => clearTimeout(timeout);
  }, [isAutoScanning, isPlaying, isAnalyzing, selectedZone, animal, triggerVisionAlert]);

  // Update crosshair position randomly when playing to simulate tracking
  useEffect(() => {
    let interval;
    if (isPlaying && selectedZone) {
      interval = setInterval(() => {
        setCrosshairPos({
          x: 25 + Math.random() * 50, // Keep in central area
          y: 25 + Math.random() * 50
        });
      }, 2500);
    } else if (!selectedZone) {
      setCrosshairPos({ x: 50, y: 50 }); // Reset to center if no zone
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedZone]);

  return (
    <div className="bg-[#022c22] rounded-[2rem] border border-emerald-900/40 p-5 shadow-2xl overflow-hidden relative group">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Video Section: Compact and Focused */}
        <div className="lg:w-7/12 relative rounded-2xl overflow-hidden border border-emerald-800/50 bg-black aspect-[16/10] cursor-crosshair">
          <video 
            ref={videoRef}
            className="w-full h-full object-cover grayscale brightness-75 contrast-125 transition-all duration-500"
            style={{ 
              filter: isAnalyzing 
                ? 'grayscale(1) brightness(0.8) contrast(1.6) sepia(1) hue-rotate(0deg) saturate(5)' 
                : 'grayscale(1) brightness(0.6) contrast(1.4) sepia(1) hue-rotate(85deg) saturate(2)' 
            }}
            loop
            muted
            src={videoSources[animal]}
            key={animal} 
          />
          
          {/* Night Vision Scanning Overlay */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle,transparent_40%,rgba(0,40,0,0.4)_100%)]" />
          
          {/* Dynamic Tracking Crosshair */}
          {isPlaying && (
            <div 
              className="absolute pointer-events-none transition-all duration-[2000ms] ease-in-out"
              style={{ 
                left: `${crosshairPos.x}%`, 
                top: `${crosshairPos.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="w-1 h-1 bg-red-500 rounded-full shadow-[0_0_10px_red]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border border-emerald-400/30 rounded-full animate-ping" />
              <div className="absolute top-4 left-4 whitespace-nowrap hidden sm:block">
                <p className="text-[7px] font-mono text-emerald-400 uppercase">OBJ: {animal}</p>
                <p className="text-[7px] font-mono text-emerald-400 uppercase">STR: 88%</p>
              </div>
            </div>
          )}

          {/* Status Labels */}
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-500/20 backdrop-blur-md rounded-full border border-emerald-500/30 text-[9px] text-emerald-400 font-bold uppercase tracking-tighter">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              Live Cam_0{selectedZone ? selectedZone.slice(-1) : 'X'}
            </div>
          </div>

          {/* Center Play Button Overlay */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <button 
                onClick={handleTogglePlay}
                className="w-12 h-12 bg-emerald-500/20 hover:bg-emerald-500/40 backdrop-blur-xl rounded-full flex items-center justify-center text-white border border-white/20 transition-all active:scale-90"
              >
                <Play size={24} fill="currentColor" />
              </button>
            </div>
          )}

          {/* AI Bounding Box */}
          <div 
            className={`absolute border border-red-500 transition-all duration-300 pointer-events-none ${isAnalyzing ? 'opacity-100 scale-100' : 'opacity-0 scale-150'}`}
            style={{ 
              left: `${crosshairPos.x}%`, 
              top: `${crosshairPos.y}%`,
              width: '80px',
              height: '80px',
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 15px rgba(255,0,0,0.3)'
            }}
          >
            <div className="absolute -top-5 left-0 bg-red-600 text-white text-[8px] px-1 font-black uppercase whitespace-nowrap">
              ALERT: {animal}
            </div>
          </div>
        </div>

        {/* Info & Controls Section: Side-by-side */}
        <div className="lg:w-5/12 flex flex-col justify-between py-2">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Eye className="text-emerald-400" size={20} />
                <h2 className="text-sm font-black text-white uppercase tracking-wider">Vision Intelligence</h2>
              </div>
              <button 
                onClick={() => setIsAutoScanning(!isAutoScanning)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                  isAutoScanning 
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                  : "bg-white/5 border-white/10 text-white/40"
                }`}
              >
                <span className="text-[9px] font-black uppercase tracking-widest">{isAutoScanning ? 'Auto Scan ON' : 'Auto Scan OFF'}</span>
                {isAutoScanning ? <ToggleRight size={20} className="text-emerald-400" /> : <ToggleLeft size={20} />}
              </button>
            </div>
            
            <p className="text-emerald-100/40 text-[10px] font-medium leading-relaxed mb-6">
              Night monitoring protocol active. IR Sensors and heat signatures integrated for autonomous tracking.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block ml-1">Grid Target</label>
                <select 
                  className="w-full bg-emerald-950/50 border border-emerald-800 text-white text-[11px] rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-bold"
                  value={selectedZone}
                  onChange={(e) => setSelectedZone(e.target.value)}
                >
                  <option value="">Select Zone</option>
                  {zones.map(z => <option key={z._id} value={z._id}>{z.name}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest block ml-1">Signature</label>
                <select 
                  className="w-full bg-emerald-950/50 border border-emerald-800 text-white text-[11px] rounded-xl px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 transition-all font-bold"
                  value={animal}
                  onChange={(e) => setAnimal(e.target.value)}
                >
                  <option value="elephant">Elephant</option>
                  <option value="boar">Wild Boar</option>
                  <option value="deer">Deer</option>
                  <option value="fox">Fox</option>
                  <option value="dog">Stray Dog</option>
                  <option value="cow">Cow / Livestock</option>
                  <option value="monkey">Monkey</option>
                  <option value="bear">Bears</option>
                  <option value="leopard">Leopard</option>
                  <option value="rabbit">Wild Rabbit</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
             <div className="bg-emerald-950/30 p-3 rounded-xl border border-emerald-800/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Scan size={14} className="text-emerald-400" />
                  <span className="text-[10px] font-bold text-emerald-100 uppercase">Detection Lock</span>
                </div>
                <div className={`text-[10px] font-black uppercase ${isPlaying ? 'text-emerald-400' : 'text-white/20'}`}>
                  {isAnalyzing ? (
                    <span className="text-red-500 animate-pulse">Analyzing...</span>
                  ) : isPlaying ? (
                    isAutoScanning ? 'Auto Seeking' : 'Ready'
                  ) : 'Standby'}
                </div>
             </div>

            <div className="flex gap-2">
              <button 
                onClick={handleTogglePlay}
                className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-all active:scale-95"
              >
                {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
              </button>
              <button 
                onClick={triggerVisionAlert}
                disabled={!isPlaying || isAnalyzing || isAutoScanning}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-black text-[11px] uppercase tracking-wider transition-all active:scale-[0.98] ${
                  isAnalyzing 
                  ? "bg-amber-500/20 text-amber-500 border border-amber-500/30" 
                  : isAutoScanning
                  ? "bg-white/5 text-white/20 border border-white/10"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400/20 shadow-lg shadow-emerald-950/40"
                } disabled:opacity-50`}
              >
                {isAutoScanning ? "Auto-Detection On" : isAnalyzing ? "Identifying..." : `Manual Trigger`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionSimulation;
