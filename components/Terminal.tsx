
import React, { useState, useRef, useEffect } from 'react';
import { LogEntry, SessionStatus } from '../types';

// Declare Prism global
declare const Prism: any;

interface TerminalProps {
  logs: LogEntry[];
  status: SessionStatus;
  onSendMessage: (message: string) => void;
  isStreaming: boolean;
  onInterrupt?: () => void;
}

type BlockType = 'text' | 'code' | 'thinking';

interface ParsedBlock {
  type: BlockType;
  content: string;
  language?: string;
}

// Helper to strip ANSI codes if the AI hallucinates them
const stripAnsi = (str: string) => str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');

export const Terminal: React.FC<TerminalProps> = ({ logs, status, onSendMessage, isStreaming, onInterrupt }) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const endOfLogsRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isStreaming]);

  // Focus input on click
  const handleContainerClick = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().length === 0) {
      if (status !== SessionStatus.COMPLETED && status !== SessionStatus.FAILED) {
        inputRef.current?.focus();
      }
    }
  };

  // Input Handling
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isStreaming) {
      onSendMessage(input);
      setHistory(prev => [...prev, input]);
      setHistoryIndex(-1);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Ctrl+C or Ctrl+D for Interrupt
    if ((e.ctrlKey && e.key === 'c') || (e.ctrlKey && e.key === 'd')) {
        e.preventDefault();
        if (onInterrupt) {
            onInterrupt();
        }
        if (!isStreaming) {
            // Visual cue for Ctrl+C in standard shell when not running a command
            setInput(''); 
        }
        return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(newIndex);
      setInput(history[newIndex]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0 || historyIndex === -1) return;
      const newIndex = historyIndex + 1;
      if (newIndex >= history.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(newIndex);
        setInput(history[newIndex]);
      }
    }
  };

  // Robust Content Parser
  const parseContent = (text: string): ParsedBlock[] => {
    const cleanText = stripAnsi(text);
    const blocks: ParsedBlock[] = [];
    const lines = cleanText.split('\n');
    let currentBlock: ParsedBlock | null = null;
    let inCodeBlock = false;
    let codeBlockLang = '';

    for (const line of lines) {
      // 1. Code Block Start/End
      if (line.trim().startsWith('```')) {
        if (inCodeBlock) {
          // Close code block
          if (currentBlock) blocks.push(currentBlock);
          currentBlock = null;
          inCodeBlock = false;
        } else {
          // Close previous text block if exists
          if (currentBlock) blocks.push(currentBlock);
          
          // Start code block
          const langMatch = line.trim().match(/```(\w+.*)?/);
          codeBlockLang = langMatch ? langMatch[1] || 'text' : 'text';
          // Clean the lang string (remove leading/trailing spaces)
          codeBlockLang = codeBlockLang.trim();
          
          currentBlock = { type: 'code', content: '', language: codeBlockLang };
          inCodeBlock = true;
        }
        continue;
      }

      // 2. Inside Code Block
      if (inCodeBlock && currentBlock) {
        currentBlock.content += line + '\n';
        continue;
      }

      // 3. Detect Thinking Lines
      const isThinking = 
        line.startsWith('CLAUDE THINKING:') || 
        line.startsWith('> THOUGHT:') || 
        line.startsWith('[GEMINI]') ||
        line.startsWith('[ANALYSIS]');

      if (isThinking) {
        // If switching from text to thinking, push text
        if (currentBlock && currentBlock.type !== 'thinking') {
          blocks.push(currentBlock);
          currentBlock = { type: 'thinking', content: line + '\n' };
        } else if (currentBlock && currentBlock.type === 'thinking') {
          currentBlock.content += line + '\n';
        } else {
          currentBlock = { type: 'thinking', content: line + '\n' };
        }
        continue;
      }

      // 4. Standard Text
      if (currentBlock && currentBlock.type === 'text') {
        currentBlock.content += line + '\n';
      } else {
        // Switch from thinking to text, or start new
        if (currentBlock) blocks.push(currentBlock);
        currentBlock = { type: 'text', content: line + '\n' };
      }
    }
    if (currentBlock) blocks.push(currentBlock);
    return blocks;
  };

  // Safe Prism Highlighter
  const highlightCode = (code: string, lang: string) => {
    if (typeof Prism === 'undefined') return code;
    
    // Map 'json:filename' to 'json' and handle edge cases
    let cleanLang = lang.split(':')[0].trim().toLowerCase();
    
    // Fallback grammar lookup
    let grammar = Prism.languages[cleanLang];
    
    // Attempt standard fallbacks if specific language not found
    if (!grammar) {
        if (cleanLang === 'js' || cleanLang === 'javascript') grammar = Prism.languages.javascript;
        else if (cleanLang === 'py' || cleanLang === 'python') grammar = Prism.languages.python;
        else if (cleanLang === 'sh' || cleanLang === 'bash' || cleanLang === 'shell') grammar = Prism.languages.bash;
        else if (cleanLang === 'json') grammar = Prism.languages.json;
    }

    if (!grammar) {
        // If still no grammar, return unhighlighted code (safest option for 'text', 'log', etc)
        return code;
    }
    
    return Prism.highlight(code, grammar, cleanLang);
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-full bg-[#0f0f12] border border-gray-800 rounded-lg overflow-hidden font-mono text-sm relative shadow-inner"
      onClick={handleContainerClick}
    >
      <div className="flex-1 overflow-y-auto p-4 text-gray-300 font-mono scroll-smooth">
        {/* Static Banner */}
        {logs.length === 0 && (
           <div className="mb-6 text-gray-500 opacity-60 select-none whitespace-pre-wrap">
             Linux impetus2ai 6.6.15-amd64 #1 SMP PREEMPT_DYNAMIC Kali 2024.3 x86_64{'\n'}
             The programs included with the Kali GNU/Linux system are free software;{'\n'}
             the exact distribution terms for each program are described in the{'\n'}
             individual files in /usr/share/doc/*/copyright.{'\n'}
             {'\n'}
             Kali GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent{'\n'}
             permitted by applicable law.{'\n'}
           </div>
        )}

        {/* Logs */}
        {logs.filter(l => l.sender !== 'system').map((log) => {
          if (log.sender === 'user') {
            return (
              <div key={log.id} className="mb-2 mt-4 break-all">
                <span className="font-bold text-kali-accent mr-2 select-none">root@impetus2ai:~#</span>
                <span className="text-gray-100">{log.content}</span>
              </div>
            );
          } else {
            const blocks = parseContent(log.content);
            return (
              <div key={log.id} className="mb-1 text-gray-300">
                {blocks.map((block, idx) => {
                  if (block.type === 'thinking') {
                    return (
                      <div key={idx} className="my-2 py-2 px-3 border-l-2 border-kali-secondary bg-kali-800/30 text-kali-secondary text-xs italic opacity-80 rounded-r">
                         <div className="font-bold text-[10px] uppercase mb-1 opacity-70 not-italic flex items-center gap-2">
                           <span className="w-1 h-1 rounded-full bg-kali-secondary"></span>
                           Agent Process
                         </div>
                         <div className="whitespace-pre-wrap">{block.content}</div>
                      </div>
                    );
                  }
                  if (block.type === 'code') {
                    const fullLang = block.language || 'text';
                    const displayLang = fullLang.split(':')[0];
                    const fileName = fullLang.includes(':') ? fullLang.split(':')[1] : null;
                    const html = highlightCode(block.content, displayLang);
                    
                    return (
                      <div key={idx} className="my-3 rounded border border-gray-700 bg-[#16161e] overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-1 bg-[#1f1f28] border-b border-gray-700 select-none">
                           <div className="flex items-center gap-2">
                             <span className="text-[10px] text-gray-400 uppercase tracking-wider">{displayLang}</span>
                             {fileName && <span className="text-[10px] text-kali-accent font-bold px-1.5 py-0.5 bg-kali-900 rounded border border-kali-700">{fileName}</span>}
                           </div>
                           {fileName && <span className="text-[10px] text-gray-600">Artifact Captured</span>}
                        </div>
                        <div className="p-3 overflow-x-auto">
                           <pre className={`language-${displayLang} !m-0 !p-0 !bg-transparent`}>
                             <code 
                               className={`language-${displayLang}`} 
                               dangerouslySetInnerHTML={{ __html: html === block.content ? block.content : html }} 
                             />
                           </pre>
                        </div>
                      </div>
                    );
                  }
                  // Raw Text
                  return (
                    <div key={idx} className="whitespace-pre-wrap break-all leading-relaxed">
                      {block.content}
                    </div>
                  );
                })}
              </div>
            );
          }
        })}

        {/* Streaming Indicator */}
        {isStreaming && (
          <div className="mt-2 text-kali-accent/50 animate-pulse">
            <span className="inline-block w-2 h-4 bg-kali-accent align-middle ml-1"></span>
          </div>
        )}

        {/* Input Line */}
        {!isStreaming && (
          <div className="flex items-center gap-2 text-gray-100 mt-2 pb-8">
            <span className="font-bold text-kali-accent whitespace-nowrap select-none">root@impetus2ai:~#</span>
            <form onSubmit={handleSubmit} className="flex-1 min-w-0">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={status === SessionStatus.COMPLETED}
                className="w-full bg-transparent border-none outline-none text-gray-100 placeholder-gray-600 p-0 m-0 font-mono text-sm"
                autoComplete="off"
                spellCheck={false}
                autoFocus
              />
            </form>
          </div>
        )}
        <div ref={endOfLogsRef} />
      </div>
    </div>
  );
};
