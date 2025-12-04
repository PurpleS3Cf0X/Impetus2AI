
import { AttackScenario } from '../types';

export const DB_VERSION = 2;

export const DEFAULT_SCENARIOS: AttackScenario[] = [
  {
    id: 'seed-recon-01',
    name: 'Full Stack Network Reconnaissance',
    category: 'Network',
    difficulty: 'Beginner',
    mitreId: 'T1595',
    description: 'Performs a comprehensive discovery of active hosts, open ports, service versions, and OS fingerprinting on a target range. Maps to MITRE T1595 (Active Scanning).',
    tools: ['nmap', 'netdiscover', 'masscan'],
    initialPrompt: 'Run a comprehensive network scan on the target using nmap with version detection (-sV), default scripts (-sC), and OS detection (-O). Also identify all open ports.'
  },
  {
    id: 'seed-web-01',
    name: 'OWASP Top 10 Web Audit',
    category: 'Web',
    difficulty: 'Intermediate',
    mitreId: 'T1190',
    description: 'Scans a web application for common vulnerabilities such as XSS, SQLi, and misconfigurations using Nikto and custom scripts. Maps to MITRE T1190.',
    tools: ['nikto', 'whatweb', 'gemini-cli'],
    initialPrompt: 'Perform a web vulnerability assessment on the target. Start by identifying the technology stack using whatweb, then run a nikto scan to find server misconfigurations.'
  },
  {
    id: 'seed-sqli-01',
    name: 'SQL Injection Vulnerability Test',
    category: 'Web',
    difficulty: 'Advanced',
    mitreId: 'T1190',
    description: 'Targeted assessment to identify and verify SQL injection vectors in URL parameters and forms.',
    tools: ['sqlmap', 'python3'],
    initialPrompt: 'Analyze the target URL for SQL injection vulnerabilities. Use sqlmap to test identified parameters with a low risk level first, then escalate if potential vectors are found.'
  },
  {
    id: 'seed-cloud-01',
    name: 'Cloud Bucket Enumeration',
    category: 'Cloud',
    difficulty: 'Intermediate',
    mitreId: 'T1530',
    description: 'Attempts to identify public cloud storage buckets (AWS S3, GCP Storage) related to the target domain. Maps to MITRE T1530 (Data from Cloud Storage Object).',
    tools: ['cloud-enum', 'dig', 'python3'],
    initialPrompt: 'Perform open-source intelligence gathering to identify public cloud storage buckets associated with the target domain. List any accessible resources.'
  },
  {
    id: 'seed-api-01',
    name: 'API Endpoint Fuzzing',
    category: 'API',
    difficulty: 'Advanced',
    mitreId: 'T1190',
    description: 'Discovers hidden API endpoints and tests for broken access control (IDOR) and improper input validation.',
    tools: ['gobuster', 'wfuzz', 'curl'],
    initialPrompt: 'Conduct an API discovery scan on the target. Use gobuster to brute-force common API paths (e.g., /api/v1, /graphql) and check for unauthenticated access.'
  },
  {
    id: 'seed-soc-01',
    name: 'Simulated Phishing Campaign Analysis',
    category: 'Social Eng',
    difficulty: 'Beginner',
    mitreId: 'T1598',
    description: 'Generates a report on potential email security weaknesses (SPF/DMARC) and simulates a phishing landing page assessment. Maps to MITRE T1598.',
    tools: ['dig', 'whois', 'gemini-cli'],
    initialPrompt: 'Analyze the DNS records for the target domain (SPF, DMARC, DKIM) to assess email spoofing risks. Then, evaluate the domain for typosquatting vulnerabilities.'
  }
];