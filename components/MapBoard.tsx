import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Incident, IssueType } from '../types';
import { AlertTriangle, Trash2, Droplets, Lightbulb, Ban, Construction, Zap } from 'lucide-react';
import { createRoot } from 'react-dom/client';

// Fix for default Leaflet marker icons not loading in some bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapBoardProps {
  incidents: Incident[];
  center: [number, number];
  onMarkerClick: (id: string) => void;
}

// Helper to render React icons to Leaflet DivIcon HTML string
const getIconHtml = (type: IssueType, severity: number) => {
  const container = document.createElement('div');
  const root = createRoot(container);
  
  const color = severity >= 8 ? 'text-red-500' : severity >= 5 ? 'text-amber-500' : 'text-emerald-500';
  const glow = severity >= 8 ? 'animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : '';

  let IconComponent = AlertTriangle;
  switch (type) {
    case IssueType.SANITATION: IconComponent = Trash2; break;
    case IssueType.DRAINAGE: IconComponent = Droplets; break;
    case IssueType.LIGHTING: IconComponent = Lightbulb; break;
    case IssueType.POTHOLE: IconComponent = Construction; break;
    case IssueType.SIGNAGE: IconComponent = Ban; break;
    case IssueType.VEGETATION: IconComponent = Construction; break; // Fallback
    case IssueType.CLEAN: IconComponent = Zap; break;
  }

  root.render(
    <div className={`p-2 bg-zinc-900/90 rounded-full border border-zinc-700 ${glow}`}>
      <IconComponent className={`w-5 h-5 ${color}`} />
    </div>
  );
  
  // Note: In a real app we'd need to wait for render, but for synchronous string generation needed by Leaflet 
  // immediately, we use a simpler approach for the return value below.
  // We'll return a raw string template for simplicity and performance.
  
  const colorClass = severity >= 8 ? '#ef4444' : severity >= 5 ? '#f59e0b' : '#10b981';
  
  return `
    <div style="
      background-color: rgba(9, 9, 11, 0.85);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(63, 63, 70, 0.5);
      border-radius: 9999px;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 ${severity * 2}px ${colorClass};
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${colorClass}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>
    </div>
  `;
};

const MapController = ({ center }: { center: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 14, { duration: 2 });
  }, [center, map]);
  return null;
};

export const MapBoard: React.FC<MapBoardProps> = ({ incidents, center, onMarkerClick }) => {
  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%', background: '#09090b' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="dark-map-tiles"
        />
        <MapController center={center} />
        
        {incidents.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.lat, incident.lng]}
            eventHandlers={{
              click: () => onMarkerClick(incident.id),
            }}
            icon={L.divIcon({
              className: 'custom-marker',
              html: getIconHtml(incident.type, incident.severity),
              iconSize: [36, 36],
              iconAnchor: [18, 18],
            })}
          >
            <Popup className="glass-popup">
              <div className="text-zinc-900 font-sans p-1">
                <h3 className="font-bold text-sm mb-1">{incident.type}</h3>
                <p className="text-xs">{incident.title}</p>
                <div className="mt-2 text-xs font-mono text-zinc-600">
                  SEVERITY: {incident.severity}/10
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Overlay Gradient for Cyberpunk feel */}
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-zinc-950 to-transparent pointer-events-none z-[400]" />
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-zinc-950 to-transparent pointer-events-none z-[400]" />
    </div>
  );
};
