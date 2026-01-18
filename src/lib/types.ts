export interface Invoice {
  id: string;
  sourceSystem: "SAP" | "Oracle" | "NetSuite" | "Dynamics 365";
  sourceDocumentId: string;
  entityId: string;
  vendorId: string;
  vendorName: string;
  invoiceNumber: string;
  invoiceDate: string;
  currency: string;
  amount: number;
  status: "Paid" | "Pending" | "Held" | "Approved";
  paymentRef?: string;
  scanUrl?: string;
}

export interface MatchCandidate {
  invoice: Invoice;
  matchType: "Exact" | "Fuzzy" | "Amount" | "Split";
  score: number;
  reasons: string[];
}

export interface Case {
  id: string;
  type: "PREPAY" | "RECOVERY";
  status: "New" | "Investigating" | "Confirmed Duplicate" | "False Positive" | "Resolved";
  riskScore: number;
  createdDate: string;
  owner?: string;
  primaryInvoice: Invoice;
  candidates: MatchCandidate[];
  auditTrail: AuditEvent[];
}

export interface AuditEvent {
  id: string;
  date: string;
  user: string;
  action: string;
  details?: string;
}

export interface KPIMetrics {
  totalPreventedValue: number;
  totalPreventedCount: number;
  detectedPostPayValue: number;
  recoveryRate: number;
  openCases: number;
  avgResolutionTime: string;
}
