
import React, { useState, useEffect, useMemo } from 'react';
import { PentestArtifact } from '../types';

interface ArtifactsViewProps {
  artifacts: PentestArtifact[];
}

// Declare Prism global for syntax highlighting if available
declare const Prism: any;

const IconFileCode = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const IconDownload = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>;
const IconSave = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3M16 3H8a2 2 0 00-2 2v1h10V5a2 2 0 00-2-2zM9 16h6M9 12h6" /></svg>;
const IconSearch = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>;

export const ArtifactsView: React.FC<ArtifactsViewProps> = ({ artifacts }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Filter artifacts based on search query
  const filteredArtifacts = useMemo(() => {
    if (!searchQuery.trim()) return artifacts;
    const lowerQ = searchQuery.toLowerCase();
    return artifacts.filter(a => 
      a.filename.toLowerCase().includes(lowerQ) || 
      a.content.toLowerCase().includes(lowerQ)
    );
  }, [artifacts, searchQuery]);

  // Derived state for the active artifact
  const selectedArtifact = useMemo(() => 
    artifacts.find(a => a.id === selectedId) || (filteredArtifacts.length > 0 ? filteredArtifacts[0] : null),
  [artifacts, filteredArtifacts, selectedId]);

  // Update selection when list changes
  useEffect(() => {
    if (!selectedId && filteredArtifacts.length > 0) {
      setSelectedId(filteredArtifacts[0].id);
    }
  }, [filteredArtifacts, selectedId]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = (artifact: PentestArtifact) => {
    const blob = new Blob([artifact.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = artifact.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSaveToLocal = (artifact: PentestArtifact) => {
    const filename = window.prompt("Enter filename to save to local storage:", artifact.filename);
    if (filename) {
      try {
        localStorage.setItem(`pentest_artifact_${filename}`, artifact.content);
        alert(`Artifact saved successfully as 'pentest_artifact_${filename}'`);
      } catch (e) {
        console.error("Storage error", e);
        alert("Failed to save artifact to local storage. Storage might be full.");
      }
    }
  };

  // 1. Empty State (No artifacts at all)
  if (artifacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-kali-900 border border-kali-700 rounded-lg p-10 text-gray-500">
        <IconFileCode />
        <p className="mt-4 font-mono text-sm">No artifacts generated yet.</p>
        <p className="text-xs mt-2 opacity-60 text-center max-w-sm">
          Run commands that produce output (like scans, reports, or scripts) to populate this list.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-kali-900 border border-kali-700 rounded-lg overflow-hidden shadow-2xl">
      {/* Sidebar: List & Search */}
      <div className="w-64 bg-kali-800 border-r border-kali-700 flex flex-col">
        {/* Search Header */}
        <div className="p-3 border-b border-kali-700 bg-kali-800">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Filter files..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-kali-900 border border-kali-700 rounded px-3 py-1.5 pl-8 text-xs text-white focus:border-kali-accent outline-none transition-colors"
            />
            <div className="absolute left-2.5 top-1.5 text-gray-500">
              <IconSearch />
            </div>
          </div>
        </div>
        
        {/* Artifact List */}
        <div className="flex-1 overflow-y-auto">
          {filteredArtifacts.length === 0 ? (
            <div className="p-4 text-center text-xs text-gray-500 italic">
              No matching files found.
            </div>
          ) : (
            filteredArtifacts.map(artifact => (
              <div
                key={artifact.id}
                onClick={() => setSelectedId(artifact.id)}
                className={`p-3 border-b border-kali-700/50 cursor-pointer transition-colors ${
                  selectedArtifact?.id === artifact.id 
                    ? 'bg-kali-700 border-l-2 border-l-kali-accent' 
                    : 'hover:bg-kali-700/30 border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`mt-0.5 ${selectedArtifact?.id === artifact.id ? 'text-kali-accent' : 'text-kali-secondary'}`}>
                    <IconFileCode />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-200 truncate font-mono">{artifact.filename}</div>
                    <div className="flex justify-between mt-1 text-[10px] text-gray-500">
                      <span className="uppercase">{artifact.type}</span>
                      <span>{formatSize(artifact.size)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0f0f12]">
        {selectedArtifact ? (
          <>
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 bg-kali-800 border-b border-kali-700">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="text-gray-400 text-xs font-mono uppercase tracking-wider">Preview</span>
                <span className="text-gray-600 text-xs">/</span>
                <span className="text-white text-sm font-bold font-mono truncate">{selectedArtifact.filename}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button 
                  onClick={() => handleSaveToLocal(selectedArtifact)}
                  className="flex items-center gap-1.5 text-xs bg-kali-700 hover:bg-kali-600 text-white px-3 py-1.5 rounded transition-colors border border-kali-600"
                >
                  <IconSave />
                  <span className="hidden sm:inline">Save Local</span>
                </button>
                <button 
                  onClick={() => handleDownload(selectedArtifact)}
                  className="flex items-center gap-1.5 text-xs bg-kali-accent text-gray-900 hover:bg-[#33ffb3] px-3 py-1.5 rounded transition-colors font-medium"
                >
                  <IconDownload />
                  <span className="hidden sm:inline">Download</span>
                </button>
              </div>
            </div>
            
            {/* Code Content */}
            <div className="flex-1 overflow-auto p-0 relative">
              <pre className="m-0 p-4 font-mono text-xs text-gray-300 whitespace-pre-wrap break-all h-full bg-[#0f0f12]">
                {selectedArtifact.content}
              </pre>
            </div>
            
            {/* Footer Status */}
            <div className="px-4 py-1.5 bg-kali-800 border-t border-kali-700 text-[10px] text-gray-500 flex justify-between font-mono">
              <span>CREATED: {new Date(selectedArtifact.createdAt).toLocaleString()}</span>
              <span>SIZE: {selectedArtifact.size} BYTES</span>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-8 text-center">
             <div className="opacity-20 mb-4 scale-150"><IconFileCode /></div>
             <p>Select a file from the list to view details.</p>
          </div>
        )}
      </div>
    </div>
  );
};
