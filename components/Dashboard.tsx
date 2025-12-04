
import React, { useMemo } from 'react';
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
            <div className="flex flex-col items-center gap-2 w-full group">
                <div className="w-full bg-blue-900/20 rounded-t relative h-32 flex items-end">
                    <div className="w-full bg-blue-500/80 rounded-t transition-all duration-500 group-hover:bg-blue-400" style={{ height: getHeight(counts.low) }}></div>
                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">{counts.low}</span>
                </div>
                <span className="text-[10px] uppercase text-gray-500 font-bold">Low</span>
            </div>
            {/* Medium */}
             <div className="flex flex-col items-center gap-2 w-full group">
                <div className="w-full bg-yellow-900/20 rounded-t relative h-32 flex items-end">
                    <div className="w-full bg-yellow-500/80 rounded-t transition-all duration-500 group-hover:bg-yellow-400" style={{ height: getHeight(counts.medium) }}></div>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity">{counts.medium}</span>
                </div>
                <span className="text-[10px] uppercase text-gray-500 font-bold">Med</span>
            </div>
            {/* High */}
             <div className="flex flex-col items-center gap-2 w-full group">
                <div className="w-full bg-orange-900/20 rounded-t relative h-32 flex items-end">
                    <div className="w-full bg-orange-500/80 rounded-t transition-all duration-500 group-hover:bg-orange-400" style={{ height: getHeight(counts.high) }}></div>
                     <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity">{counts.high}</span>
                </div>
                <span className="text-[10px] uppercase text-gray-500 font-bold">High</span>
            </div>
            {/* Critical */}
             <div className="flex flex-col items-center gap-2 w-full group">
                <div className="w-full bg-red-900/20 rounded-t relative h-32 flex items-end">
                    <div className="w-full bg-red-600/80 rounded-t transition-all duration-500 group-hover:bg-red-500" style={{ height: getHeight(counts.critical) }}></div>
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">{counts.critical}</span>
                </div>
                <span className="text-[10px] uppercase text-gray-500 font-bold">Crit</span>
            </div>
        </div>
    )
}

const KillChainDonut = ({ phases }: { phases: Record<string, number> }) => {
    const total = Object.values(phases).reduce((a, b) => a + b, 0) || 1;
    
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
        <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                {/* Background */}
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1f2937" strokeWidth="4" />
                
                {/* Recon - Blue */}
                {pRecon > 0 && <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray={`${(pRecon/100)*c} ${c}`} strokeDashoffset={off1} />}
                
                {/* Access - Orange */}
                {pAccess > 0 && <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray={`${(pAccess/100)*c} ${c}`} strokeDashoffset={off2} />}
                
                {/* Post - Red */}
                {pPost > 0 && <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray={`${(pPost/100)*c} ${c}`} strokeDashoffset={off3} />}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{total}</span>
                <span className="text-[8px] uppercase text-gray-500 tracking-wider">Ops</span>
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
    { id: 'T1003', name: 'Credential Dump', phase: 'Credential Access' },
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
            <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                <IconFlag /> Offensive Operations Control
            </h2>
            <p className="text-gray-400 mt-1">Red Team Engagement Telemetry & Analytics.</p>
        </div>
        <div className="flex gap-2">
            <span className="px-3 py-1 bg-kali-900 border border-kali-700 rounded text-xs text-kali-accent font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-kali-accent animate-pulse"></span>
                OP_CENTER ACTIVE
            </span>
        </div>
      </div>
      
      {/* Top Stats Row - Red Team Focused */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        {/* Metric 1: Active Engagements */}
        <div className="bg-kali-800 p-6 rounded-xl border border-kali-700 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-kali-accent"><IconTarget /></div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Active Engagements</h3>
            <div className="flex items-end gap-3">
                <div className="text-4xl font-bold text-white">{analytics.running}</div>
                <div className="text-xs text-gray-500 mb-1.5">Running Ops</div>
            </div>
            <div className="mt-2 text-xs text-gray-500 font-mono">Sessions currently live</div>
        </div>

        {/* Metric 2: Exfiltrated Data */}
        <div className="bg-kali-800 p-6 rounded-xl border border-kali-700 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-purple-400"><IconBriefcase /></div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Exfiltrated Artifacts</h3>
            <div className="flex items-end gap-3">
                <div className="text-4xl font-bold text-white">{analytics.totalArtifacts}</div>
                <div className="text-xs text-gray-500 mb-1.5">Files Captured</div>
            </div>
             <div className="mt-2 text-xs text-purple-400 font-mono">Proof of Value</div>
        </div>

        {/* Metric 3: Critical Findings */}
        <div className="bg-kali-800 p-6 rounded-xl border border-kali-700 shadow-lg relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-red-500"><IconSkull /></div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-2">Critical Findings</h3>
            <div className="flex items-end gap-3">
                <div className="text-4xl font-bold text-white">{analytics.severity.critical}</div>
                <div className="text-xs text-gray-500 mb-1.5">Vulnerabilities</div>
            </div>
             <div className="mt-2 text-xs text-red-500 font-mono">Requires Immediate Action</div>
        </div>

         {/* Metric 4: Kill Chain Depth */}
         <div className="bg-kali-800 p-4 rounded-xl border border-kali-700 shadow-lg relative overflow-hidden flex items-center justify-between">
            <div>
                 <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Kill Chain</h3>
                 <div className="flex flex-col gap-1 mt-2">
                     <div className="flex items-center gap-2 text-xs">
                         <span className="w-2 h-2 rounded-full bg-blue-500"></span> Recon ({analytics.phases['Reconnaissance'] || 0})
                     </div>
                     <div className="flex items-center gap-2 text-xs">
                         <span className="w-2 h-2 rounded-full bg-orange-500"></span> Access ({ (analytics.phases['Initial Access']||0) + (analytics.phases['Execution']||0) })
                     </div>
                     <div className="flex items-center gap-2 text-xs">
                         <span className="w-2 h-2 rounded-full bg-red-500"></span> Post-Exp ({ (analytics.phases['Defense Evasion']||0) + (analytics.phases['Credential Access']||0) })
                     </div>
                 </div>
            </div>
            <KillChainDonut phases={analytics.phases} />
        </div>
      </div>

      {/* Main Visuals Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Severity Distribution */}
        <div className="lg:col-span-2 bg-kali-800 p-6 rounded-xl border border-kali-700 shadow-lg">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2"><IconBug /> Vulnerability Severity Distribution</h3>
                <div className="px-2 py-1 bg-kali-900 rounded text-[10px] text-gray-400 border border-kali-700">Aggregate Findings</div>
             </div>
             <div className="bg-kali-900/50 rounded-lg border border-kali-700/50 p-4 flex items-center justify-center">
                {analytics.severity.critical + analytics.severity.high + analytics.severity.medium + analytics.severity.low === 0 ? (
                    <div className="h-40 flex items-center justify-center text-gray-600 text-sm italic">No vulnerability data available yet.</div>
                ) : (
                    <SeverityBarChart counts={analytics.severity} />
                )}
             </div>
        </div>

        {/* MITRE Heatmap */}
        <div className="bg-kali-800 p-6 rounded-xl border border-kali-700 shadow-lg">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2"><IconTarget /> MITRE ATT&CK Map</h3>
            <div className="grid grid-cols-2 gap-3">
                {mitreGrid.map(technique => {
                    const count = analytics.phases[technique.phase] || 0; // Simplified counting for demo
                    // Check strict match from sessions
                    const strictCount = sessions.filter(s => s.mitreId === technique.id).length;
                    
                    const intensity = strictCount > 2 ? 'bg-red-500/90 text-white border-red-500' : strictCount > 0 ? 'bg-red-900/40 text-red-200 border-red-800' : 'bg-kali-900 text-gray-600 border-kali-700 opacity-60';
                    return (
                        <div key={technique.id} className={`p-2 rounded border text-xs transition-all cursor-default group relative ${intensity}`}>
                            <div className="font-mono font-bold">{technique.id}</div>
                            <div className="truncate text-[10px]">{technique.name}</div>
                            
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-10 shadow-xl border border-gray-700">
                                {technique.phase}: {strictCount} Ops
                            </div>
                        </div>
                    )
                })}
            </div>
            <div className="mt-4 text-[10px] text-gray-500 text-center">
                Tactical coverage based on executed scenarios.
            </div>
        </div>
      </div>

      {/* Bottom Row: Recent Logs */}
      <div className="bg-kali-800 rounded-xl border border-kali-700 shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-kali-700 flex justify-between items-center bg-kali-900/50">
              <h3 className="font-bold text-white">Engagement Logs</h3>
              <span className="text-xs text-gray-500 font-mono">Recent Events</span>
          </div>
          <div className="divide-y divide-kali-700">
              {analytics.activityLog.length > 0 ? analytics.activityLog.map((log, idx) => (
                  <div key={idx} className="px-6 py-3 flex items-start gap-4 hover:bg-kali-700/20 transition-colors">
                      <div className={`mt-1.5 w-2 h-2 rounded-full ${log.sender === 'user' ? 'bg-kali-accent' : log.sender === 'system' ? 'bg-yellow-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline mb-1">
                              <span className="text-sm font-medium text-white truncate w-1/3 font-mono">{log.sessionName}</span>
                              <span className="text-xs text-gray-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-xs text-gray-400 font-mono truncate opacity-80">{log.content}</p>
                      </div>
                  </div>
              )) : (
                  <div className="p-8 text-center text-gray-500 italic">No activity recorded yet. Launch an operation to generate telemetry.</div>
              )}
          </div>
      </div>

    </div>
  );
};
