
export enum SessionStatus {
  IDLE = 'IDLE',
  RUNNING = 'RUNNING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum AgentModel {
  GEMINI_FLASH = 'gemini-2.5-flash',
  GEMINI_PRO = 'gemini-3-pro-preview',
  CLAUDE_3_5_SONNET = 'claude-3-5-sonnet-sim',
}

export interface LogEntry {
  id: string;
  timestamp: number;
  sender: 'user' | 'system' | 'agent';
  content: string;
  isError?: boolean;
}

export interface PentestArtifact {
  id: string;
  filename: string;
  type: string; // 'json' | 'text' | 'python' | 'xml' etc
  content: string;
  createdAt: number;
  size: number;
}

export type ReportType = 'executive' | 'technical' | 'full';

export interface PentestReport {
  id: string;
  title: string;
  type: ReportType;
  content: string; // Markdown content
  createdAt: number;
  generatedBy: string;
}

export interface AttackScenario {
  id: string;
  name: string;
  category: string; // Web, Network, Cloud, API, Social Eng
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  mitreId: string; // e.g. T1595
  description: string;
  tools: string[];
  initialPrompt: string; // The command/prompt to auto-start the session
}

export interface PentestSession {
  id: string;
  name: string;
  target: string;
  objective: string;
  customSystemPrompt?: string;
  status: SessionStatus;
  model: AgentModel;
  mitreId?: string; // Optional MITRE ID associated with this session
  createdAt: number;
  logs: LogEntry[];
  artifacts: PentestArtifact[];
  reports: PentestReport[];
  lastActivity: number;
}

export interface CreateSessionDTO {
  name: string;
  target: string;
  objective: string;
  customSystemPrompt?: string;
  model: AgentModel;
  mitreId?: string;
}

export interface PlatformSettings {
  gemini: {
    enabled: boolean;
  };
  claude: {
    enabled: boolean;
    apiKey: string;
  };
  general: {
    userName: string;
    shell: 'bash' | 'zsh';
  };
}