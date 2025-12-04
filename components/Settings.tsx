
import React, { useState, useEffect } from 'react';
import { PlatformSettings } from '../types';
import { Button } from './Button';

interface SettingsProps {
  currentSettings: PlatformSettings;
  onSave: (settings: PlatformSettings) => void;
  onReset: () => void;
}

const IconShield = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>;
const IconKey = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 11 9 13.536 9 15H7v2H5v2H3v-2a4 4 0 014-4l2.536-2.536a6 6 0 016-6zM16 15a6 6 0 110-12 6 6 0 010 12z" /></svg>;
const IconTerminal = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconExternal = () => <svg className="w-3 h-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>;
const IconTrash = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;
const IconRefresh = () => <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>;
const IconCheckCircle = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const IconXCircle = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

export const Settings: React.FC<SettingsProps> = ({ currentSettings, onSave, onReset }) => {
  const [formData, setFormData] = useState<PlatformSettings>(currentSettings);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    gemini: 'idle' | 'testing' | 'success' | 'error';
    claude: 'idle' | 'testing' | 'success' | 'error';
  }>({ gemini: 'idle', claude: 'idle' });

  useEffect(() => {
    setFormData(currentSettings);
  }, [currentSettings]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const testGeminiConnection = () => {
    setConnectionStatus(prev => ({ ...prev, gemini: 'testing' }));
    // Simulate API check
    setTimeout(() => {
      const hasKey = !!process.env.API_KEY;
      setConnectionStatus(prev => ({ ...prev, gemini: hasKey ? 'success' : 'error' }));
    }, 1500);
  };

  const testClaudeConnection = () => {
    setConnectionStatus(prev => ({ ...prev, claude: 'testing' }));
    // Simulate API check
    setTimeout(() => {
      const hasKey = formData.claude.enabled && !!formData.claude.apiKey && formData.claude.apiKey.length > 5;
      setConnectionStatus(prev => ({ ...prev, claude: hasKey ? 'success' : 'error' }));
    }, 1500);
  };

  const getStatusBadge = (status: 'idle' | 'testing' | 'success' | 'error', defaultText = 'Unknown') => {
    if (status === 'testing') {
        return <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 text-xs rounded border border-yellow-900 flex items-center gap-1"><IconRefresh /> Testing...</span>;
    }
    if (status === 'success') {
        return <span className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded border border-green-900 flex items-center gap-1"><IconCheckCircle /> Connected</span>;
    }
    if (status === 'error') {
        return <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded border border-red-900 flex items-center gap-1"><IconXCircle /> Disconnected</span>;
    }
    // Default/Idle state - check actual data to guess status
    return <span className="px-2 py-1 bg-gray-800 text-gray-400 text-xs rounded border border-gray-700">{defaultText}</span>;
  };

  return (
    <div className="max-w-4xl mx-auto mt-8 p-4 md:p-1 pb-16">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <IconShield />
          Platform Configuration
        </h2>
        <p className="text-gray-400 mt-2">Manage service authentication and environment variables for your pentest sessions.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Service Authentication Section */}
        <div className="bg-kali-800 rounded-xl border border-kali-700 overflow-hidden">
          <div className="px-6 py-4 bg-kali-900 border-b border-kali-700 flex justify-between items-center">
            <h3 className="font-bold text-kali-accent flex items-center gap-2">
              <IconKey />
              Service Authentication
            </h3>
            <span className="text-xs text-gray-500">Global Config</span>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Gemini Config */}
            <div className="flex items-start gap-4 pb-6 border-b border-kali-700">
              <div className="w-12 h-12 rounded-lg bg-blue-900/30 flex items-center justify-center border border-blue-500/30">
                <span className="text-blue-400 font-bold text-lg">G</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-medium">Gemini CLI</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Integrates the <code className="bg-kali-900 px-1 py-0.5 rounded text-xs">gemini</code> command line tool for rapid analysis and scripting.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                     {connectionStatus.gemini === 'idle' ? getStatusBadge('success', 'Connected') : getStatusBadge(connectionStatus.gemini)}
                  </div>
                </div>
                <div className="mt-4 p-4 bg-kali-900 rounded border border-kali-700">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-mono text-xs text-gray-500">ENV_VAR: GOOGLE_API_KEY</span>
                    <div className="flex items-center gap-2">
                         <button 
                            type="button" 
                            onClick={testGeminiConnection} 
                            disabled={connectionStatus.gemini === 'testing'}
                            className="text-xs bg-kali-800 hover:bg-kali-700 border border-kali-600 text-gray-300 px-2 py-1 rounded transition-colors flex items-center gap-1"
                         >
                            <IconRefresh /> Test Connection
                         </button>
                         <a href="https://geminicli.com/" target="_blank" rel="noreferrer" className="text-xs text-kali-secondary hover:underline flex items-center">
                           Gemini CLI Docs <IconExternal />
                         </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-gray-300">
                    <div className={`w-2 h-2 rounded-full ${process.env.API_KEY ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span>Key present in environment (process.env.API_KEY)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Claude Config */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-900/30 flex items-center justify-center border border-purple-500/30">
                <span className="text-purple-400 font-bold text-lg">C</span>
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-medium">Claude Code</h4>
                    <p className="text-sm text-gray-400 mt-1">
                      Enable <code className="bg-kali-900 px-1 py-0.5 rounded text-xs">claude</code>, an agentic coding tool that lives in your terminal.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {connectionStatus.claude !== 'idle' && getStatusBadge(connectionStatus.claude)}
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={formData.claude.enabled}
                        onChange={(e) => setFormData({...formData, claude: {...formData.claude, enabled: e.target.checked}})}
                        />
                        <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                
                {formData.claude.enabled && (
                  <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-medium text-gray-400">
                        ANTHROPIC_API_KEY
                      </label>
                      <div className="flex items-center gap-2">
                          <button 
                            type="button" 
                            onClick={testClaudeConnection} 
                            disabled={connectionStatus.claude === 'testing'}
                            className="text-xs bg-kali-800 hover:bg-kali-700 border border-kali-600 text-gray-300 px-2 py-1 rounded transition-colors flex items-center gap-1"
                         >
                            <IconRefresh /> Test Connection
                         </button>
                         <a href="https://www.claude.com/product/claude-code" target="_blank" rel="noreferrer" className="text-xs text-kali-secondary hover:underline flex items-center">
                            Claude Code Docs <IconExternal />
                         </a>
                      </div>
                    </div>
                    <div className="relative">
                      <input 
                        type={showKey ? "text" : "password"}
                        value={formData.claude.apiKey}
                        onChange={(e) => setFormData({...formData, claude: {...formData.claude, apiKey: e.target.value}})}
                        className="w-full bg-kali-900 border border-kali-600 rounded px-3 py-2 text-sm text-white focus:border-purple-500 outline-none placeholder-gray-600"
                        placeholder="sk-ant-..."
                      />
                      <button
                        type="button"
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-3 top-2.5 text-xs text-gray-500 hover:text-white"
                      >
                        {showKey ? "HIDE" : "SHOW"}
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-500 mt-1 border-l-2 border-purple-500/50 pl-2">
                      Required for the agentic loop simulation. This key is used to authenticate the simulated `claude` command.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Environment Config */}
        <div className="bg-kali-800 rounded-xl border border-kali-700 overflow-hidden">
          <div className="px-6 py-4 bg-kali-900 border-b border-kali-700">
            <h3 className="font-bold text-kali-accent flex items-center gap-2">
              <IconTerminal />
              Environment Variables
            </h3>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Default User</label>
              <input 
                type="text"
                value={formData.general.userName}
                onChange={(e) => setFormData({...formData, general: {...formData.general, userName: e.target.value}})}
                className="w-full bg-kali-900 border border-kali-600 rounded px-3 py-2 text-sm text-white focus:border-kali-accent outline-none"
              />
              <p className="text-[10px] text-gray-500 mt-1">Sets the `USER` env var in the container.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Preferred Shell</label>
              <select 
                value={formData.general.shell}
                onChange={(e) => setFormData({...formData, general: {...formData.general, shell: e.target.value as 'bash'|'zsh'}})}
                className="w-full bg-kali-900 border border-kali-600 rounded px-3 py-2 text-sm text-white focus:border-kali-accent outline-none"
              >
                <option value="zsh">/bin/zsh (Default)</option>
                <option value="bash">/bin/bash</option>
              </select>
              <p className="text-[10px] text-gray-500 mt-1">Sets the `SHELL` env var.</p>
            </div>
          </div>
        </div>
        
        {/* Data Management (Danger Zone) */}
        <div className="border border-red-900/50 rounded-xl overflow-hidden bg-red-900/10">
            <div className="px-6 py-4 border-b border-red-900/50 bg-red-900/20">
                <h3 className="font-bold text-red-400 flex items-center gap-2">
                    <IconTrash /> Data Management
                </h3>
            </div>
            <div className="p-6 flex items-center justify-between">
                <div>
                    <h4 className="text-gray-200 text-sm font-medium">Factory Reset</h4>
                    <p className="text-xs text-gray-500 mt-1">Permanently deletes all sessions, logs, artifacts, and restores default scenarios.</p>
                </div>
                <Button type="button" variant="danger" onClick={onReset}>Reset Application Data</Button>
            </div>
        </div>

        <div className="flex justify-end pt-4">
           <Button type="submit" size="lg" className="min-w-[150px]">
             {isSaved ? 'Configuration Saved' : 'Save Changes'}
           </Button>
        </div>

      </form>
    </div>
  );
};
