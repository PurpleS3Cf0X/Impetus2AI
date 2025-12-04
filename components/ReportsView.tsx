
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { PentestReport, ReportType, PentestArtifact, LogEntry } from '../types';
import { Button } from './Button';

interface ReportsViewProps {
  reports: PentestReport[];
  artifacts: PentestArtifact[];
  logs: LogEntry[];
  onGenerate: (type: ReportType) => Promise<void>;
  onDelete: (id: string) => void;
}

const IconFileText = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconDownload = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const IconTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconSparkles = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 3.214L13 21l-2.286-6.857L5 12l5.714-3.214z" /></svg>;

export const ReportsView: React.FC<ReportsViewProps> = ({ reports, artifacts, logs, onGenerate, onDelete }) => {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(reports.length > 0 ? reports[0].id : null);
  const [generatingType, setGeneratingType] = useState<ReportType | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);

  const selectedReport = reports.find(r => r.id === selectedReportId);

  const handleGenerateClick = async (type: ReportType) => {
    setGeneratingType(type);
    setGenerationError(null);
    try {
      if (artifacts.length === 0 && logs.length < 5) {
          throw new Error("Not enough data. Please run some scans or generate artifacts first.");
      }
      await onGenerate(type);
      // Automatically select the new report (the parent component should update the reports prop)
    } catch (err: any) {
      setGenerationError(err.message || "Failed to generate report");
    } finally {
      setGeneratingType(null);
    }
  };

  const handleDownload = (report: PentestReport) => {
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

  // Helper to determine button state
  const isBusy = generatingType !== null;

  return (
    <div className="flex h-full bg-kali-900 border border-kali-700 rounded-lg overflow-hidden shadow-2xl">
      {/* Sidebar */}
      <div className="w-72 bg-kali-800 border-r border-kali-700 flex flex-col">
        <div className="p-4 border-b border-kali-700">
          <h3 className="text-sm font-bold text-white mb-3">Generate Report</h3>
          <div className="space-y-2">
            <Button 
                variant="secondary" 
                size="sm" 
                className="w-full justify-start gap-2" 
                onClick={() => handleGenerateClick('executive')}
                isLoading={generatingType === 'executive'}
                disabled={isBusy}
            >
                <IconSparkles /> Executive Summary
            </Button>
            <Button 
                variant="secondary" 
                size="sm" 
                className="w-full justify-start gap-2" 
                onClick={() => handleGenerateClick('technical')}
                isLoading={generatingType === 'technical'}
                disabled={isBusy}
            >
                <IconSparkles /> Technical Analysis
            </Button>
             <Button 
                variant="primary" 
                size="sm" 
                className="w-full justify-start gap-2" 
                onClick={() => handleGenerateClick('full')}
                isLoading={generatingType === 'full'}
                disabled={isBusy}
            >
                <IconSparkles /> Full Audit Report
            </Button>
          </div>
          {generationError && (
              <div className="mt-3 p-2 bg-red-900/30 border border-red-800 rounded text-red-300 text-xs">
                  {generationError}
              </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
            Available Reports
          </div>
          {reports.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500 italic">No reports generated.</div>
          ) : (
            reports.map(report => (
              <div
                key={report.id}
                onClick={() => setSelectedReportId(report.id)}
                className={`px-4 py-3 cursor-pointer border-l-2 transition-colors ${
                  selectedReportId === report.id
                    ? 'bg-kali-700 border-kali-accent'
                    : 'border-transparent hover:bg-kali-700/50'
                }`}
              >
                <div className="text-sm font-medium text-white truncate">{report.title}</div>
                <div className="flex justify-between mt-1 text-[10px] text-gray-400">
                  <span className="uppercase">{report.type}</span>
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f0f12]">
        {selectedReport ? (
          <>
            <div className="flex items-center justify-between px-6 py-3 bg-kali-800 border-b border-kali-700">
              <div>
                <h2 className="text-base font-bold text-white">{selectedReport.title}</h2>
                <div className="text-xs text-gray-400 font-mono">ID: {selectedReport.id.substring(0,8)}</div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => handleDownload(selectedReport)}>
                    <IconDownload />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => { onDelete(selectedReport.id); if (selectedReportId === selectedReport.id) setSelectedReportId(null); }}>
                    <IconTrash />
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-8 prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{selectedReport.content}</ReactMarkdown>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600">
            <IconFileText />
            <p className="mt-2 text-sm">Select or generate a report to preview.</p>
          </div>
        )}
      </div>
    </div>
  );
};
