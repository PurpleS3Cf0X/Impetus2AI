
import React, { useState, useEffect } from 'react';

export const SystemMonitor = () => {
  const [metrics, setMetrics] = useState({
    cpu: 12,
    memory: 24,
    networkIn: 0,
    networkOut: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        cpu: Math.min(100, Math.max(5, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.min(100, Math.max(20, prev.memory + (Math.random() * 5 - 2))),
        networkIn: Math.floor(Math.random() * 500),
        networkOut: Math.floor(Math.random() * 200),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const processes = [
    { pid: 1, user: 'root', cpu: 0.1, mem: 0.5, command: '/sbin/docker-init' },
    { pid: 42, user: 'root', cpu: metrics.cpu * 0.4, mem: 4.2, command: 'node /app/server.js' },
    { pid: 103, user: 'kali', cpu: metrics.cpu * 0.2, mem: 12.5, command: 'claude-code-daemon --watch' },
    { pid: 104, user: 'kali', cpu: 0.5, mem: 3.1, command: 'gemini-cli --service' },
    { pid: 442, user: 'kali', cpu: 0.0, mem: 1.2, command: '/bin/zsh' },
  ];

  return (
    <div className="bg-kali-900 border border-kali-700 rounded-lg p-4 font-mono text-xs text-gray-300 shadow-2xl mb-4 animate-in fade-in slide-in-from-top-4">
      <div className="flex items-center justify-between mb-4 border-b border-kali-700 pb-2">
        <span className="font-bold text-kali-accent">SYSTEM MONITOR - LIVE</span>
        <div className="flex gap-4">
          <span>UPTIME: 00:42:15</span>
          <span>LOAD: 0.45 0.32 0.18</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-kali-800 p-2 rounded border border-kali-700">
          <div className="text-gray-500 mb-1">CPU USAGE</div>
          <div className="text-lg font-bold text-white flex items-end gap-2">
            {metrics.cpu.toFixed(1)}%
            <div className="flex-1 h-2 bg-gray-700 rounded-sm overflow-hidden mb-1">
              <div className="h-full bg-kali-accent transition-all duration-500" style={{ width: `${metrics.cpu}%` }}></div>
            </div>
          </div>
        </div>
        <div className="bg-kali-800 p-2 rounded border border-kali-700">
          <div className="text-gray-500 mb-1">MEMORY</div>
          <div className="text-lg font-bold text-white flex items-end gap-2">
            {metrics.memory.toFixed(1)}%
            <div className="flex-1 h-2 bg-gray-700 rounded-sm overflow-hidden mb-1">
              <div className="h-full bg-purple-400 transition-all duration-500" style={{ width: `${metrics.memory}%` }}></div>
            </div>
          </div>
        </div>
        <div className="bg-kali-800 p-2 rounded border border-kali-700">
          <div className="text-gray-500 mb-1">NET I/O</div>
          <div className="text-white">
            <span className="text-green-400">↓ {metrics.networkIn} KB/s</span>
            <span className="text-blue-400 ml-2">↑ {metrics.networkOut} KB/s</span>
          </div>
        </div>
        
        {/* NEW PANEL: SERVICE HEALTH */}
        <div className="bg-kali-800 p-2 rounded border border-kali-700">
          <div className="text-gray-500 mb-1">AI SERVICE STATUS</div>
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
               <span className="text-gray-300">gemini-cli</span>
               <span className="text-[10px] text-green-400 font-bold tracking-wider">ACTIVE</span>
            </div>
             <div className="flex justify-between items-center">
               <span className="text-gray-300">claude-code</span>
               <span className="text-[10px] text-purple-400 font-bold tracking-wider">ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      <table className="w-full text-left opacity-90">
        <thead className="text-gray-500 border-b border-kali-700">
          <tr>
            <th className="pb-2">PID</th>
            <th className="pb-2">USER</th>
            <th className="pb-2">CPU%</th>
            <th className="pb-2">MEM%</th>
            <th className="pb-2">COMMAND</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-kali-800">
          {processes.map(p => (
            <tr key={p.pid} className="hover:bg-kali-800/50 transition-colors">
              <td className="py-1 text-gray-400">{p.pid}</td>
              <td className="py-1 text-gray-400">{p.user}</td>
              <td className="py-1 text-gray-300">{p.cpu.toFixed(1)}</td>
              <td className="py-1 text-gray-300">{p.mem.toFixed(1)}</td>
              <td className="py-1 text-kali-secondary">{p.command}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
