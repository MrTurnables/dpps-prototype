'use client';

import { mockCases } from "@/lib/mock-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Search, Filter, ArrowRight, AlertCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { BrainCircuit, LineChart, History, Building2 } from "lucide-react";

export default function PrePayCockpit() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [comments, setComments] = useState<Record<string, string>>({});
  const [filterType, setFilterType] = useState<string>("All");

  // Fetch cases from API
  const { data: casesData, isLoading } = useQuery({
    queryKey: ["/api/cases", { status: "open" }],
  });

  interface Case {
    id: string;
    primaryInvoice: {
      vendorName: string;
      vendorId: string;
      invoiceNumber: string;
      currency: string;
      amount: number;
    };
    riskScore: number;
    status: string;
  }

  const cases = (Array.isArray(casesData) ? casesData : mockCases) as Case[];

  const duplicateTypes = [
    { label: "Exact Match", count: 12, color: "bg-blue-500" },
    { label: "Fuzzy (Name/Amt)", count: 8, color: "bg-amber-500" },
    { label: "Transposed Digits", count: 4, color: "bg-purple-500" },
    { label: "Vndr Master Error", count: 3, color: "bg-rose-500" },
  ];

  const toggleSelectAll = () => {
    if (selectedIds.length === cases.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(cases.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };
  // ... (middle parts handled by context or kept separate?) 
  // Actually I need to be careful not to skip too much or replace wrong blocks. 
  // I will verify lines first.


  const handleBulkAction = (action: 'duplicate' | 'dismiss') => {
    if (selectedIds.length === 0) {
      toast.error("Please select at least one line");
      return;
    }

    if (action === 'duplicate') {
      toast.promise(
        new Promise((resolve) => setTimeout(resolve, 1500)),
        {
          loading: 'Connecting to ERP Source System...',
          success: (data) => {
            return `Payment blocks successfully triggered in ERP for ${selectedIds.length} invoices. Status updated to "Blocked".`;
          },
          error: 'Failed to connect to Source System',
        }
      );
    } else {
      toast.success(`Bulk ${action} applied to ${selectedIds.length} items`);
    }

    setSelectedIds([]);
  };

  return (

    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">Open Potential Duplicates</h1>
          <p className="text-muted-foreground mt-2">
            Review and resolve high-risk payment proposals before they are released.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-primary/5 p-1.5 rounded-lg border border-primary/20 mr-2">
              <span className="text-xs font-bold px-2 text-primary">{selectedIds.length} Selected</span>
              <Button size="sm" variant="destructive" onClick={() => handleBulkAction('duplicate')} className="h-8 text-xs font-bold">
                Flag Duplicate
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleBulkAction('dismiss')} className="h-8 text-xs font-bold">
                Dismiss
              </Button>
            </div>
          )}
          <Button variant="outline" size="sm" className="font-bold">
            <Filter className="mr-2 h-4 w-4" /> Filter
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search invoices, vendors, or IDs..."
            className="pl-8"
          />
        </div>
        <div className="flex gap-2 ml-auto">
          {duplicateTypes.map((type) => (
            <Button
              key={type.label}
              variant="outline"
              size="sm"
              className={cn(
                "h-8 text-[10px] font-bold border-dashed",
                filterType === type.label && "bg-primary/5 border-primary/50"
              )}
              onClick={() => setFilterType(type.label)}
            >
              <div className={cn("h-1.5 w-1.5 rounded-full mr-2", type.color)} />
              {type.label}
              <Badge variant="secondary" className="ml-2 h-4 min-w-[18px] p-0 text-[9px] flex items-center justify-center">
                {type.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      <div className="rounded-md border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[40px]">
                <Checkbox
                  checked={selectedIds.length === cases.length && cases.length > 0}
                  onCheckedChange={toggleSelectAll}
                />
              </TableHead>
              <TableHead className="w-[100px]">Case ID</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-[300px]">Analyst Notes</TableHead>
              <TableHead>Risk Score</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  Loading cases...
                </TableCell>
              </TableRow>
            ) : cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">
                  No open cases found
                </TableCell>
              </TableRow>
            ) : cases.map((c: any) => (
              <TableRow key={c.id} className="group hover:bg-muted/30 transition-colors">
                <TableCell>
                  <Checkbox
                    checked={selectedIds.includes(c.id)}
                    onCheckedChange={() => toggleSelect(c.id)}
                  />
                </TableCell>
                <TableCell className="font-mono text-[10px] font-bold">{c.id}</TableCell>
                <TableCell className="font-semibold text-sm">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <Button variant="link" className="p-0 h-auto font-semibold text-foreground underline-offset-4 decoration-dashed decoration-muted-foreground/50">
                        {c.primaryInvoice?.vendorName || 'Unknown Vendor'}
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-80">
                      <div className="flex justify-between space-x-4">
                        <div className="space-y-1">
                          <h4 className="text-sm font-semibold flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            {c.primaryInvoice?.vendorName || 'Unknown Vendor'}
                          </h4>
                          <p className="text-xs text-muted-foreground">Vendor ID: {c.primaryInvoice?.vendorId || 'N/A'}</p>
                          <div className="flex items-center pt-2">
                            <Badge variant="outline" className="text-[10px] mr-1">Global Partner</Badge>
                            <Badge variant={c.riskScore > 80 ? "destructive" : "secondary"} className="text-[10px]">
                              Risk: {c.riskScore > 80 ? "High" : "Medium"}
                            </Badge>
                          </div>
                          <div className="pt-2 text-xs text-muted-foreground">
                            <div className="flex justify-between py-1 border-b border-border/50">
                              <span>Total Spend (YTD):</span>
                              <span className="font-mono text-foreground font-medium">$1.2M</span>
                            </div>
                            <div className="flex justify-between py-1 border-b border-border/50">
                              <span>Prev. Duplicates:</span>
                              <span className="font-mono text-foreground font-medium">3</span>
                            </div>
                            <div className="flex justify-between py-1">
                              <span>Payment Terms:</span>
                              <span className="font-mono text-foreground font-medium">Net 45</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </HoverCardContent>
                  </HoverCard>
                </TableCell>
                <TableCell className="font-mono text-xs">{c.primaryInvoice?.invoiceNumber || 'N/A'}</TableCell>
                <TableCell className="font-mono text-xs font-bold">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: c.primaryInvoice?.currency || 'USD' }).format(c.primaryInvoice?.amount || 0)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent justify-start">
                          <Badge variant="outline" className="text-[9px] w-fit font-mono uppercase bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 cursor-pointer transition-colors group">
                            {c.riskScore > 90 ? "High Confidence AI" : "Pattern Match"}
                            <BrainCircuit className="ml-1 h-3 w-3 group-hover:text-indigo-500" />
                          </Badge>
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="sm:max-w-xl">
                        <SheetHeader>
                          <SheetTitle className="flex items-center gap-2 text-xl">
                            <BrainCircuit className="h-6 w-6 text-indigo-600" />
                            AI Forensics Analysis
                          </SheetTitle>
                          <SheetDescription>
                            Deep learning model explanation for Case #{c.id}
                          </SheetDescription>
                        </SheetHeader>

                        <div className="mt-8 space-y-6">
                          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                            <div className="flex justify-between items-center">
                              <h4 className="font-bold text-sm text-slate-700">Similarity Confidence</h4>
                              <span className="text-2xl font-black text-indigo-600">{c.riskScore}%</span>
                            </div>
                            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${c.riskScore}%` }} />
                            </div>
                            <p className="text-xs text-muted-foreground">
                              The model is {c.riskScore}% confident this is a true duplicate based on historical pattern matching and phonetic analysis.
                            </p>
                          </div>

                          <div className="space-y-4">
                            <h4 className="font-bold text-sm flex items-center gap-2">
                              <LineChart className="h-4 w-4" />
                              Key Risk Signals
                            </h4>
                            <div className="grid gap-3">
                              <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 shrink-0 font-bold text-xs">
                                  01
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-foreground">Fuzzy Vendor Name Match</p>
                                  <p className="text-xs text-muted-foreground">&quot;Acme Corp&quot; vs &quot;Acme Corporation Inc.&quot; (Levenshtein Distance: 2)</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-700 shrink-0 font-bold text-xs">
                                  02
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-foreground">Invoice Amount Anomaly</p>
                                  <p className="text-xs text-muted-foreground">This amount ($12,400) appears 3x more frequently than standard deviation for this vendor.</p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0 font-bold text-xs">
                                  03
                                </div>
                                <div>
                                  <p className="text-sm font-bold text-foreground">Date Proximity Warning</p>
                                  <p className="text-xs text-muted-foreground">Invoice date is within 2 days of a previously paid invoice of similar value.</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <h4 className="font-bold text-sm mb-3 flex items-center gap-2">
                              <History className="h-4 w-4" />
                              Recommended Action
                            </h4>
                            <div className="bg-emerald-50 text-emerald-800 p-4 rounded-lg text-sm font-medium border border-emerald-100">
                              Based on 98% similarity with Case #SAP-9921, we recommend <strong>BLOCKING</strong> this payment and requesting a credit memo.
                            </div>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>

                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                      <AlertCircle className="h-3 w-3 text-amber-500" />
                      <span>Fuzzy Match: Vendor Name Similarity 92%</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-2">
                  <Textarea
                    placeholder="Add detailed analyst notes..."
                    className="min-h-[32px] text-xs bg-transparent border-transparent hover:border-input focus:bg-background transition-all resize-y overflow-hidden focus:overflow-auto py-1"
                    rows={1}
                    value={comments[c.id] || ''}
                    onChange={(e) => {
                      setComments(prev => ({ ...prev, [c.id]: e.target.value }));
                      // Auto-expand height
                      e.target.style.height = 'auto';
                      e.target.style.height = e.target.scrollHeight + 'px';
                    }}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-secondary rounded-full overflow-hidden shrink-0">
                      <div
                        className={`h-full ${c.riskScore > 80 ? 'bg-destructive' : 'bg-amber-500'}`}
                        style={{ width: `${c.riskScore}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-black ${c.riskScore > 80 ? 'text-destructive' : 'text-amber-600'}`}>
                      {c.riskScore}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={c.status === "New" ? "destructive" : "secondary"} className="text-[10px] font-bold uppercase tracking-tighter">
                    {c.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Link href={`/cases/${c.id}`}>
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>

  );
}
