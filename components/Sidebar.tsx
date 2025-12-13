import React from 'react';
import { Incident, IssueType } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { AlertCircle, CheckCircle2, Clock, MapPin } from 'lucide-react';

interface SidebarProps {
  incidents: Incident[];
  onSelectIncident: (incident: Incident) => void;
}

const COLORS = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6'];

export const Sidebar: React.FC<SidebarProps> = ({ incidents, onSelectIncident }) => {
  const criticalCount = incidents.filter(i => i.severity >= 8).length;
  const resolvedCount = incidents.filter(i => i.status === 'RESOLVED').length;
  
  const typeData = [
    { name: 'Critical', value: criticalCount },
    { name: 'Warning', value: incidents.filter(i => i.severity >= 5 && i.severity < 8).length },
    { name: 'Routine', value: incidents.filter(i => i.severity < 5).length },
  ];

  return (
    <div className="w-full h-full flex flex-col p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
            URBANMIND
          </h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest">Autonomous Sensing Unit</p>
        </div>
        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <div className="flex items-center space-x-2 text-zinc-400 mb-1">
            <AlertCircle size={14} />
            <span className="text-xs uppercase">Critical</span>
          </div>
          <span className="text-2xl font-mono font-bold text-rose-500">{criticalCount}</span>
        </div>
        <div className="bg-zinc-900/50 border border-zinc-800 p-3 rounded-lg flex flex-col justify-between hover:border-zinc-700 transition-colors">
          <div className="flex items-center space-x-2 text-zinc-400 mb-1">
            <CheckCircle2 size={14} />
            <span className="text-xs uppercase">Active</span>
          </div>
          <span className="text-2xl font-mono font-bold text-emerald-500">{incidents.length - resolvedCount}</span>
        </div>
      </div>

      {/* Mini Chart */}
      <div className="h-40 w-full bg-zinc-900/30 border border-zinc-800 rounded-lg p-2">
        <p className="text-xs text-zinc-500 mb-2 font-mono uppercase">Severity Distribution</p>
        <ResponsiveContainer width="100%" height="80%">
          <PieChart>
            <Pie
              data={typeData}
              innerRadius={25}
              outerRadius={40}
              paddingAngle={5}
              dataKey="value"
            >
              {typeData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '4px' }}
              itemStyle={{ color: '#d4d4d8', fontSize: '12px', fontFamily: 'monospace' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Incident List */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="text-xs text-zinc-500 font-mono uppercase mb-3 flex items-center">
          <Clock size={12} className="mr-1" />
          Recent Ingestions
        </h3>
        <div className="flex-1 overflow-y-auto pr-2 space-y-3">
          {incidents.map((incident) => (
            <div 
              key={incident.id}
              onClick={() => onSelectIncident(incident)}
              className="group bg-zinc-900/40 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900/80 p-3 rounded-lg cursor-pointer transition-all duration-200"
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                  incident.severity >= 8 ? 'border-rose-900 bg-rose-900/20 text-rose-400' :
                  incident.severity >= 5 ? 'border-amber-900 bg-amber-900/20 text-amber-400' :
                  'border-emerald-900 bg-emerald-900/20 text-emerald-400'
                } font-mono`}>
                  {incident.type}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono">{incident.timestamp.split('T')[1].substring(0,5)}</span>
              </div>
              <h4 className="text-sm font-medium text-zinc-200 group-hover:text-emerald-400 truncate transition-colors">
                {incident.title}
              </h4>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                {incident.description}
              </p>
              <div className="flex items-center mt-2 text-zinc-600 text-[10px]">
                <MapPin size={10} className="mr-1" />
                <span>Lat: {incident.lat.toFixed(4)}, Lng: {incident.lng.toFixed(4)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
