'use client';

import { use } from "react";
import { mockCases } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, AlertTriangle, ArrowLeft, FileText, History } from "lucide-react";
import Link from "next/link";

export default function CaseDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const caseItem = mockCases.find((c) => c.id === id) || mockCases[0];
  const candidate = caseItem.candidates[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/pre-pay" className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pre-Pay Cockpit
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold font-heading text-foreground">{caseItem.id}</h1>
            <Badge variant={caseItem.status === "New" ? "destructive" : "secondary"} className="text-base px-3 py-1">
              {caseItem.status}
            </Badge>
            <Badge variant="outline" className="text-base px-3 py-1 border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/30">
              Risk Score: {caseItem.riskScore}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
              <Check className="mr-2 h-4 w-4" /> Confirm Duplicate
            </Button>
            <Button variant="default" className="bg-emerald-600 hover:bg-emerald-700">
              <X className="mr-2 h-4 w-4" /> Release Payment
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Comparison View */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-l-4 border-l-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
                Match Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-muted/30 rounded-lg border">
                  <div className="flex items-center gap-2 mb-4">
                    <FileText className="h-4 w-4 text-primary" />
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Current Invoice (Held)</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-muted-foreground block">Vendor</span>
                      <span className="font-medium">{caseItem.primaryInvoice.vendorName}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Invoice Number</span>
                      <span className="font-mono font-bold text-lg">{caseItem.primaryInvoice.invoiceNumber}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Amount</span>
                      <span className="font-mono font-bold text-lg">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: caseItem.primaryInvoice.currency }).format(caseItem.primaryInvoice.amount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Date</span>
                      <span className="font-mono">{caseItem.primaryInvoice.invoiceDate}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Source System</span>
                      <Badge variant="outline">{caseItem.primaryInvoice.sourceSystem}</Badge>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-amber-50/50 dark:bg-amber-950/10 rounded-lg border border-amber-200 dark:border-amber-900">
                  <div className="flex items-center gap-2 mb-4">
                    <History className="h-4 w-4 text-amber-600" />
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-amber-700 dark:text-amber-500">Suspect Match (Paid)</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <span className="text-xs text-muted-foreground block">Vendor</span>
                      <span className="font-medium">{candidate.invoice.vendorName}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Invoice Number</span>
                      <span className="font-mono font-bold text-lg text-amber-600 dark:text-amber-500">
                        {candidate.invoice.invoiceNumber}
                      </span>
                      {caseItem.primaryInvoice.invoiceNumber !== candidate.invoice.invoiceNumber && (
                        <span className="text-xs text-destructive ml-2">(Fuzzy Match)</span>
                      )}
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Amount</span>
                      <span className="font-mono font-bold text-lg text-amber-600 dark:text-amber-500">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: candidate.invoice.currency }).format(candidate.invoice.amount)}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Date</span>
                      <span className="font-mono">{candidate.invoice.invoiceDate}</span>
                    </div>
                    <div>
                      <span className="text-xs text-muted-foreground block">Source System</span>
                      <Badge variant="outline">{candidate.invoice.sourceSystem}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-semibold text-sm mb-3">Detected Signals</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.reasons.map((reason, i) => (
                    <Badge key={i} variant="secondary" className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 border-amber-200">
                      {reason} • {candidate.score}% Similarity
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audit Trail</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-muted ml-2 space-y-6">
                {caseItem.auditTrail.map((event, i) => (
                  <div key={i} className="pl-6 relative">
                    <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full bg-muted-foreground" />
                    <p className="text-sm font-medium">{event.action}</p>
                    <p className="text-xs text-muted-foreground">{event.date} by {event.user}</p>
                    {event.details && (
                      <p className="text-xs text-muted-foreground mt-1 bg-muted p-2 rounded">
                        {event.details}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
