
import React, { useState } from 'react';

const IconBookOpen = () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
const IconChevronRight = () => <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>;
const IconImage = () => <svg className="w-8 h-8 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const IconLightBulb = () => <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>;

const DocImage = ({ caption, alt }: { caption: string, alt: string }) => (
  <div className="my-6 border border-kali-700 rounded-lg bg-kali-900/50 overflow-hidden group">
    <div className="aspect-video w-full flex flex-col items-center justify-center bg-gray-900 text-gray-600 group-hover:bg-gray-800 transition-colors">
      <IconImage />
      <span className="mt-2 text-xs font-mono">{alt} [Screenshot Placeholder]</span>
    </div>
    <div className="p-2 bg-kali-800 border-t border-kali-700 text-xs text-center text-gray-400 italic">
      {caption}
    </div>
  </div>
);

const ProTip = ({ children }: { children?: React.ReactNode }) => (
  <div className="my-4 p-4 bg-yellow-900/10 border border-yellow-900/30 rounded-lg flex gap-3">
    <div className="shrink-0 mt-0.5"><IconLightBulb /></div>
    <div className="text-sm text-gray-300">{children}</div>
  </div>
);

export const Documentation = () => {
  const [activeSection, setActiveSection] = useState('intro');

  const sections = [
    { id: 'intro', title: 'Introduction' },
    { id: 'config', title: 'Configuration & Setup' },
    { id: 'scenarios', title: 'Running Attack Scenarios' },
    { id: 'manual', title: 'Manual & Auto-Pilot Sessions' },
    { id: 'artifacts', title: 'Artifacts & Analysis' },
    { id: 'reporting', title: 'Reporting Engine' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'intro':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h1 className="text-3xl font-bold text-white mb-4">Welcome to Impetus2AI</h1>
            <p className="text-gray-300 leading-relaxed text-lg">
              Impetus2AI is a comprehensive, AI-powered security platform designed to streamline the penetration testing lifecycle. 
              By simulating a high-fidelity <strong>Kali Linux environment</strong>, it allows security professionals to execute autonomous audits, 
              generate scripts on the fly, and produce industry-standard reports.
            </p>
            
            <DocImage 
              alt="Dashboard Overview" 
              caption="Fig 1: The Impetus2AI Dashboard provides a high-level view of cluster health and active operations." 
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="p-6 bg-kali-800 border border-kali-700 rounded-xl">
                <h3 className="font-bold text-kali-accent text-lg mb-2">🚀 Autonomous Agents</h3>
                <p className="text-sm text-gray-400">
                  Assign high-level objectives (e.g., "Map the network and identify weak ciphers") and watch the agent plan and execute tools automatically.
                </p>
              </div>
              <div className="p-6 bg-kali-800 border border-kali-700 rounded-xl">
                <h3 className="font-bold text-kali-accent text-lg mb-2">🛡️ MITRE Integration</h3>
                <p className="text-sm text-gray-400">
                  Every operation is mapped to the MITRE ATT&CK framework, allowing you to visualize coverage across Tactics and Techniques.
                </p>
              </div>
            </div>
          </div>
        );

      case 'config':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h1 className="text-3xl font-bold text-white mb-6">Configuration & Setup</h1>
            <p className="text-gray-300">
              Before running your first scan, you must configure the AI service providers. Impetus2AI connects directly to these APIs from your browser.
            </p>

            <h3 className="text-xl font-bold text-white mt-8 border-b border-kali-700 pb-2">1. API Key Management</h3>
            <p className="text-gray-300 mt-2">
              Navigate to the <strong>Settings</strong> page via the sidebar.
            </p>
            <DocImage 
              alt="Settings Page" 
              caption="Fig 2: The Settings interface allows you to toggle service providers and manage API keys." 
            />
            
            <div className="space-y-4 ml-4 mt-4">
              <div>
                <strong className="text-white block">Gemini CLI (Required)</strong>
                <p className="text-sm text-gray-400">
                  Used for general reasoning and standard scans. Ensure your environment has the `API_KEY` set, or the platform acts in read-only mode.
                  Click <strong>Test Connection</strong> to verify access.
                </p>
              </div>
              <div>
                <strong className="text-white block">Claude Code (Optional)</strong>
                <p className="text-sm text-gray-400">
                  Enable this for advanced coding tasks or complex script generation. Toggle the switch and paste your `sk-ant-...` key.
                </p>
              </div>
            </div>

            <ProTip>
              <strong>Security Note:</strong> Your API keys are stored in your browser's Local Storage. They are never sent to a third-party server, only directly to Google/Anthropic APIs.
            </ProTip>

            <h3 className="text-xl font-bold text-white mt-8 border-b border-kali-700 pb-2">2. Environment Customization</h3>
            <p className="text-gray-300 mt-2">
              You can customize the simulated environment variables:
            </p>
            <ul className="list-disc list-inside text-gray-400 ml-4 space-y-1">
              <li><strong>User:</strong> Defaults to `root`, but can be changed to `kali` or `analyst`.</li>
              <li><strong>Shell:</strong> Choose between `/bin/zsh` (default) or `/bin/bash`.</li>
            </ul>
          </div>
        );

      case 'scenarios':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h1 className="text-3xl font-bold text-white mb-6">Running Attack Scenarios</h1>
            <p className="text-gray-300">
              The <strong>Attack Scenarios</strong> library is the fastest way to start an engagement. It contains pre-configured templates mapped to real-world attack vectors.
            </p>

            <DocImage 
              alt="Attack Scenarios Library" 
              caption="Fig 3: The Scenario Library showing MITRE Tactic/Technique mapping and difficulty levels." 
            />

            <h3 className="text-xl font-bold text-white mt-8">Walkthrough: Launching a Scan</h3>
            <ol className="list-decimal list-inside space-y-4 ml-4 text-gray-300">
              <li className="pl-2">
                <strong>Select a Scenario:</strong> Identify a template that matches your goal (e.g., <em>"Full Stack Network Reconnaissance"</em>).
              </li>
              <li className="pl-2">
                <strong>Review Details:</strong> Hover over the <strong>MITRE ID</strong> (e.g., T1595) to confirm the specific technique (Active Scanning). Check the tool list to ensure you have coverage.
              </li>
              <li className="pl-2">
                <strong>Click Run:</strong> Click the <span className="inline-block px-2 py-0.5 bg-kali-accent text-black text-xs font-bold rounded">▶ Run</span> button.
              </li>
              <li className="pl-2">
                <strong>Configure Scope:</strong> You will be redirected to the Session Creator. The Objective is pre-filled. simply enter your **Target** (e.g., `10.10.10.5`).
              </li>
              <li className="pl-2">
                <strong>Deploy:</strong> Click <strong>Deploy Session Container</strong>. The terminal will boot, and the agent will immediately begin executing the scenario's initial prompt.
              </li>
            </ol>
          </div>
        );

      case 'manual':
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <h1 className="text-3xl font-bold text-white mb-6">Manual & Auto-Pilot Sessions</h1>
             <p className="text-gray-300">
               Once a session is live, you have two modes of interaction within the Terminal Console.
             </p>

             <DocImage 
               alt="Terminal Console View" 
               caption="Fig 4: The Live Console showing the AI Agent's 'Thinking' process and command execution." 
             />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
               <div>
                 <h3 className="text-lg font-bold text-white mb-2">Mode A: Console (Manual)</h3>
                 <p className="text-sm text-gray-400 mb-4">
                   Interact just like a standard SSH session.
                 </p>
                 <div className="bg-black/50 p-3 rounded font-mono text-xs text-gray-300 border border-gray-700">
                   <span className="text-kali-accent">root@impetus2ai:~#</span> nmap -F 192.168.1.1<br/>
                   <span className="text-gray-500">... [AI Simulates Output] ...</span>
                 </div>
               </div>
               <div>
                 <h3 className="text-lg font-bold text-white mb-2">Mode B: Auto-Pilot</h3>
                 <p className="text-sm text-gray-400 mb-4">
                   The Agent acts autonomously based on the Mission Objective.
                 </p>
                 <div className="bg-black/50 p-3 rounded font-mono text-xs text-gray-300 border border-gray-700">
                    <span className="text-blue-400 italic">Agent Process &gt; THOUGHT:</span><br/>
                    I need to identify the OS version.<br/>
                    <span className="text-kali-accent">root@impetus2ai:~#</span> cat /etc/os-release
                 </div>
               </div>
             </div>

             <h3 className="text-xl font-bold text-white mt-8">Monitoring Progress</h3>
             <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
               <li><strong>Stop Session:</strong> Click the red "Stop" button in the header to kill the container. This creates a final log entry.</li>
               <li><strong>System Monitor:</strong> Click "Monitor" to see simulated CPU/RAM usage and verify the `claude-code` or `gemini-cli` daemons are active.</li>
             </ul>
          </div>
        );

      case 'artifacts':
         return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <h1 className="text-3xl font-bold text-white mb-6">Artifacts & Data Analysis</h1>
             <p className="text-gray-300">
               Standard LLM chats lose data in the scrollback. Impetus2AI captures every tool output as a discrete file.
             </p>

             <DocImage 
               alt="Artifacts Explorer" 
               caption="Fig 5: The Artifacts tab showing a list of captured files and a syntax-highlighted preview." 
             />

             <h3 className="text-xl font-bold text-white mt-8">How it works</h3>
             <ol className="list-decimal list-inside space-y-3 ml-4 text-gray-300">
               <li>When a tool runs (e.g., `nmap`), the output is captured.</li>
               <li>The system detects the content type and assigns a filename (e.g., `scan_results.txt`).</li>
               <li>Navigate to the <strong>Artifacts</strong> tab to view the list.</li>
             </ol>

             <ProTip>
               Use the <strong>Save Local</strong> button in the preview pane to download critical scripts (like generated Python exploits) directly to your machine for testing in a real lab.
             </ProTip>
          </div>
        );

       case 'reporting':
         return (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
             <h1 className="text-3xl font-bold text-white mb-6">Reporting Engine</h1>
             <p className="text-gray-300">
               The final step of any engagement is the report. Impetus2AI uses a dedicated "Auditor" persona (Gemini Pro) to synthesize logs and artifacts into a professional document.
             </p>

             <DocImage 
               alt="Report Generator" 
               caption="Fig 6: The Reporting interface showing the generated Markdown document." 
             />

             <h3 className="text-xl font-bold text-white mt-8">Report Types</h3>
             <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4 py-1">
                  <strong className="text-white block">Executive Summary</strong>
                  <span className="text-sm text-gray-400">Non-technical. Focuses on risk scores, business impact, and strategic recommendations.</span>
                </div>
                <div className="border-l-4 border-purple-500 pl-4 py-1">
                  <strong className="text-white block">Technical Analysis</strong>
                  <span className="text-sm text-gray-400">Deep dive. Includes reproduction steps, raw evidence snippets, and code-level remediation.</span>
                </div>
                <div className="border-l-4 border-kali-accent pl-4 py-1">
                  <strong className="text-white block">Full Audit Report</strong>
                  <span className="text-sm text-gray-400">Combines both perspectives into a comprehensive deliverable.</span>
                </div>
             </div>

             <h3 className="text-xl font-bold text-white mt-8">Generating a Report</h3>
             <p className="text-gray-300">
               1. Go to the <strong>Reports</strong> tab in your active session.<br/>
               2. Click the button for the type of report you need.<br/>
               3. Wait for the "Auditor" agent to process the session logs.<br/>
               4. Preview the Markdown and click <span className="inline-block px-1 py-0.5 bg-gray-700 rounded text-xs">Download</span> to save as `.md`.
             </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-kali-900 text-gray-200 overflow-hidden">
      {/* Doc Sidebar */}
      <div className="w-64 bg-kali-800 border-r border-kali-700 flex flex-col p-6 overflow-y-auto">
        <div className="flex items-center gap-2 mb-8 text-white font-bold text-lg select-none">
          <IconBookOpen />
          <span>Documentation</span>
        </div>
        <nav className="space-y-1">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all ${
                activeSection === section.id 
                  ? 'bg-kali-700 text-kali-accent font-medium shadow-sm' 
                  : 'text-gray-400 hover:text-white hover:bg-kali-700/50'
              }`}
            >
              <span>{section.title}</span>
              {activeSection === section.id && <IconChevronRight />}
            </button>
          ))}
        </nav>
        <div className="mt-auto pt-6 border-t border-kali-700">
            <p className="text-xs text-gray-500 font-mono">
                Impetus2AI Docs v1.0<br/>
                Updated: April 2025
            </p>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto bg-[#0f0f12]">
        <div className="max-w-4xl mx-auto px-12 py-12">
           {renderContent()}
        </div>
      </div>
    </div>
  );
};
    