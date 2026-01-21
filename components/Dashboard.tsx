
import React, { useMemo, useState } from 'react';
import { PentestSession, SessionStatus, ReportType } from '../types';

interface DashboardProps {
  sessions: PentestSession[];
}

// --- ICONS ---
const IconTarget = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconSkull = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" /></svg>;
const IconBriefcase = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;
const IconFlag = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M3 13l4-8h10l4 8M9 21v-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>;
const IconBug = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 17h.01M4.5 20H4a2 2 0 01-2-2V5a2 2 0 012-2h16a2 2 0 012 2v13a2 2 0 01-2 2h-.5" /></svg>;

// --- CHART COMPONENTS ---

const SeverityBarChart = ({ counts }: { counts: { critical: number, high: number, medium: number, low: number } }) => {
    const max = Math.max(counts.critical, counts.high, counts.medium, counts.low, 5); 
    const getHeight = (val: number) => `${(val / max) * 100}%`;

    return (
        <div className="h-40 w-full flex items-end justify-between gap-4 px-4">
            {/* Low */}
            <div className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                <div className="w-full bg-blue-900/10 rounded-t-sm relative h-32 flex items-end backdrop-blur-sm border-b border-blue-500/20">
                    <div className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-sm transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(96,165,250,0.5)]" style={{ height: getHeight(counts.low) }}></div>
                     <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-blue-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-0.5 rounded border border-blue-500/30">{counts.low}</span>
                </div>
                <span className="text-[10px] uppercase text-blue-300 font-bold tracking-widest">Low</span>
            </div>
            {/* Medium */}
             <div className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                <div className="w-full bg-yellow-900/10 rounded-t-sm relative h-32 flex items-end backdrop-blur-sm border-b border-yellow-500/20">
                    <div className="w-full bg-gradient-to-t from-yellow-600 to-yellow-400 rounded-t-sm transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(250,204,21,0.5)]" style={{ height: getHeight(counts.medium) }}></div>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-0.5 rounded border border-yellow-500/30">{counts.medium}</span>
                </div>
                <span className="text-[10px] uppercase text-yellow-300 font-bold tracking-widest">Med</span>
            </div>
            {/* High */}
             <div className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                <div className="w-full bg-orange-900/10 rounded-t-sm relative h-32 flex items-end backdrop-blur-sm border-b border-orange-500/20">
                    <div className="w-full bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-sm transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(251,146,60,0.5)]" style={{ height: getHeight(counts.high) }}></div>
                     <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-orange-300 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-0.5 rounded border border-orange-500/30">{counts.high}</span>
                </div>
                <span className="text-[10px] uppercase text-orange-300 font-bold tracking-widest">High</span>
            </div>
            {/* Critical */}
             <div className="flex flex-col items-center gap-2 w-full group cursor-pointer">
                <div className="w-full bg-red-900/10 rounded-t-sm relative h-32 flex items-end backdrop-blur-sm border-b border-red-500/20">
                    <div className="w-full bg-gradient-to-t from-red-600 to-red-500 rounded-t-sm transition-all duration-500 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.5)]" style={{ height: getHeight(counts.critical) }}></div>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-sm font-bold text-red-400 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-0.5 rounded border border-red-500/30">{counts.critical}</span>
                </div>
                <span className="text-[10px] uppercase text-red-400 font-bold tracking-widest">Crit</span>
            </div>
        </div>
    )
}

const KillChainDonut = ({ phases }: { phases: Record<string, number> }) => {
    const [hoveredPhase, setHoveredPhase] = useState<{ name: string, count: number, color: string, glow: string } | null>(null);

    const actualTotal = Object.values(phases).reduce((a, b) => a + b, 0);
    const total = actualTotal || 1; // Prevent div by zero for visuals
    
    // Simplified distribution for Recon vs Access vs Impact
    const recon = phases['Reconnaissance'] || 0;
    const access = (phases['Initial Access'] || 0) + (phases['Execution'] || 0);
    const post = (phases['Defense Evasion'] || 0) + (phases['Credential Access'] || 0) + (phases['Discovery'] || 0);
    
    const pRecon = (recon / total) * 100;
    const pAccess = (access / total) * 100;
    const pPost = (post / total) * 100;

    // SVG dasharray logic
    const r = 16;
    const c = 2 * Math.PI * r;
    
    const off1 = 0;
    const off2 = -1 * (pRecon / 100) * c;
    const off3 = -1 * ((pRecon + pAccess) / 100) * c;

    return (
        <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90 drop-shadow-xl" viewBox="0 0 36 36">
                {/* Background Ring */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                
                {/* Recon - Blue */}
                {pRecon > 0 && (
                    <path 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="3" 
                        strokeDasharray={`${(pRecon/100)*c} ${c}`} 
                        strokeDashoffset={off1} 
                        className="transition-all duration-300 hover:stroke-[4] cursor-pointer hover:opacity-100 opacity-80"
                        onMouseEnter={() => setHoveredPhase({ name: 'Recon', count: recon, color: 'text-blue-400', glow: 'drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' })}
                        onMouseLeave={() => setHoveredPhase(null)}
                    />
                )}
                
                {/* Access - Orange */}
                {pAccess > 0 && (
                    <path 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" 
                        stroke="#f97316" 
                        strokeWidth="3" 
                        strokeDasharray={`${(pAccess/100)*c} ${c}`} 
                        strokeDashoffset={off2}
                        className="transition-all duration-300 hover:stroke-[4] cursor-pointer hover:opacity-100 opacity-80"
                        onMouseEnter={() => setHoveredPhase({ name: 'Access', count: access, color: 'text-orange-400', glow: 'drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]' })}
                        onMouseLeave={() => setHoveredPhase(null)}
                    />
                )}
                
                {/* Post - Red */}
                {pPost > 0 && (
                    <path 
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                        fill="none" 
                        stroke="#ef4444" 
                        strokeWidth="3" 
                        strokeDasharray={`${(pPost/100)*c} ${c}`} 
                        strokeDashoffset={off3}
                        className="transition-all duration-300 hover:stroke-[4] cursor-pointer hover:opacity-100 opacity-80"
                        onMouseEnter={() => setHoveredPhase({ name: 'Post-Exp', count: post, color: 'text-red-400', glow: 'drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' })}
                        onMouseLeave={() => setHoveredPhase(null)}
                    />
                )}
            </svg>
            <div className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-all duration-300 ${hoveredPhase?.glow || ''}`}>
                <span className={`text-2xl font-bold transition-colors ${hoveredPhase ? hoveredPhase.color : 'text-white'}`}>
                    {hoveredPhase ? hoveredPhase.count : actualTotal}
                </span>
                <span className="text-[9px] uppercase text-gray-400 tracking-wider font-semibold">
                    {hoveredPhase ? hoveredPhase.name : 'Total Ops'}
                </span>
            </div>
        </div>
    );
};

export const Dashboard: React.FC<DashboardProps> = ({ sessions }) => {
  
  // MITRE & Kill Chain Data
  const mitreGrid = [
    { id: 'T1595', name: 'Active Scanning', phase: 'Reconnaissance' },
    { id: 'T1598', name: 'Phishing', phase: 'Reconnaissance' },
    { id: 'T1190', name: 'Exploit Public App', phase: 'Initial Access' },
    { id: 'T1059', name: 'Command Scripting', phase: 'Execution' },
    { id: 'T1530', name: 'Cloud Discovery', phase: 'Discovery' },
    { id: 'T1046', name: 'Network Scan', phase: 'Discovery' },
    { id: 'T1078', name: 'Valid Accounts', phase: 'Defense Evasion' },
    { id: 'T1003', name: 'OS Credential Dumping', phase: 'Credential Access' },
  ];

  const analytics = useMemo(() => {
    const running = sessions.filter(s => s.status === SessionStatus.RUNNING).length;
    
    // Calculate Artifacts Yield
    const totalArtifacts = sessions.reduce((acc, s) => acc + s.artifacts.length, 0);

    // Estimate Findings Severity based on Report Keywords (Simulation)
    const severity = { critical: 0, high: 0, medium: 0, low: 0 };
    sessions.forEach(s => {
        const fullText = s.reports.map(r => r.content).join(' ').toLowerCase() + s.logs.map(l => l.content).join(' ').toLowerCase();
        if (fullText.includes('critical') || fullText.includes('cve-')) severity.critical++;
        else if (fullText.includes('high') || fullText.includes('exploit')) severity.high++;
        else if (fullText.includes('medium') || fullText.includes('misconfiguration')) severity.medium++;
        else severity.low++;
    });

    // Kill Chain Phases
    const phases: Record<string, number> = {};
    sessions.forEach(s => {
        if(s.mitreId) {
             const technique = mitreGrid.find(m => m.id === s.mitreId);
             if (technique) {
                 phases[technique.phase] = (phases[technique.phase] || 0) + 1;
             }
        }
    });

    // Recent Activity
    const activityLog = sessions.flatMap(s => 
        s.logs.map(l => ({ ...l, sessionName: s.name, sessionId: s.id }))
    ).sort((a, b) => b.timestamp - a.timestamp).slice(0, 5);

    return { running, totalArtifacts, severity, phases, activityLog };
  }, [sessions]);


  return (
    <div className="max-w-7xl mx-auto mt-6 pb-12 animate-in fade-in duration-500">
      <div className="flex justify-between items-end mb-8">
        <div>
            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3 drop-shadow-lg">
                <span className="p-2 bg-gradient-to-br from-kali-accent to-emerald-600 rounded-lg shadow-lg shadow-kali-accent/20 text-black"><IconFlag /></span> 
                Offensive Operations Control
            </h2>
            <p className="text-gray-400 mt-2 text-sm font-medium tracking-wide">Red Team Engagement Telemetry & Analytics.</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1.5 bg-black/40 border border-kali-accent/30 rounded-full text-xs text-kali-accent font-mono flex items-center gap-2 backdrop-blur-md shadow-[0_0_10px_rgba(0,255,159,0.1)]">
                <span className="w-2 h-2 rounded-full bg-kali-accent animate-pulse shadow-[0_0_5px_#00ff9f]"></span>
                OP_CENTER ACTIVE
            </span>
        </div>
      </div>
      
      {/* Top Stats Row - Glass Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Metric 1: Active Engagements */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl shadow-2xl group transition-transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity text-kali-accent scale-150"><IconTarget /></div>
            <div className="absolute inset-0 bg-gradient-to-br from-kali-accent/5 to-transparent opacity-50"></div>
            <div className="p-6 relative z-10">
                <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Active Engagements</h3>
                <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-bold text-white drop-shadow-md">{analytics.running}</div>
                    <div className="text-xs text-kali-accent font-medium mb-1">Live Ops</div>
                </div>
                <div className="mt-3 h-1 w-full bg-gray-700/50 rounded-full overflow-hidden">
                    <div className="h-full bg-kali-accent/80 w-1/2 animate-pulse"></div>
                </div>
            </div>
        </div>

        {/* Metric 2: Exfiltrated Data */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl shadow-2xl group transition-transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity text-purple-400 scale-150"><IconBriefcase /></div>
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-50"></div>
            <div className="p-6 relative z-10">
                <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Artifacts Captured</h3>
                <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-bold text-white drop-shadow-md">{analytics.totalArtifacts}</div>
                    <div className="text-xs text-purple-400 font-medium mb-1">Files</div>
                </div>
                 <div className="mt-3 h-1 w-full bg-gray-700/50 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500/80 w-3/4"></div>
                </div>
            </div>
        </div>

        {/* Metric 3: Critical Findings */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl shadow-2xl group transition-transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity text-red-500 scale-150"><IconSkull /></div>
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-50"></div>
            <div className="p-6 relative z-10">
                <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">Critical Findings</h3>
                <div className="flex items-baseline gap-2">
                    <div className="text-4xl font-bold text-white drop-shadow-md">{analytics.severity.critical}</div>
                    <div className="text-xs text-red-400 font-medium mb-1">Vulns</div>
                </div>
                <div className="mt-3 h-1 w-full bg-gray-700/50 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500/80 w-1/4"></div>
                </div>
            </div>
        </div>

         {/* Metric 4: Kill Chain Depth */}
         <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gray-900/30 backdrop-blur-xl shadow-2xl flex items-center justify-between p-1 group">
             <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50"></div>
            <div className="pl-6 relative z-10">
                 <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-3">Kill Chain Phase</h3>
                 <div className="flex flex-col gap-1.5">
                     <div className="flex items-center gap-2 text-xs text-gray-300">
                         <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_5px_blue]"></span> Recon ({analytics.phases['Reconnaissance'] || 0})
                     </div>
                     <div className="flex items-center gap-2 text-xs text-gray-300">
                         <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_5px_orange]"></span> Access ({ (analytics.phases['Initial Access']||0) + (analytics.phases['Execution']||0) })
                     </div>
                     <div className="flex items-center gap-2 text-xs text-gray-300">
                         <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_5px_red]"></span> Post-Exp ({ (analytics.phases['Defense Evasion']||0) + (analytics.phases['Credential Access']||0) })
                     </div>
                 </div>
            </div>
            <div className="pr-4 relative z-10">
                <KillChainDonut phases={analytics.phases} />
            </div>
        </div>
      </div>

      {/* Main Visuals Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Severity Distribution */}
        <div className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-white/5 bg-gray-900/40 backdrop-blur-xl shadow-2xl p-6">
             <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><IconBug /> Vulnerability Severity Distribution</h3>
                <div className="px-2 py-1 bg-black/40 rounded text-[10px] text-gray-400 border border-white/10">Aggregate Findings</div>
             </div>
             <div className="bg-black/20 rounded-xl border border-white/5 p-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:16px_16px]"></div>
                {analytics.severity.critical + analytics.severity.high + analytics.severity.medium + analytics.severity.low === 0 ? (
                    <div className="h-40 flex items-center justify-center text-gray-600 text-sm italic z-10">No vulnerability data available yet.</div>
                ) : (
                    <div className="z-10 w-full"><SeverityBarChart counts={analytics.severity} /></div>
                )}
             </div>
        </div>

        {/* MITRE Heatmap */}
        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gray-900/40 backdrop-blur-xl shadow-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4"><IconTarget /> MITRE ATT&CK Map</h3>
            <div className="grid grid-cols-2 gap-2">
                {mitreGrid.map(technique => {
                    const count = analytics.phases[technique.phase] || 0; 
                    const strictCount = sessions.filter(s => s.mitreId === technique.id).length;
                    
                    const intensity = strictCount > 2 
                        ? 'bg-red-500/20 text-red-200 border-red-500/50 shadow-[0_0_10px_rgba(239,68,68,0.2)]' 
                        : strictCount > 0 
                        ? 'bg-red-900/20 text-gray-300 border-red-900/30' 
                        : 'bg-black/20 text-gray-600 border-white/5';
                        
                    return (
                        <div key={technique.id} className={`p-2.5 rounded border text-xs transition-all cursor-default group relative ${intensity} hover:bg-white/5`}>
                            <div className="font-mono font-bold text-[10px] opacity-70">{technique.id}</div>
                            <div className="truncate text-[10px] font-medium">{technique.name}</div>
                            
                            {/* Glass Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-900/90 backdrop-blur-xl text-white text-[10px] rounded border border-white/10 opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-20 shadow-xl transition-opacity">
                                <span className="text-kali-accent font-bold">{technique.phase}</span>: {strictCount} Ops
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
      </div>

      {/* Bottom Row: Recent Logs */}
      <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gray-900/40 backdrop-blur-xl shadow-2xl">
          <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
              <h3 className="font-bold text-white text-sm uppercase tracking-wider">Engagement Logs</h3>
              <span className="text-xs text-gray-500 font-mono flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Live Feed</span>
          </div>
          <div className="divide-y divide-white/5 max-h-60 overflow-y-auto">
              {analytics.activityLog.length > 0 ? analytics.activityLog.map((log, idx) => (
                  <div key={idx} className="px-6 py-3 flex items-start gap-4 hover:bg-white/5 transition-colors group">
                      <div className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${log.sender === 'user' ? 'bg-kali-accent shadow-[0_0_5px_#00ff9f]' : log.sender === 'system' ? 'bg-yellow-500 shadow-[0_0_5px_#eab308]' : 'bg-blue-500 shadow-[0_0_5px_#3b82f6]'}`}></div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-0.5">
                              <span className="text-xs font-bold text-gray-300 truncate w-1/3 font-mono group-hover:text-white transition-colors">{log.sessionName}</span>
                              <span className="text-[10px] text-gray-600 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs text-gray-500 font-mono truncate opacity-80 group-hover:opacity-100 transition-opacity">{log.content}</p>
                      </div>
                  </div>
              )) : (
                  <div className="p-8 text-center text-gray-600 italic text-sm">No activity recorded yet. Launch an operation to generate telemetry.</div>
              )}
          </div>
      </div>

    </div>
  );
};
