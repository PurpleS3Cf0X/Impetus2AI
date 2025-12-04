
import React, { useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { Link } from 'react-router-dom';
import { PentestSession, PentestReport } from '../types';
import { Button } from './Button';

interface ReportsManagerProps {
  sessions: PentestSession[];
  onDelete: (sessionId: string, reportId: string) => void;
}

// Extended interface for the table view
interface EnrichedReport extends PentestReport {
  sessionId: string;
  sessionName: string;
  sessionTarget: string;
}

const IconDocumentList = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconEye = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const IconDownload = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const IconTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconSearch = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;
const IconX = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const IconExternal = () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;

export const ReportsManager: React.FC<ReportsManagerProps> = ({ sessions, onDelete }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReport, setSelectedReport] = useState<EnrichedReport | null>(null);

  // Flatten reports from all sessions into a single list
  const allReports: EnrichedReport[] = useMemo(() => {
    return sessions.flatMap(session => 
      (session.reports || []).map(report => ({
        ...report,
        sessionId: session.id,
        sessionName: session.name,
        sessionTarget: session.target
      }))
    ).sort((a, b) => b.createdAt - a.createdAt);
  }, [sessions]);

  // Filter based on search
  const filteredReports = useMemo(() => {
    if (!searchQuery.trim()) return allReports;
    const q = searchQuery.toLowerCase();
    return allReports.filter(r => 
      r.title.toLowerCase().includes(q) ||
      r.sessionName.toLowerCase().includes(q) ||
      r.sessionTarget.toLowerCase().includes(q) ||
      r.type.toLowerCase().includes(q)
    );
  }, [allReports, searchQuery]);

  const handleDownload = (report: EnrichedReport) => {
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.title.replace(/\s+/g, '_')}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (report: EnrichedReport) => {
    if (window.confirm(`Are you sure you want to delete report: "${report.title}"?`)) {
        onDelete(report.sessionId, report.id);
        if (selectedReport?.id === report.id) {
            setSelectedReport(null);
        }
    }
  };

  return (
    <div className="flex h-screen bg-kali-900 overflow-hidden relative">
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${selectedReport ? 'mr-[500px]' : ''}`}>
        
        {/* Header */}
        <div className="p-8 pb-4">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                <IconDocumentList /> Reports Library
              </h1>
              <p className="text-gray-400 mt-2">Centralized archive of all security audit reports generated across operations.</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="bg-kali-800 p-4 rounded-t-xl border border-kali-700 border-b-0 flex justify-between items-center">
             <div className="relative w-96">
                <input 
                  type="text" 
                  placeholder="Search reports by title, target, or session..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-kali-900 border border-kali-600 rounded-md py-2 pl-10 pr-4 text-sm text-white focus:border-kali-accent outline-none"
                />
                <div className="absolute left-3 top-2.5 text-gray-500">
                  <IconSearch />
                </div>
             </div>
             <div className="text-xs text-gray-400">
               Showing <span className="text-white font-bold">{filteredReports.length}</span> documents
             </div>
          </div>

          {/* Table */}
          <div className="bg-kali-800 rounded-b-xl border border-kali-700 overflow-hidden shadow-xl">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-kali-900 text-gray-400 text-xs uppercase tracking-wider border-b border-kali-700">
                   <th className="p-4 font-medium">Report Title</th>
                   <th className="p-4 font-medium">Context (Session)</th>
                   <th className="p-4 font-medium">Type</th>
                   <th className="p-4 font-medium">Generated Date</th>
                   <th className="p-4 font-medium text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-kali-700">
                 {filteredReports.map(report => (
                   <tr key={report.id} className="hover:bg-kali-700/30 transition-colors group">
                     <td className="p-4">
                       <div className="text-sm font-medium text-white">{report.title}</div>
                       <div className="text-xs text-gray-500 font-mono mt-0.5">ID: {report.id.substring(0,8)}</div>
                     </td>
                     <td className="p-4">
                        <Link to={`/session/${report.sessionId}`} className="group/link flex items-center gap-1 text-sm text-kali-secondary hover:underline">
                            {report.sessionName} <IconExternal />
                        </Link>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{report.sessionTarget}</div>
                     </td>
                     <td className="p-4">
                       <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide border ${
                         report.type === 'executive' ? 'bg-blue-900/20 text-blue-300 border-blue-900' :
                         report.type === 'technical' ? 'bg-purple-900/20 text-purple-300 border-purple-900' :
                         'bg-kali-accent/10 text-kali-accent border-kali-accent/30'
                       }`}>
                         {report.type}
                       </span>
                     </td>
                     <td className="p-4 text-sm text-gray-400 font-mono">
                       {new Date(report.createdAt).toLocaleDateString()} <span className="text-gray-600">|</span> {new Date(report.createdAt).toLocaleTimeString()}
                     </td>
                     <td className="p-4 text-right">
                       <div className="flex justify-end gap-2">
                         <Button size="sm" variant="secondary" onClick={() => setSelectedReport(report)} title="Preview Report">
                           <IconEye />
                         </Button>
                         <Button size="sm" variant="ghost" onClick={() => handleDownload(report)} title="Download Markdown">
                           <IconDownload />
                         </Button>
                         <Button size="sm" variant="danger" onClick={() => handleDelete(report)} title="Delete Report">
                           <IconTrash />
                         </Button>
                       </div>
                     </td>
                   </tr>
                 ))}
                 {filteredReports.length === 0 && (
                   <tr>
                     <td colSpan={5} className="p-12 text-center text-gray-500 italic">
                       No reports found matching your criteria.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>
      </div>

      {/* Preview Drawer (Slide-over) */}
      <div className={`fixed inset-y-0 right-0 w-[500px] bg-kali-900 border-l border-kali-700 shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col ${selectedReport ? 'translate-x-0' : 'translate-x-full'}`}>
        {selectedReport && (
          <>
            <div className="flex items-center justify-between p-4 border-b border-kali-700 bg-kali-800">
               <div>
                  <h3 className="text-lg font-bold text-white truncate w-80">{selectedReport.title}</h3>
                  <div className="text-xs text-gray-400 font-mono">Session: {selectedReport.sessionName}</div>
               </div>
               <button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-white transition-colors">
                 <IconX />
               </button>
            </div>
            
            <div className="p-3 bg-kali-800 border-b border-kali-700 flex justify-end gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleDownload(selectedReport)}>
                   <IconDownload /> Download
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(selectedReport)}>
                   <IconTrash /> Delete
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-[#0f0f12] prose prose-invert prose-sm max-w-none">
               <ReactMarkdown>{selectedReport.content}</ReactMarkdown>
            </div>
          </>
        )}
      </div>
      
      {/* Overlay for drawer */}
      {selectedReport && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity" 
          onClick={() => setSelectedReport(null)} 
          style={{ marginRight: '500px' }} // Don't cover the drawer itself logic, but usually overlay is behind
        />
      )}
    </div>
  );
};
