import { Case, Invoice, KPIMetrics } from "./types";
import { subDays, format } from "date-fns";

const generateId = () => Math.random().toString(36).substring(2, 9).toUpperCase();

const vendors = [
  "Acme Corp",
  "Globex Corporation",
  "Soylent Corp",
  "Initech",
  "Umbrella Corp",
  "Stark Industries",
  "Wayne Enterprises",
  "Cyberdyne Systems",
];

const systems = ["SAP", "Oracle", "Dynamics 365"] as const;

export const mockMetrics: KPIMetrics = {
  totalPreventedValue: 1250450.00,
  totalPreventedCount: 142,
  detectedPostPayValue: 45000.00,
  recoveryRate: 85,
  openCases: 23,
  avgResolutionTime: "4.2 hrs",
};

const createMockInvoice = (override: Partial<Invoice> = {}): Invoice => {
  const amount = Math.floor(Math.random() * 50000) + 100;
  return {
    id: generateId(),
    sourceSystem: systems[Math.floor(Math.random() * systems.length)],
    sourceDocumentId: `DOC-${Math.floor(Math.random() * 100000)}`,
    entityId: "ENT-US-01",
    vendorId: `V-${Math.floor(Math.random() * 1000)}`,
    vendorName: vendors[Math.floor(Math.random() * vendors.length)],
    invoiceNumber: `INV-${Math.floor(Math.random() * 1000000)}`,
    invoiceDate: format(subDays(new Date(), Math.floor(Math.random() * 30)), "yyyy-MM-dd"),
    currency: "USD",
    amount: amount,
    status: "Pending",
    ...override,
  };
};

export const mockVendorRanking = [
  { name: "Acme Corp", count: 24, value: 450200, region: "North America" },
  { name: "Globex Corporation", count: 18, value: 320100, region: "Europe" },
  { name: "Soylent Corp", count: 15, value: 180500, region: "Asia Pacific" },
  { name: "Initech", count: 12, value: 95000, region: "North America" },
  { name: "Umbrella Corp", count: 9, value: 72000, region: "Europe" },
  { name: "Stark Industries", count: 7, value: 65000, region: "North America" },
  { name: "Wayne Enterprises", count: 6, value: 58000, region: "North America" },
  { name: "Cyberdyne Systems", count: 5, value: 42000, region: "Europe" },
  { name: "Hooli", count: 4, value: 31000, region: "Asia Pacific" },
  { name: "Massive Dynamic", count: 3, value: 28000, region: "North America" },
];

export const mockCases: Case[] = Array.from({ length: 15 }).map((_, i) => {
  const primaryInvoice = createMockInvoice({ status: "Held" });

  // Simulate a duplicate
  const duplicateInvoice = {
    ...primaryInvoice,
    id: generateId(),
    sourceDocumentId: `DOC-${Math.floor(Math.random() * 100000)}`,
    invoiceNumber: Math.random() > 0.5 ? primaryInvoice.invoiceNumber : primaryInvoice.invoiceNumber.replace('0', 'O'), // OCR error simulation
    invoiceDate: Math.random() > 0.7 ? format(subDays(new Date(primaryInvoice.invoiceDate), 2), "yyyy-MM-dd") : primaryInvoice.invoiceDate,
    status: "Paid" as const,
  };

  const score = Math.floor(Math.random() * (100 - 60) + 60);

  return {
    id: `CASE-${2024000 + i}`,
    type: "PREPAY",
    status: score > 90 ? "New" : "Investigating",
    riskScore: score,
    createdDate: format(subDays(new Date(), Math.floor(Math.random() * 5)), "yyyy-MM-dd HH:mm"),
    owner: Math.random() > 0.5 ? "J. Doe" : undefined,
    primaryInvoice,
    candidates: [
      {
        invoice: duplicateInvoice,
        matchType: primaryInvoice.invoiceNumber === duplicateInvoice.invoiceNumber ? "Exact" : "Fuzzy",
        score: score,
        reasons: [
          primaryInvoice.invoiceNumber === duplicateInvoice.invoiceNumber ? "Exact Invoice Number Match" : "Fuzzy Invoice Number Similarity > 95%",
          "Exact Amount Match",
          "Same Vendor",
        ],
      },
    ],
    auditTrail: [
      {
        id: generateId(),
        date: format(subDays(new Date(), 1), "yyyy-MM-dd HH:mm"),
        user: "System",
        action: "Case Created",
        details: `Risk Score calculated at ${score}`,
      },
    ],
  };
});
