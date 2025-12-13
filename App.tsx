import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { MapBoard } from './components/MapBoard';
import { ReportModal } from './components/ReportModal';
import { Incident, IssueType } from './types';
import { Plus, Eye, Radio } from 'lucide-react';

// Seed data for the Bhubaneswar context
const INITIAL_INCIDENTS: Incident[] = [
  {
    id: '1',
    type: IssueType.POTHOLE,
    title: 'Severe Asphalt Cracking',
    description: 'Deep pothole exposing sub-base layer, likely caused by recent monsoon drainage failure.',
    severity: 7,
    lat: 20.2961,
    lng: 85.8245,
    timestamp: new Date().toISOString(),
    status: 'PENDING',
    suggestedAction: 'Fill with cold mix asphalt immediately.'
  },
  {
    id: '2',
    type: IssueType.SANITATION,
    title: 'Overflowing Waste Bin',
    description: 'Public waste bin exceeding capacity, organic waste spilling onto pedestrian pathway.',
    severity: 5,
    lat: 20.2995,
    lng: 85.8300,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    status: 'DISPATCHED',
    suggestedAction: 'Dispatch waste collection vehicle.'
  },
  {
    id: '3',
    type: IssueType.LIGHTING,
    title: 'Street Light Malfunction',
    description: 'Pole #452 fixture hanging precariously, light non-functional.',
    severity: 8,
    lat: 20.2920,
    lng: 85.8190,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    status: 'PENDING',
    suggestedAction: 'Secure fixture and replace bulb.'
  },
  {
    id: '4',
    type: IssueType.DRAINAGE,
    title: 'Storm Drain Blockage',
    description: 'Plastic debris completely occluding storm drain grate.',
    severity: 9,
    lat: 20.2880,
    lng: 85.8220,
    timestamp: new Date(Date.now() - 10000000).toISOString(),
    status: 'RESOLVED',
    suggestedAction: 'Manual removal of debris required.'
  }
];

const BHUBANESWAR_CENTER: [number, number] = [20.2961, 85.8245];

export default function App() {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>(BHUBANESWAR_CENTER);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);

  // Request location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        // Only update if within reasonable range of Bhubaneswar to keep demo context
        // In a real app, we'd jump to user.
      });
    }
  }, []);

  const handleIncidentSelect = (incident: Incident) => {
    setMapCenter([incident.lat, incident.lng]);
    setSelectedIncidentId(incident.id);
  };

  const handleReportCreated = (newIncident: Incident) => {
    setIncidents(prev => [newIncident, ...prev]);
    setMapCenter([newIncident.lat, newIncident.lng]);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-zinc-950 font-sans text-zinc-100">
      
      {/* Left Sidebar */}
      <div className="w-80 h-full border-r border-zinc-800 bg-zinc-950/95 backdrop-blur-md z-10 flex-shrink-0 shadow-xl">
        <Sidebar incidents={incidents} onSelectIncident={handleIncidentSelect} />
      </div>

      {/* Main Map Area */}
      <div className="flex-1 relative">
        <MapBoard 
          incidents={incidents} 
          center={mapCenter} 
          onMarkerClick={(id) => setSelectedIncidentId(id)}
        />

        {/* Floating Action Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-8 right-8 z-[500] bg-emerald-600 hover:bg-emerald-500 text-white rounded-full p-4 shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all hover:scale-105 group"
        >
          <Plus size={32} />
          <span className="absolute right-full mr-4 bg-zinc-900 text-zinc-100 px-2 py-1 rounded text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            REPORT ISSUE
          </span>
        </button>

        {/* Live Status Indicator */}
        <div className="absolute top-4 right-4 z-[500] flex items-center space-x-2 bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-full px-3 py-1">
          <div className="relative">
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            <div className="absolute top-0 left-0 w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
          </div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400">System Online</span>
        </div>
      </div>

      {/* Incident Details Drawer (Right side - Optional, simulated by logic here) */}
      {/* In a fuller app, this would be a slide-over. For now, Sidebar handles selection navigation. */}

      {/* Upload Modal */}
      {isModalOpen && (
        <ReportModal 
          onClose={() => setIsModalOpen(false)} 
          onReportCreated={handleReportCreated}
          currentLocation={mapCenter}
        />
      )}
    </div>
  );
}
