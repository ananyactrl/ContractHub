// src/mockData.js
export const mockContracts = [
  {
    id: 1,
    filename: "Service Agreement.pdf",
    uploadDate: "2024-09-22T10:30:00Z",
    status: "Active",
    riskLevel: "Low",
    fileSize: "2.5MB",
    category: "Service Contract"
  },
  {
    id: 2,
    filename: "Employment Contract.pdf", 
    uploadDate: "2024-09-20T14:15:00Z",
    status: "Under Review",
    riskLevel: "Medium",
    fileSize: "1.8MB",
    category: "HR Contract"
  },
  {
    id: 3,
    filename: "Vendor Agreement.pdf",
    uploadDate: "2024-09-18T09:45:00Z", 
    status: "Expired",
    riskLevel: "High",
    fileSize: "3.2MB",
    category: "Vendor Contract"
  }
];

export const mockContractDetail = {
  id: 1,
  filename: "Service Agreement.pdf",
  content: "Sample contract content for analysis...",
  analysis: {
    keyTerms: ["Payment: Net 30 days", "Contract Duration: 12 months"],
    riskLevel: "Low",
    issues: []
  }
};
