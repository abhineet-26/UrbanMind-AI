import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, Camera, Zap, Cpu, AlertTriangle, MapPin, Crosshair } from 'lucide-react';
import { analyzeImage, fileToBase64 } from '../services/aiService';
import { Incident, IssueType } from '../types';

interface ReportModalProps {
  onClose: () => void;
  onReportCreated: (incident: Incident) => void;
  currentLocation: [number, number];
}

const STEPS = [
  "Initializing Vision System...",
  "Uploading Bitmap Data...",
  "Gemini 2.5 Flash Inference...",
  "Detecting Anomalies...",
  "Measuring Severity Vectors...",
  "Generating Municipal Report..."
];

export const ReportModal: React.FC<ReportModalProps> = ({ onClose, onReportCreated, currentLocation }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // Location State
  const [coordinates, setCoordinates] = useState<{lat: number, lng: number}>({
    lat: currentLocation[0],
    lng: currentLocation[1]
  });
  const [isLocating, setIsLocating] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const base64 = await fileToBase64(selectedFile);
      setPreview(`data:image/jpeg;base64,${base64}`);
    }
  };

  const handleGetLocation = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setIsLocating(false);
          // Clear specific location errors if any
          if (error === "Could not retrieve location." || error === "Geolocation not supported.") {
            setError(null);
          }
        },
        (err) => {
          console.error(err);
          setError("Could not retrieve location.");
          setIsLocating(false);
        }
      );
    } else {
      setError("Geolocation not supported.");
      setIsLocating(false);
    }
  };

  const runAnalysis = async () => {
    if (!file) return;

    setIsAnalyzing(true);
    setError(null);

    // Simulate step progress for visual effect while waiting
    const stepInterval = setInterval(() => {
      setLoadingStep(prev => (prev < STEPS.length - 1 ? prev + 1 : prev));
    }, 800);

    try {
      const base64 = await fileToBase64(file);
      const analysis = await analyzeImage(base64);

      clearInterval(stepInterval);
      setLoadingStep(STEPS.length - 1);

      // Create new incident object
      const newIncident: Incident = {
        id: crypto.randomUUID(),
        type: analysis.issue_type,
        title: analysis.title,
        description: analysis.description,
        severity: analysis.severity,
        lat: coordinates.lat, // Use verified coordinates
        lng: coordinates.lng, // Use verified coordinates
        timestamp: new Date().toISOString(),
        status: 'ANALYZED',
        suggestedAction: analysis.suggested_action,
        imageUrl: preview || undefined
      };

      // Small delay to show completion
      setTimeout(() => {
        onReportCreated(newIncident);
        onClose();
      }, 500);

    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please try again.");
      clearInterval(stepInterval);
      setIsAnalyzing(false);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      fileToBase64(droppedFile).then(base64 => {
        setPreview(`data:image/jpeg;base64,${base64}`);
      });
    }
  }, []);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-zinc-950 border border-zinc-800 shadow-2xl rounded-xl overflow-hidden flex flex-col relative animate-in fade-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
          <div className="flex items-center gap-2">
            <Camera className="text-emerald-500" size={18} />
            <h2 className="font-mono font-bold text-zinc-100">NEW_INCIDENT_REPORT</h2>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isAnalyzing ? (
            <div 
              onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
              onDrop={handleDrop}
              className="flex flex-col space-y-4"
            >
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative group border-2 border-dashed rounded-lg h-48 flex flex-col items-center justify-center cursor-pointer transition-all
                  ${preview ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-zinc-700 hover:border-emerald-500 hover:bg-zinc-900'}
                `}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-cover rounded-md opacity-80" />
                ) : (
                  <>
                    <div className="p-4 bg-zinc-900 rounded-full mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="text-zinc-400 group-hover:text-emerald-400" />
                    </div>
                    <p className="text-sm text-zinc-400 font-medium">Click or Drag Image Here</p>
                    <p className="text-xs text-zinc-600 mt-1">Supports JPEG, PNG</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>

              {/* Location Selector */}
              <div className="bg-zinc-900/50 rounded-lg p-3 border border-zinc-800 flex items-center justify-between">
                <div className="flex items-center text-zinc-400 overflow-hidden">
                    <MapPin size={16} className="mr-3 text-emerald-500 flex-shrink-0" />
                    <div className="flex flex-col min-w-0">
                        <span className="text-[10px] uppercase text-zinc-500 font-mono tracking-wider">Geotag Data</span>
                        <span className="text-xs font-mono text-zinc-300 truncate">
                          {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
                        </span>
                    </div>
                </div>
                <button 
                    onClick={handleGetLocation}
                    disabled={isLocating}
                    className="ml-2 text-[10px] font-mono bg-zinc-800 hover:bg-zinc-700 hover:text-emerald-400 text-zinc-300 border border-zinc-700 px-3 py-2 rounded flex items-center transition-all disabled:opacity-50 whitespace-nowrap"
                >
                    <Crosshair size={12} className={`mr-2 ${isLocating ? 'animate-spin' : ''}`} />
                    {isLocating ? 'FIXING...' : 'USE GPS'}
                </button>
              </div>

              {error && (
                <div className="bg-rose-950/30 border border-rose-900/50 text-rose-400 p-3 rounded text-xs flex items-center">
                  <AlertTriangle size={14} className="mr-2" />
                  {error}
                </div>
              )}

              <button
                onClick={runAnalysis}
                disabled={!file}
                className={`w-full py-3 rounded-lg font-mono font-bold text-sm uppercase tracking-wider flex items-center justify-center transition-all
                  ${file 
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                    : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}
                `}
              >
                <Zap className="mr-2" size={16} />
                Analyze with Gemini
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-80 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-xl opacity-20 animate-pulse"></div>
                <Cpu size={64} className="text-emerald-500 animate-bounce relative z-10" />
              </div>
              
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs font-mono text-emerald-400">
                  <span>PROCESSING_UNIT</span>
                  <span>{Math.round(((loadingStep + 1) / STEPS.length) * 100)}%</span>
                </div>
                <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 transition-all duration-500 ease-out"
                    style={{ width: `${((loadingStep + 1) / STEPS.length) * 100}%` }}
                  />
                </div>
                <p className="text-center text-zinc-400 font-mono text-xs animate-pulse mt-2">
                  {`> ${STEPS[loadingStep]}`}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};