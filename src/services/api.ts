// Mock API service for contracts data

export interface Contract {
  id: string;
  name: string;
  parties: string;
  expiry: string;
  status: 'Active' | 'Expired' | 'Renewal Due';
  risk: 'Low' | 'Medium' | 'High';
}

export interface ContractDetail extends Contract {
  start: string;
  clauses: {
    title: string;
    summary: string;
    confidence: number;
  }[];
  insights: {
    risk: 'Low' | 'Medium' | 'High';
    message: string;
  }[];
  evidence: {
    source: string;
    snippet: string;
    relevance: number;
  }[];
}

// Mock delay to simulate API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock contract details data
const contractDetails: Record<string, ContractDetail> = {
  c1: {
    id: "c1",
    name: "MSA 2025",
    parties: "Microsoft & ABC Corp",
    start: "2023-01-01",
    expiry: "2025-12-31",
    status: "Active",
    risk: "Medium",
    clauses: [
      { title: "Termination", summary: "90 days notice period.", confidence: 0.82 },
      { title: "Liability Cap", summary: "12 months' fees limit.", confidence: 0.87 },
      { title: "Data Protection", summary: "GDPR compliance required.", confidence: 0.91 },
      { title: "Intellectual Property", summary: "Joint ownership of custom developments.", confidence: 0.76 }
    ],
    insights: [
      { risk: "High", message: "Liability cap excludes data breach costs." },
      { risk: "Medium", message: "Renewal auto-renews unless cancelled 60 days before expiry." },
      { risk: "Low", message: "Standard termination clause provides adequate protection." }
    ],
    evidence: [
      { source: "Section 12.2", snippet: "Total liability limited to 12 months' fees.", relevance: 0.91 },
      { source: "Section 8.1", snippet: "Either party may terminate with 90 days written notice.", relevance: 0.88 },
      { source: "Section 15.3", snippet: "Data breach costs excluded from liability cap.", relevance: 0.95 }
    ]
  },
  c2: {
    id: "c2",
    name: "Network Services Agreement",
    parties: "TelNet & ABC Corp",
    start: "2022-10-10",
    expiry: "2025-10-10",
    status: "Renewal Due",
    risk: "High",
    clauses: [
      { title: "Service Level Agreement", summary: "99.9% uptime guarantee.", confidence: 0.89 },
      { title: "Penalty Clauses", summary: "Service credits for downtime.", confidence: 0.85 },
      { title: "Force Majeure", summary: "Extended force majeure provisions.", confidence: 0.78 }
    ],
    insights: [
      { risk: "High", message: "Force majeure clause is overly broad and may limit liability." },
      { risk: "Medium", message: "Service level penalties may not cover business impact." },
      { risk: "High", message: "Contract expires in 30 days - renewal terms unclear." }
    ],
    evidence: [
      { source: "Section 4.2", snippet: "Force majeure includes 'any circumstances beyond reasonable control'.", relevance: 0.92 },
      { source: "Schedule A", snippet: "Service credits limited to 10% of monthly fees.", relevance: 0.87 }
    ]
  },
  c3: {
    id: "c3",
    name: "Software License Agreement",
    parties: "Adobe & XYZ Inc",
    start: "2022-12-15",
    expiry: "2024-12-15",
    status: "Expired",
    risk: "Low",
    clauses: [
      { title: "License Scope", summary: "Per-user licensing model.", confidence: 0.94 },
      { title: "Usage Restrictions", summary: "Commercial use only.", confidence: 0.88 }
    ],
    insights: [
      { risk: "Low", message: "Standard software license terms." },
      { risk: "Medium", message: "Contract has expired - consider renewal or migration." }
    ],
    evidence: [
      { source: "Section 2.1", snippet: "License granted for commercial use only.", relevance: 0.89 }
    ]
  },
  c4: {
    id: "c4",
    name: "Cloud Services Contract",
    parties: "AWS & TechCorp",
    start: "2023-03-20",
    expiry: "2026-03-20",
    status: "Active",
    risk: "Low",
    clauses: [
      { title: "Data Residency", summary: "Data stored in specified regions.", confidence: 0.92 },
      { title: "Backup & Recovery", summary: "Automated daily backups.", confidence: 0.86 },
      { title: "Compliance", summary: "SOC 2 Type II certified.", confidence: 0.95 }
    ],
    insights: [
      { risk: "Low", message: "Strong compliance and security provisions." },
      { risk: "Low", message: "Clear data residency requirements." }
    ],
    evidence: [
      { source: "Section 6.3", snippet: "Data residency guaranteed in specified AWS regions.", relevance: 0.93 }
    ]
  },
  c5: {
    id: "c5",
    name: "Data Processing Agreement",
    parties: "Google & DataCorp",
    start: "2023-06-30",
    expiry: "2025-06-30",
    status: "Active",
    risk: "High",
    clauses: [
      { title: "Data Processing", summary: "Limited to specified purposes.", confidence: 0.88 },
      { title: "Data Retention", summary: "7-year retention period.", confidence: 0.82 },
      { title: "Cross-Border Transfer", summary: "Standard contractual clauses.", confidence: 0.79 }
    ],
    insights: [
      { risk: "High", message: "Cross-border data transfer provisions may not be GDPR compliant." },
      { risk: "High", message: "Data retention period exceeds business requirements." },
      { risk: "Medium", message: "Limited audit rights for data processing activities." }
    ],
    evidence: [
      { source: "Section 5.2", snippet: "Data retention for 7 years from contract termination.", relevance: 0.91 },
      { source: "Annex 2", snippet: "Standard contractual clauses for international transfers.", relevance: 0.88 }
    ]
  },
  c6: {
    id: "c6",
    name: "Consulting Services MSA",
    parties: "Deloitte & Enterprise Corp",
    start: "2023-08-15",
    expiry: "2025-08-15",
    status: "Renewal Due",
    risk: "Medium",
    clauses: [
      { title: "Scope of Work", summary: "Defined in individual SOWs.", confidence: 0.85 },
      { title: "Intellectual Property", summary: "Work product ownership.", confidence: 0.83 },
      { title: "Confidentiality", summary: "Mutual confidentiality obligations.", confidence: 0.91 }
    ],
    insights: [
      { risk: "Medium", message: "IP ownership terms need clarification." },
      { risk: "Low", message: "Strong confidentiality provisions." },
      { risk: "Medium", message: "Contract renewal due in 60 days." }
    ],
    evidence: [
      { source: "Section 7.1", snippet: "Work product ownership to be determined in SOW.", relevance: 0.86 }
    ]
  },
  c7: {
    id: "c7",
    name: "Hardware Purchase Agreement",
    parties: "Dell & Manufacturing Inc",
    start: "2022-11-30",
    expiry: "2024-11-30",
    status: "Expired",
    risk: "Low",
    clauses: [
      { title: "Warranty", summary: "3-year hardware warranty.", confidence: 0.94 },
      { title: "Support", summary: "Next business day support.", confidence: 0.89 }
    ],
    insights: [
      { risk: "Low", message: "Standard hardware purchase terms." },
      { risk: "Medium", message: "Contract expired - warranty may still be valid." }
    ],
    evidence: [
      { source: "Section 3.1", snippet: "3-year warranty from date of delivery.", relevance: 0.92 }
    ]
  },
  c8: {
    id: "c8",
    name: "Security Services Contract",
    parties: "CrowdStrike & SecurityCorp",
    start: "2024-01-10",
    expiry: "2026-01-10",
    status: "Active",
    risk: "Medium",
    clauses: [
      { title: "Security Monitoring", summary: "24/7 threat monitoring.", confidence: 0.91 },
      { title: "Incident Response", summary: "4-hour response time.", confidence: 0.87 },
      { title: "Compliance", summary: "SOC 2 and ISO 27001 certified.", confidence: 0.93 }
    ],
    insights: [
      { risk: "Medium", message: "Response time may not meet critical incident requirements." },
      { risk: "Low", message: "Strong compliance certifications." }
    ],
    evidence: [
      { source: "Section 4.3", snippet: "4-hour response time for critical security incidents.", relevance: 0.89 }
    ]
  }
};

export const api = {
  // Get all contracts
  async getContracts(): Promise<Contract[]> {
    await delay(500); // Simulate API delay
    const response = await fetch('/contracts.json');
    if (!response.ok) {
      throw new Error('Failed to fetch contracts');
    }
    return response.json();
  },

  // Get contract by ID
  async getContract(id: string): Promise<ContractDetail> {
    await delay(300); // Simulate API delay
    const contract = contractDetails[id];
    if (!contract) {
      throw new Error('Contract not found');
    }
    return contract;
  },

  // Mock authentication
  async login(username: string, password: string): Promise<{ token: string; user: { username: string } }> {
    await delay(800); // Simulate API delay
    if (password !== 'test123') {
      throw new Error('Invalid credentials');
    }
    return {
      token: `mock-jwt-token-${Date.now()}`,
      user: { username }
    };
  }
};
