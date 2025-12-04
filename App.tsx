
import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { 
  PentestSession, 
  SessionStatus, 
  AgentModel, 
  CreateSessionDTO, 
  LogEntry,
  PlatformSettings,
  PentestArtifact,
  AttackScenario,
  ReportType
} from './types';
import { Terminal } from './components/Terminal';
import { Button } from './components/Button';
import { Settings } from './components/Settings';
import { SystemMonitor } from './components/SystemMonitor';
import { ArtifactsView } from './components/ArtifactsView';
import { ReportsView } from './components/ReportsView';
import { streamPentestResponse, generateReport } from './services/geminiService';
import { DEFAULT_SCENARIOS, DB_VERSION } from './data/defaultScenarios';

// --- SVGs ---
const IconPlus = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>;
const IconServer = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 01-2 2v4a2 2 0 012 2h14a2 2 0 012-2v-4a2 2 0 01-2-2m-2-4h.01M17 16h.01" /></svg>;
const IconTerminal = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconEdit = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>;
const IconPlay = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>;
const IconSettings = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const IconLayout = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>;
const IconStop = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" /></svg>;
const IconActivity = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconFolderOpen = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" /></svg>;
const IconChevronLeft = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>;
const IconChevronRight = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const IconTarget = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const IconHash = () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>;
const IconCpu = () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" /></svg>;
const IconList = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const IconShieldCheck = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconGlobe = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>;
const IconDocumentText = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;

// MITRE Tactic & Technique Lookup
const MITRE_DB: Record<string, { name: string, tactic: string }> = {
    'T1595': { name: 'Active Scanning', tactic: 'Reconnaissance' },
    'T1190': { name: 'Exploit Public-Facing App', tactic: 'Initial Access' },
    'T1530': { name: 'Data from Cloud Storage', tactic: 'Collection' },
    'T1598': { name: 'Phishing for Information', tactic: 'Reconnaissance' },
    'T1059': { name: 'Command & Scripting', tactic: 'Execution' },
    'T1046': { name: 'Network Service Scanning', tactic: 'Discovery' },
    'T1078': { name: 'Valid Accounts', tactic: 'Defense Evasion' },
    'T1003': { name: 'OS Credential Dumping', tactic: 'Credential Access' }
};

const Sidebar = ({ isCollapsed, toggleSidebar }: any) => {
  const location = useLocation();
  const [tooltip, setTooltip] = useState<{ top: number, left: number, title: string } | null>(null);
  const isActive = (path: string) => location.pathname === path;
  const handleMouseEnter = (e: React.MouseEvent, title: string) => {
    if (!isCollapsed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({ top: rect.top, left: rect.right + 12, title });
  };
  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-64'} bg-kali-800 border-r border-kali-700 flex flex-col h-screen transition-all duration-300 ease-in-out relative z-10`}>
      <Link to="/" className={`h-16 flex items-center border-b border-kali-700 hover:bg-kali-700/50 transition-colors group ${isCollapsed ? 'justify-center px-0' : 'px-6'}`}>
        {isCollapsed ? <div className="text-kali-accent"><IconTarget /></div> : (
          <div className="flex-1"><h1 className="text-xl font-bold text-kali-accent tracking-tight flex items-center gap-2 group-hover:text-white transition-colors"><IconTarget />Impetus2AI</h1><p className="text-xs text-gray-500 mt-1 whitespace-nowrap overflow-hidden">AI-Powered Security Platform</p></div>
        )}
      </Link>
      <div className="p-4 space-y-2">
        <Link to="/" onMouseEnter={(e) => handleMouseEnter(e, "Dashboard")} onMouseLeave={() => setTooltip(null)}>
          <Button variant={isActive('/') ? 'secondary' : 'ghost'} className={`w-full ${isCollapsed ? 'justify-center px-0' : 'gap-2 justify-start'}`}><IconLayout />{!isCollapsed && <span>Dashboard</span>}</Button>
        </Link>
        <Link to="/sessions" onMouseEnter={(e) => handleMouseEnter(e, "Sessions")} onMouseLeave={() => setTooltip(null)}>
          <Button variant={isActive('/sessions') ? 'secondary' : 'ghost'} className={`w-full ${isCollapsed ? 'justify-center px-0' : 'gap-2 justify-start'}`}><IconList />{!isCollapsed && <span>Sessions</span>}</Button>
        </Link>
        <Link to="/scenarios" onMouseEnter={(e) => handleMouseEnter(e, "Attack Scenarios")} onMouseLeave={() => setTooltip(null)}>
           <Button variant={isActive('/scenarios') ? 'secondary' : 'ghost'} className={`w-full ${isCollapsed ? 'justify-center px-0' : 'gap-2 justify-start'}`}><IconActivity />{!isCollapsed && <span>Attack Scenarios</span>}</Button>
        </Link>
      </div>
      <div className="flex-1" />
      <div className="p-4 border-t border-kali-700 space-y-2 bg-kali-800">
        <Link to="/settings" onMouseEnter={(e) => handleMouseEnter(e, "Settings")} onMouseLeave={() => setTooltip(null)}>
          <Button variant={isActive('/settings') ? 'secondary' : 'ghost'} className={`w-full ${isCollapsed ? 'justify-center px-0' : 'gap-2 justify-start'}`}><IconSettings />{!isCollapsed && <span>Settings</span>}</Button>
        </Link>
        <button onClick={toggleSidebar} className={`w-full flex items-center text-gray-500 hover:text-white transition-colors mt-2 pt-2 border-t border-kali-700/50 ${isCollapsed ? 'justify-center' : 'justify-end'}`}>{isCollapsed ? <IconChevronRight /> : <IconChevronLeft />}</button>
      </div>
      {isCollapsed && tooltip && <div className="fixed z-[100] bg-kali-900 border border-kali-700 rounded-md shadow-2xl p-3 w-48 pointer-events-none" style={{ top: tooltip.top, left: tooltip.left }}><div className="font-bold text-gray-200 text-sm truncate">{tooltip.title}</div></div>}
    </div>
  );
};

const CreateSessionView = ({ onCreate, initialData }: { onCreate: (data: CreateSessionDTO) => void, initialData?: Partial<CreateSessionDTO> }) => {
  const [formData, setFormData] = useState<CreateSessionDTO>({ 
    name: initialData?.name || '', 
    target: initialData?.target || '', 
    objective: initialData?.objective || '', 
    customSystemPrompt: initialData?.customSystemPrompt || '', 
    model: AgentModel.GEMINI_FLASH,
    mitreId: initialData?.mitreId || ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData]);
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const resolvedObjective = formData.objective.replace(/{target}/gi, formData.target);
      const resolvedPrompt = formData.customSystemPrompt?.replace(/{target}/gi, formData.target);
      onCreate({ ...formData, objective: resolvedObjective, customSystemPrompt: resolvedPrompt });
  };

  return (
    <div className="max-w-2xl mx-auto mt-6 p-8 bg-kali-800 rounded-xl border border-kali-700 shadow-2xl mb-10 animate-in fade-in slide-in-from-bottom-4">
      <h2 className="text-2xl font-bold text-white mb-2">Initialize Pentest Session</h2>
      <p className="text-gray-400 mb-6 text-sm">Configure a new containerized environment for your security assessment.</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Session Name</label><input required className="w-full bg-kali-900 border border-kali-600 rounded-md px-4 py-2 text-white focus:border-kali-accent outline-none" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Web App Audit - Acme Corp" /></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Target Scope</label><input required className="w-full bg-kali-900 border border-kali-600 rounded-md px-4 py-2 text-white focus:border-kali-accent outline-none" value={formData.target} onChange={e => setFormData({ ...formData, target: e.target.value })} placeholder="e.g., 192.168.1.5, example.com" /></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Primary Objective</label><input required className="w-full bg-kali-900 border border-kali-600 rounded-md px-4 py-2 text-white focus:border-kali-accent outline-none" value={formData.objective} onChange={e => setFormData({ ...formData, objective: e.target.value })} placeholder="e.g., Scan for open ports and identify service versions" /></div>
        <div><label className="block text-sm font-medium text-gray-300 mb-1">Custom System Context (Optional)</label><textarea className="w-full bg-kali-900 border border-kali-600 rounded-md px-4 py-2 text-white focus:border-kali-accent outline-none h-20 text-sm" value={formData.customSystemPrompt} onChange={e => setFormData({ ...formData, customSystemPrompt: e.target.value })} placeholder="Inject specific personality, tools, or constraints for this session..." /></div>
        <div>
           <label className="block text-sm font-medium text-gray-300 mb-2">AI Model Agent</label>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             {[AgentModel.GEMINI_FLASH, AgentModel.GEMINI_PRO, AgentModel.CLAUDE_3_5_SONNET].map(m => (
               <div key={m} className={`cursor-pointer border rounded-lg p-3 transition-all ${formData.model === m ? 'border-kali-accent bg-kali-700 ring-1 ring-kali-accent' : 'border-kali-600 bg-kali-900 hover:border-gray-500'}`} onClick={() => setFormData({...formData, model: m})}>
                 <div className={`font-bold text-sm ${formData.model === m ? 'text-white' : 'text-gray-400'}`}>{m}</div>
                 <div className="text-[10px] text-gray-500 mt-1">
                    {m === AgentModel.GEMINI_FLASH ? 'Fast, low latency.' : m === AgentModel.GEMINI_PRO ? 'Deep reasoning.' : 'Agentic coding.'}
                 </div>
               </div>
             ))}
           </div>
        </div>
        <div className="pt-2"><Button type="submit" className="w-full" size="lg">Deploy Session Container</Button></div>
      </form>
    </div>
  );
};

const AttackScenariosView = ({ scenarios, onAdd, onUpdate, onDelete, onRun }: any) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingScenario, setEditingScenario] = useState<AttackScenario | null>(null);
    const [formData, setFormData] = useState<Partial<AttackScenario>>({
        name: '', category: 'Network', difficulty: 'Beginner', mitreId: '', description: '', tools: [], initialPrompt: ''
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingScenario) {
            onUpdate({ ...editingScenario, ...formData });
        } else {
            onAdd({ ...formData, id: uuidv4(), tools: formData.tools || [] });
        }
        setIsModalOpen(false);
        setEditingScenario(null);
        setFormData({ name: '', category: 'Network', difficulty: 'Beginner', mitreId: '', description: '', tools: [], initialPrompt: '' });
    };

    const openEdit = (s: AttackScenario) => {
        setEditingScenario(s);
        setFormData(s);
        setIsModalOpen(true);
    };

    const openCreate = () => {
        setEditingScenario(null);
        setFormData({ name: '', category: 'Network', difficulty: 'Beginner', mitreId: '', description: '', tools: [], initialPrompt: '' });
        setIsModalOpen(true);
    }

    const handleRun = (s: AttackScenario) => {
        const sessionData: CreateSessionDTO = {
            name: `Op: ${s.name}`,
            target: '', 
            objective: s.initialPrompt,
            model: AgentModel.GEMINI_FLASH,
            customSystemPrompt: `Load Scenario: ${s.name}. Description: ${s.description}.`,
            mitreId: s.mitreId
        };
        onRun(sessionData);
    }

    return (
        <div className="max-w-7xl mx-auto mt-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Attack Scenarios</h2>
                    <p className="text-gray-400 text-sm">Library of pre-configured attack templates.</p>
                </div>
                <Button onClick={openCreate}><IconPlus /> Create Scenario</Button>
            </div>

            <div className="bg-kali-800 rounded-lg border border-kali-700 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-kali-900 text-gray-400 text-xs uppercase tracking-wider border-b border-kali-700">
                            <th className="p-4 font-medium">Scenario Name</th>
                            <th className="p-4 font-medium">Category</th>
                            <th className="p-4 font-medium">Tactic</th>
                            <th className="p-4 font-medium">Technique</th>
                            <th className="p-4 font-medium">Difficulty</th>
                            <th className="p-4 font-medium">Tools</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-kali-700">
                        {scenarios.map((s: AttackScenario) => {
                            const mitreInfo = MITRE_DB[s.mitreId];
                            return (
                            <tr key={s.id} className="hover:bg-kali-700/30 transition-colors group">
                                <td className="p-4 text-sm font-medium text-white">{s.name}</td>
                                <td className="p-4 text-sm text-gray-300"><span className="px-2 py-1 rounded bg-kali-900 border border-kali-700 text-xs">{s.category}</span></td>
                                <td className="p-4 text-sm text-gray-300">
                                    <span className="px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-300 border border-blue-900/50 text-xs font-medium">
                                        {mitreInfo?.tactic || '-'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-300 group relative">
                                    <span 
                                        className="cursor-help border-b border-dotted border-gray-600 hover:text-white transition-colors"
                                        title={s.mitreId}
                                    >
                                        {mitreInfo?.name || s.mitreId || '-'}
                                    </span>
                                </td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${s.difficulty === 'Beginner' ? 'text-green-400 bg-green-900/20' : s.difficulty === 'Intermediate' ? 'text-yellow-400 bg-yellow-900/20' : 'text-red-400 bg-red-900/20'}`}>
                                        {s.difficulty}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-400 font-mono text-xs">{s.tools.join(', ')}</td>
                                <td className="p-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="sm" onClick={() => handleRun(s)} title="Run Scenario"><IconPlay /></Button>
                                    <Button size="sm" variant="secondary" onClick={() => openEdit(s)} title="Edit"><IconEdit /></Button>
                                    <Button size="sm" variant="danger" onClick={() => onDelete(s.id)} title="Delete"><IconTrash /></Button>
                                </td>
                            </tr>
                        )})}
                        {scenarios.length === 0 && (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-500 italic">No scenarios found. Create one to get started.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-kali-800 rounded-xl border border-kali-700 p-6 w-full max-w-lg shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">{editingScenario ? 'Edit Scenario' : 'New Scenario'}</h3>
                        <form onSubmit={handleSave} className="space-y-4">
                            <input required className="w-full bg-kali-900 border border-kali-600 rounded p-2 text-white text-sm" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <div className="flex gap-4">
                                <select className="bg-kali-900 border border-kali-600 rounded p-2 text-white text-sm flex-1" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                                    <option>Network</option><option>Web</option><option>Cloud</option><option>API</option><option>Social Eng</option>
                                </select>
                                <select className="bg-kali-900 border border-kali-600 rounded p-2 text-white text-sm flex-1" value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: e.target.value as any})}>
                                    <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                                </select>
                            </div>
                            <input className="w-full bg-kali-900 border border-kali-600 rounded p-2 text-white text-sm" placeholder="MITRE ATT&CK ID (e.g. T1595)" value={formData.mitreId} onChange={e => setFormData({...formData, mitreId: e.target.value})} />
                            <textarea className="w-full bg-kali-900 border border-kali-600 rounded p-2 text-white text-sm h-20" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                            <input className="w-full bg-kali-900 border border-kali-600 rounded p-2 text-white text-sm" placeholder="Tools (comma separated)" value={formData.tools?.join(', ')} onChange={e => setFormData({...formData, tools: e.target.value.split(',').map(t => t.trim())})} />
                            <textarea required className="w-full bg-kali-900 border border-kali-600 rounded p-2 text-white text-sm h-24 font-mono" placeholder="Initial Prompt / Command" value={formData.initialPrompt} onChange={e => setFormData({...formData, initialPrompt: e.target.value})} />
                            <div className="flex justify-end gap-2 pt-2">
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                <Button type="submit">Save Scenario</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

const SessionView = ({ session, onSendMessage, onTerminate, isStreaming, settings, onInterrupt, onGenerateReport, onDeleteReport }: any) => {
  const [showMonitor, setShowMonitor] = useState(false);
  const [activeTab, setActiveTab] = useState<'terminal' | 'artifacts' | 'reports'>('terminal');
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);

  useEffect(() => {
    if (session.status === SessionStatus.RUNNING && !isStreaming) {
      if (session.logs.length === 0) {
        onSendMessage(session.id, "BOOT_SEQUENCE", true);
      } else if (session.logs.length === 1 && session.logs[0].sender === 'agent') {
        const timer = setTimeout(() => {
           onSendMessage(session.id, "[AUTO_MISSION_START]", true);
        }, 500); 
        return () => clearTimeout(timer);
      }
    }
  }, [session.id, session.logs.length, session.status, isStreaming]);

  const getModelDisplayName = (model: string) => {
    if (model === AgentModel.GEMINI_FLASH) return "Gemini 2.5 Flash";
    if (model === AgentModel.GEMINI_PRO) return "Gemini 3 Pro";
    if (model === AgentModel.CLAUDE_3_5_SONNET) return "Claude 3.5 Sonnet";
    return model;
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      <div className="shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white font-mono tracking-tight">
            <span className="text-kali-accent">{settings.general.userName}@impetus2ai</span> <span className="text-gray-400">:</span> <span className="text-gray-300">~/sessions/{session.name.toLowerCase().replace(/\s+/g, '-')}</span>
          </h2>
          <div className="flex items-center gap-3">
             {session.status === SessionStatus.RUNNING && <Button size="sm" variant="danger" onClick={() => setShowTerminateConfirm(true)} className="text-xs"><IconStop /> Stop Session</Button>}
             <Button size="sm" variant="ghost" onClick={() => setShowMonitor(!showMonitor)} className={`text-xs ${showMonitor ? 'bg-kali-700' : ''}`}><IconActivity /> Monitor</Button>
             <div className="px-3 py-1 rounded-full text-xs font-bold font-mono tracking-wide bg-green-900/20 text-green-400 border border-green-900">{session.status}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 p-4 bg-kali-800 rounded-lg border border-kali-700 shadow-sm">
            <div className="space-y-1">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><IconTarget /> Target Scope</span>
                <div className="font-mono text-sm text-kali-accent truncate" title={session.target}>{session.target}</div>
            </div>
            <div className="space-y-1">
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><IconHash /> Mission Objective</span>
                <div className="text-sm text-gray-300 truncate font-medium" title={session.objective}>{session.objective}</div>
            </div>
            <div className="space-y-1">
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><IconCpu /> Active Agent</span>
                <div className="text-sm text-gray-300 font-medium flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${session.status === SessionStatus.RUNNING ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
                    {getModelDisplayName(session.model)}
                </div>
            </div>
             <div className="space-y-1">
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1"><IconTerminal /> Environment</span>
                <div className="text-sm text-gray-400 font-mono">/bin/{settings.general.shell} • ID: {session.id.substring(0,6)}</div>
            </div>
        </div>

        <div className="flex gap-1 border-b border-kali-700 mt-4">
          <button onClick={() => setActiveTab('terminal')} className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 ${activeTab === 'terminal' ? 'border-kali-accent text-white' : 'border-transparent text-gray-400'}`}><IconTerminal /> Console</button>
          <button onClick={() => setActiveTab('artifacts')} className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 ${activeTab === 'artifacts' ? 'border-kali-accent text-white' : 'border-transparent text-gray-400'}`}><IconFolderOpen /> Artifacts</button>
          <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 ${activeTab === 'reports' ? 'border-kali-accent text-white' : 'border-transparent text-gray-400'}`}><IconDocumentText /> Reports</button>
        </div>
      </div>
      {showMonitor && <SystemMonitor />}
      <div className="flex-1 min-h-0 pb-6 relative pt-4">
        <div style={{ display: activeTab === 'terminal' ? 'block' : 'none', height: '100%' }}>
           <Terminal 
             key={session.id} 
             logs={session.logs} 
             status={session.status} 
             onSendMessage={(msg) => onSendMessage(session.id, msg)} 
             isStreaming={isStreaming} 
             onInterrupt={() => onInterrupt(session.id)}
           />
        </div>
        <div style={{ display: activeTab === 'artifacts' ? 'block' : 'none', height: '100%' }}>
           <ArtifactsView artifacts={session.artifacts || []} />
        </div>
        <div style={{ display: activeTab === 'reports' ? 'block' : 'none', height: '100%' }}>
           <ReportsView 
              reports={session.reports || []} 
              artifacts={session.artifacts || []}
              logs={session.logs || []}
              onGenerate={(type) => onGenerateReport(session.id, type)}
              onDelete={(reportId) => onDeleteReport(session.id, reportId)}
           />
        </div>
      </div>

       {showTerminateConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-kali-800 rounded-lg border border-kali-700 p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Stop Active Session?</h3>
            <p className="text-gray-400 text-sm mb-6">This will halt the active container and AI agent processes. You can view logs later, but cannot resume execution.</p>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setShowTerminateConfirm(false)}>Cancel</Button>
              <Button variant="danger" onClick={() => { onTerminate(session.id); setShowTerminateConfirm(false); }}>Confirm Stop</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ sessions }: { sessions: PentestSession[] }) => {
    const totalSessions = sessions.length;
    const running = sessions.filter(s => s.status === SessionStatus.RUNNING).length;
    const completed = sessions.filter(s => s.status === SessionStatus.COMPLETED).length;

    const mitreTechniques = [
        { id: 'T1595', covered: true },
        { id: 'T1190', covered: running > 0 },
        { id: 'T1059', covered: true },
        { id: 'T1046', covered: true },
        { id: 'T1078', covered: false },
        { id: 'T1003', covered: false },
    ];

    return (
        <div className="max-w-6xl mx-auto mt-6">
            <h2 className="text-2xl font-bold text-white mb-6">Security Operations Dashboard</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-kali-800 p-6 rounded-xl border border-kali-700 shadow-lg">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Total Sessions</h3>
                    <div className="text-4xl font-bold text-white">{totalSessions}</div>
                </div>
                <div className="bg-kali-800 p-6 rounded-xl border border-kali-700 shadow-lg">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Running Containers</h3>
                    <div className="text-4xl font-bold text-kali-accent">{running}</div>
                </div>
                <div className="bg-kali-800 p-6 rounded-xl border border-kali-700 shadow-lg">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Completed Ops</h3>
                    <div className="text-4xl font-bold text-blue-400">{completed}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <div className="bg-kali-800 p-6 rounded-xl border border-kali-700 shadow-lg">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><IconActivity /> Cluster Health</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm text-gray-400 mb-1"><span>CPU Load</span><span>34%</span></div>
                            <div className="h-2 bg-kali-900 rounded-full overflow-hidden"><div className="h-full bg-blue-500 w-[34%]"></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-gray-400 mb-1"><span>Memory Usage</span><span>62%</span></div>
                            <div className="h-2 bg-kali-900 rounded-full overflow-hidden"><div className="h-full bg-purple-500 w-[62%]"></div></div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-gray-400 mb-1"><span>Network I/O</span><span>120 MB/s</span></div>
                            <div className="h-2 bg-kali-900 rounded-full overflow-hidden"><div className="h-full bg-green-500 w-[15%]"></div></div>
                        </div>
                    </div>
                 </div>

                 <div className="bg-kali-800 p-6 rounded-xl border border-kali-700 shadow-lg">
                     <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><IconShieldCheck /> MITRE ATT&CK Coverage</h3>
                     <div className="grid grid-cols-2 gap-3">
                         {mitreTechniques.map(t => {
                             const info = MITRE_DB[t.id];
                             return (
                             <div key={t.id} className={`p-2 rounded border text-xs font-mono flex justify-between items-center ${t.covered ? 'bg-red-900/20 border-red-900 text-red-200' : 'bg-kali-900 border-kali-700 text-gray-500'}`}>
                                 <span>{t.id} {info?.name || 'Unknown'}</span>
                                 {t.covered && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                             </div>
                             );
                         })}
                     </div>
                 </div>
            </div>
        </div>
    );
};

const SessionManager = ({ sessions, onDelete, onTerminate }: any) => {
    const navigate = useNavigate();

    const handleTerminate = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        onTerminate(id);
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        if(window.confirm("CRITICAL WARNING: This action is permanent.\n\nAre you sure you want to delete this session? All logs, artifacts, and reports will be wiped from local storage.")) {
            onDelete(id);
        }
    };

    return (
        <div className="max-w-7xl mx-auto mt-6">
             <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-2"><IconList /> Session Management</h2>
                    <p className="text-gray-400 text-sm">Manage active containers and historical audit logs.</p>
                </div>
                <Link to="/create">
                    <Button><IconPlus /> New Session</Button>
                </Link>
            </div>

             <div className="bg-kali-800 rounded-lg border border-kali-700 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-kali-900 text-gray-400 text-xs uppercase tracking-wider border-b border-kali-700">
                            <th className="p-4 font-medium">Session Name</th>
                            <th className="p-4 font-medium">Target</th>
                            <th className="p-4 font-medium">MITRE Technique</th>
                            <th className="p-4 font-medium">Model</th>
                            <th className="p-4 font-medium">Status</th>
                            <th className="p-4 font-medium">Last Activity</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-kali-700">
                        {sessions.map((s: PentestSession) => {
                            const mitreInfo = MITRE_DB[s.mitreId || ''];
                            return (
                            <tr 
                                key={s.id} 
                                className="hover:bg-kali-700/30 transition-colors cursor-pointer group"
                                onClick={() => navigate(`/session/${s.id}`)}
                            >
                                <td className="p-4 text-sm font-medium text-white flex items-center gap-3">
                                    <IconTerminal /> {s.name}
                                </td>
                                <td className="p-4 text-sm text-gray-300 font-mono text-xs">{s.target}</td>
                                <td className="p-4 text-sm text-gray-400 text-xs group relative">
                                    <span 
                                        className="cursor-help border-b border-dotted border-gray-600 hover:text-white transition-colors"
                                        title={s.mitreId || "No ID"}
                                    >
                                        {mitreInfo?.name || s.mitreId || "—"}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-400 text-xs">{s.model}</td>
                                <td className="p-4 text-sm">
                                    <span className={`px-2 py-1 rounded text-xs font-bold border ${
                                        s.status === SessionStatus.RUNNING ? 'bg-green-900/20 text-green-400 border-green-900 animate-pulse' : 
                                        s.status === SessionStatus.COMPLETED ? 'bg-blue-900/20 text-blue-400 border-blue-900' :
                                        'bg-gray-700 text-gray-300 border-gray-600'
                                    }`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500 text-xs font-mono">{new Date(s.lastActivity).toLocaleTimeString()}</td>
                                <td className="p-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {s.status === SessionStatus.RUNNING && (
                                        <button 
                                            type="button"
                                            className="p-1.5 rounded bg-kali-900 border border-kali-600 hover:border-red-500 hover:text-red-500 transition-colors text-gray-400"
                                            onClick={(e) => handleTerminate(e, s.id)}
                                            title="Stop Session"
                                        >
                                            <IconStop />
                                        </button>
                                    )}
                                    <button 
                                        type="button"
                                        className="p-1.5 rounded bg-kali-900 border border-kali-600 hover:border-red-500 hover:text-red-500 transition-colors text-gray-400"
                                        onClick={(e) => handleDelete(e, s.id)}
                                        title="Delete Log"
                                    >
                                        <IconTrash />
                                    </button>
                                </td>
                            </tr>
                        )})}
                         {sessions.length === 0 && (
                            <tr><td colSpan={7} className="p-8 text-center text-gray-500 italic">No active sessions. Start a new operation.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  return (
    <div className="flex h-screen bg-kali-900 text-gray-200 overflow-hidden font-sans">
      <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)} />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative"><div className="flex-1 overflow-y-auto p-6 scroll-smooth">{children}</div></main>
    </div>
  );
};

export default function App() {
  const [sessions, setSessions] = useState<PentestSession[]>(() => {
    try {
        const saved = localStorage.getItem('pentest_sessions');
        return saved ? JSON.parse(saved) : [];
    } catch (e) {
        console.error("Failed to load sessions:", e);
        return [];
    }
  });

  const [scenarios, setScenarios] = useState<AttackScenario[]>(() => {
    try {
        const saved = localStorage.getItem('pentest_scenarios');
        const savedVersion = localStorage.getItem('pentest_db_version');
        
        // Data Migration / Seeding Logic
        if (!saved || !savedVersion || parseInt(savedVersion) < DB_VERSION) {
            console.log("Migrating Scenarios DB...");
            const currentScenarios = saved ? JSON.parse(saved) : [];
            const merged = [...currentScenarios];
            
            DEFAULT_SCENARIOS.forEach(def => {
                const idx = merged.findIndex(s => s.id === def.id);
                if (idx >= 0) {
                    merged[idx] = def;
                } else {
                    merged.push(def);
                }
            });
            return merged;
        }
        return JSON.parse(saved);
    } catch (e) {
        console.error("Failed to load scenarios:", e);
        return DEFAULT_SCENARIOS;
    }
  });

  const [settings, setSettings] = useState<PlatformSettings>(() => {
    try {
        const saved = localStorage.getItem('pentest_settings');
        return saved ? JSON.parse(saved) : { 
            gemini: { enabled: true }, 
            claude: { enabled: false, apiKey: '' }, 
            general: { userName: 'root', shell: 'zsh' } 
        };
    } catch (e) {
        return { gemini: { enabled: true }, claude: { enabled: false, apiKey: '' }, general: { userName: 'root', shell: 'zsh' } };
    }
  });

  const [streamingSessionId, setStreamingSessionId] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Persistence Effects
  useEffect(() => { 
      try {
        localStorage.setItem('pentest_sessions', JSON.stringify(sessions)); 
      } catch (e) { console.error("Quota Exceeded", e); }
  }, [sessions]);

  useEffect(() => { 
      try {
        localStorage.setItem('pentest_scenarios', JSON.stringify(scenarios)); 
        localStorage.setItem('pentest_db_version', DB_VERSION.toString());
      } catch (e) { console.error("Quota Exceeded", e); }
  }, [scenarios]);

  useEffect(() => { 
      try {
        localStorage.setItem('pentest_settings', JSON.stringify(settings)); 
      } catch (e) { console.error("Quota Exceeded", e); }
  }, [settings]);

  const handleFactoryReset = () => {
      if(window.confirm("WARNING: This will delete ALL sessions, custom scenarios, and settings. Are you sure?")) {
          localStorage.clear();
          window.location.reload();
      }
  }

  const addScenario = (scenario: AttackScenario) => {
    setScenarios(prev => [...prev, scenario]);
  };

  const updateScenario = (updated: AttackScenario) => {
    setScenarios(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const deleteScenario = (id: string) => {
    if (window.confirm("Are you sure you want to delete this scenario?")) {
        setScenarios(prev => prev.filter(s => s.id !== id));
    }
  };

  const deleteSession = (id: string) => {
    if (streamingSessionId === id && abortControllerRef.current) {
        abortControllerRef.current.abort();
        setStreamingSessionId(null);
    }
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const terminateSession = (id: string) => {
    if (streamingSessionId === id && abortControllerRef.current) {
        abortControllerRef.current.abort();
        setStreamingSessionId(null);
    }
    setSessions(prev => prev.map(s => s.id === id ? {...s, status: SessionStatus.COMPLETED} : s));
  };

  const createSession = (data: CreateSessionDTO) => {
    const newSession: PentestSession = { 
        id: uuidv4(), 
        ...data, 
        status: SessionStatus.RUNNING, 
        createdAt: Date.now(), 
        lastActivity: Date.now(), 
        logs: [], 
        artifacts: [],
        reports: []
    };
    setSessions(prev => [newSession, ...prev]);
    return newSession.id;
  };

  const handleRunScenario = (data: CreateSessionDTO) => {
      // Just a placeholder, actually handled by navigate in wrapper
  };

  const handleInterrupt = (sessionId: string) => {
     if (streamingSessionId === sessionId && abortControllerRef.current) {
         abortControllerRef.current.abort();
     }
  };

  const handleGenerateReport = async (sessionId: string, type: ReportType) => {
      const session = sessions.find(s => s.id === sessionId);
      if (!session) return;

      const reportContent = await generateReport(
          session.model,
          type,
          { target: session.target, objective: session.objective },
          session.artifacts,
          session.logs
      );

      const newReport: any = {
          id: uuidv4(),
          title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report - ${session.target}`,
          type: type,
          content: reportContent,
          createdAt: Date.now(),
          generatedBy: 'Impetus2AI Auto-Auditor'
      };

      setSessions(prev => prev.map(s => 
          s.id === sessionId ? { ...s, reports: [newReport, ...(s.reports || [])] } : s
      ));
  };

  const handleDeleteReport = (sessionId: string, reportId: string) => {
      if(window.confirm("Delete this report?")) {
        setSessions(prev => prev.map(s => 
            s.id === sessionId ? { ...s, reports: s.reports.filter(r => r.id !== reportId) } : s
        ));
      }
  };

  const handleSendMessage = async (sessionId: string, text: string, hidden = false) => {
    const session = sessions.find(s => s.id === sessionId);
    if (!session) return;

    if (!hidden) {
        const userLog: LogEntry = { id: uuidv4(), timestamp: Date.now(), sender: 'user', content: text };
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, logs: [...s.logs, userLog] } : s));
    } else {
        const sysLog: LogEntry = { id: uuidv4(), timestamp: Date.now(), sender: 'system', content: text };
        setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, logs: [...s.logs, sysLog] } : s));
    }

    setStreamingSessionId(sessionId);
    abortControllerRef.current = new AbortController();

    try {
        const currentLogs = [...session.logs];
        if (!hidden) currentLogs.push({ id: 'temp', timestamp: Date.now(), sender: 'user', content: text });
        else currentLogs.push({ id: 'temp', timestamp: Date.now(), sender: 'system', content: text });

        const stream = streamPentestResponse(
            session.model, 
            currentLogs, 
            text, 
            { target: session.target, objective: session.objective },
            settings,
            session.customSystemPrompt,
            abortControllerRef.current.signal
        );

        let agentResponse = "";
        let agentLogId = uuidv4();
        
        setSessions(prev => prev.map(s => {
            if (s.id !== sessionId) return s;
            return {
                ...s,
                logs: [...s.logs, { id: agentLogId, timestamp: Date.now(), sender: 'agent', content: '' }]
            };
        }));

        for await (const chunk of stream) {
            agentResponse += chunk;
            setSessions(prev => prev.map(s => {
                if (s.id !== sessionId) return s;
                return {
                    ...s,
                    lastActivity: Date.now(),
                    logs: s.logs.map(l => l.id === agentLogId ? { ...l, content: agentResponse } : l)
                };
            }));
        }

        const artifactRegex = /```(?:(\w+)\s*:\s*)?([\w\.-]+)\s*\n([\s\S]*?)```/g;
        let match;
        const newArtifacts: PentestArtifact[] = [];
        
        while ((match = artifactRegex.exec(agentResponse)) !== null) {
            const fileType = match[1] || 'text'; 
            const filename = match[2]; 
            const content = match[3];  
            
            newArtifacts.push({
                id: uuidv4(),
                filename: filename.trim(),
                type: fileType.trim(),
                content: content.trim(),
                createdAt: Date.now(),
                size: new Blob([content]).size
            });
        }

        if (newArtifacts.length > 0) {
             setSessions(prev => prev.map(s => {
                if (s.id !== sessionId) return s;
                const existingNames = new Set(s.artifacts.map(a => a.filename));
                const uniqueNew = newArtifacts.filter(a => !existingNames.has(a.filename));
                return { ...s, artifacts: [...s.artifacts, ...uniqueNew] };
            }));
        }

    } catch (e: any) {
        if (e.message !== "ABORTED") {
            const errorLog: LogEntry = { id: uuidv4(), timestamp: Date.now(), sender: 'system', content: `Error: ${e.message}`, isError: true };
            setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, logs: [...s.logs, errorLog] } : s));
        }
    } finally {
        setStreamingSessionId(prevId => prevId === sessionId ? null : prevId);
        abortControllerRef.current = null;
    }
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard sessions={sessions} />} />
          <Route path="/sessions" element={<SessionManager sessions={sessions} onDelete={deleteSession} onTerminate={terminateSession} />} />
          <Route path="/create" element={<CreateSessionLogic onCreate={createSession} />} />
          <Route path="/scenarios" element={<ScenarioLogic scenarios={scenarios} onAdd={addScenario} onUpdate={updateScenario} onDelete={deleteScenario} />} />
          <Route path="/settings" element={<Settings currentSettings={settings} onSave={setSettings} onReset={handleFactoryReset} />} />
          <Route path="/session/:id" element={
            <SessionLogic 
                sessions={sessions} 
                onSendMessage={handleSendMessage} 
                onTerminate={terminateSession} 
                streamingSessionId={streamingSessionId} 
                settings={settings} 
                onInterrupt={handleInterrupt}
                onGenerateReport={handleGenerateReport}
                onDeleteReport={handleDeleteReport}
            />
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

const ScenarioLogic = ({ scenarios, onAdd, onUpdate, onDelete }: any) => { 
    const navigate = useNavigate();
    const handleRun = (data: CreateSessionDTO) => {
        navigate('/create', { state: { initialData: data } });
    };

    return <AttackScenariosView scenarios={scenarios} onAdd={onAdd} onUpdate={onUpdate} onDelete={onDelete} onRun={handleRun} />; 
};

const CreateSessionLogic = ({ onCreate }: any) => { 
    const navigate = useNavigate(); 
    const location = useLocation();
    const initialData = location.state?.initialData;

    return <CreateSessionView initialData={initialData} onCreate={(d:any) => { const id = onCreate(d); navigate(`/session/${id}`); }} />; 
}

const SessionLogic = ({ sessions, onSendMessage, onTerminate, streamingSessionId, settings, onInterrupt, onGenerateReport, onDeleteReport }: any) => {
  const { id } = useParams();
  const session = sessions.find((s: any) => s.id === id);
  if (!session) return <Navigate to="/" replace />;
  return <SessionView 
    session={session} 
    onSendMessage={onSendMessage} 
    onTerminate={onTerminate} 
    isStreaming={streamingSessionId === session.id} 
    settings={settings} 
    onInterrupt={onInterrupt}
    onGenerateReport={onGenerateReport}
    onDeleteReport={onDeleteReport}
  />;
}
