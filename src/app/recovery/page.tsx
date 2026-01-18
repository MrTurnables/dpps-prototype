'use client';

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Mail, Loader2, CheckCircle, Send, FileText, History, RefreshCw, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface RecoveryItem {
  id: string;
  vendorId: string;
  amount: number;
  status: 'initiated' | 'contacted' | 'validated' | 'recovered' | 'written_off';
  initiatedDate: string;
  vendor?: { name: string };
  invoice?: { invoiceNumber: string };
  notes?: string;
  // Computed on frontend or backend
  aging?: string;
}

interface Activity {
  id: string;
  action: string;
  notes: string;
  timestamp: string;
  user?: { username: string };
}

export default function Recovery() {
  const [isExporting, setIsExporting] = useState(false);
  const queryClient = useQueryClient();

  // Fetch recovery items from API
  const { data: recoveryItems = [], isLoading } = useQuery<RecoveryItem[]>({
    queryKey: ["/api/recovery"],
    queryFn: async () => {
      const res = await fetch("/api/recovery");
      if (!res.ok) throw new Error("Failed to fetch recovery items");
      return res.json();
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string, status: string, notes?: string }) => {
      const res = await fetch(`/api/recovery/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          action: `Status updated to ${status}`,
          activityNotes: notes
        }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recovery"] });
      toast.success("Status Updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    }
  });

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      const headers = "Case ID,Vendor,Amount,Detected Date,Status,Aging\n";
      const rows = recoveryItems.map((item) =>
        `${item.id},${item.vendor?.name || "N/A"},${item.amount},${new Date(item.initiatedDate).toLocaleDateString()},${item.status},${item.aging || "N/A"}`
      ).join("\n");
      const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `recovery_report_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Recovery report exported successfully");
    }, 1500);
  };

  const calculateAging = (dateString: string) => {
    const days = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / (1000 * 3600 * 24));
    return `${days} days`;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Post-Pay Recovery</h1>
          <p className="text-muted-foreground mt-2">
            Track and manage recovery of funds for duplicates detected after payment.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          disabled={isExporting || recoveryItems.length === 0}
          className="font-bold shadow-sm min-w-[160px]"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" /> Export Report
            </>
          )}
        </Button>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Case ID</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date Initiated</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aging</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading recovery items...
                  </div>
                </TableCell>
              </TableRow>
            ) : recoveryItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                  <div className="flex flex-col items-center gap-2">
                    <AlertCircle className="h-8 w-8 opacity-50" />
                    <p>No active recovery cases found.</p>
                    <p className="text-xs">Cases appear here when confirmed duplicates are marked for recovery.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : recoveryItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs">{item.id.substring(0, 8)}</TableCell>
                <TableCell className="font-medium">{item.vendor?.name || "Unknown Vendor"}</TableCell>
                <TableCell className="font-mono font-bold">
                  {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(item.amount))}
                </TableCell>
                <TableCell>{new Date(item.initiatedDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={item.status}
                    onValueChange={(val) => updateStatusMutation.mutate({ id: item.id, status: val })}
                  >
                    <SelectTrigger className="h-8 w-[130px] text-xs font-bold border-none bg-secondary/50 focus:ring-0 focus:ring-offset-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="initiated">Initiated</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="validated">Validated</SelectItem>
                      <SelectItem value="recovered">Recovered</SelectItem>
                      <SelectItem value="written_off">Written Off</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{calculateAging(item.initiatedDate)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <History className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Activity Log</SheetTitle>
                          <SheetDescription>History for Case {item.id}</SheetDescription>
                        </SheetHeader>
                        <ActivityLog id={item.id} />
                      </SheetContent>
                    </Sheet>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" className="h-8 text-xs font-bold">
                          <Mail className="h-3.5 w-3.5 mr-2" /> Email
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[500px]">
                        <DialogHeader>
                          <DialogTitle>Contact Vendor</DialogTitle>
                          <DialogDescription>
                            Send recovery request to {item.vendor?.name}.
                          </DialogDescription>
                        </DialogHeader>
                        <EmailForm item={item} />
                      </DialogContent>
                    </Dialog>
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

function ActivityLog({ id }: { id: string }) {
  const { data: item, isLoading } = useQuery({
    queryKey: [`/api/recovery/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/recovery/${id}`);
      return res.json();
    }
  });

  if (isLoading) return <div className="py-4"><Loader2 className="h-4 w-4 animate-spin mx-auto" /></div>;

  return (
    <div className="mt-6 space-y-6">
      <div className="relative border-l border-muted ml-3 space-y-6 pb-2">
        {item?.activities?.map((activity: Activity) => (
          <div key={activity.id} className="relative pl-6">
            <div className="absolute -left-1.5 top-1.5 h-3 w-3 rounded-full border border-background bg-muted-foreground/30" />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-muted-foreground">
                {new Date(activity.timestamp).toLocaleString()}
              </span>
              <p className="text-sm font-medium">{activity.action}</p>
              {activity.notes && (
                <p className="text-xs text-muted-foreground bg-muted/30 p-2 rounded mt-1">
                  {activity.notes}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmailForm({ item }: { item: RecoveryItem }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label className="text-xs font-bold uppercase">Subject</Label>
          <Input defaultValue={`Duplicate Payment Inquiry - Ref: ${item.id}`} />
        </div>
        <div className="grid gap-2">
          <Label className="text-xs font-bold uppercase">Message</Label>
          <Textarea
            className="h-32 text-sm"
            defaultValue={`Dear ${item.vendor?.name || 'Vendor'} Team,\n\nWe have identified a potential duplicate payment of ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(Number(item.amount))} (Case ID: ${item.id}).\n\nPlease review your records and confirm if a credit memo can be issued.\n\nBest regards,\nAccounts Payable Team`}
          />
        </div>
      </div>
      <DialogFooter>
        <Button onClick={() => {
          toast.success("Email sent successfully");
          // Here we would ideally add an activity log for "Email Sent"
        }} className="w-full sm:w-auto font-bold">
          <Send className="mr-2 h-4 w-4" /> Send Request
        </Button>
      </DialogFooter>
    </>
  );
}
