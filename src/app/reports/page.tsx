'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { ShieldCheck, ShieldAlert, TrendingUp, DollarSign } from "lucide-react";
import {
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
  Tooltip,
} from "@/components/ui/tooltip";

const monthlyData = [
  { name: "Jan", prevented: 45000, detected: 5000 },
  { name: "Feb", prevented: 52000, detected: 4800 },
  { name: "Mar", prevented: 48000, detected: 6100 },
  { name: "Apr", prevented: 61000, detected: 3200 },
  { name: "May", prevented: 55000, detected: 4500 },
  { name: "Jun", prevented: 67000, detected: 2800 },
];

const categoryData = [
  { name: "Exact Match", value: 45, color: "#3498db" },
  { name: "Fuzzy Match", value: 30, color: "#f39c12" },
  { name: "OCR Error", value: 15, color: "#e74c3c" },
  { name: "Pattern Match", value: 10, color: "#9b59b6" },
];

export default function Reports() {
  return (

    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-heading text-foreground">Analytics & Reports</h1>
        <p className="text-muted-foreground mt-2">
          Comprehensive overview of duplicate prevention metrics and system performance.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: "Total Prevented", value: "$1.25M", icon: DollarSign, color: "text-emerald-600", bg: "bg-emerald-50", tooltip: "Direct financial loss avoided by blocking duplicate payments before release." },
          { label: "Success Rate", value: "98.2%", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50", tooltip: "Percentage of total invoices correctly processed without error or duplicate release." },
          { label: "Confidence Avg", value: "94.5%", icon: TrendingUp, color: "text-indigo-600", bg: "bg-indigo-50", tooltip: "AI-calculated average confidence level across all detected duplicate groups." },
          { label: "Detected Risks", value: "142", icon: ShieldAlert, color: "text-amber-600", bg: "bg-amber-50", tooltip: "Total number of suspicious patterns flagged by the ML engine for review." },
        ].map((stat, i) => (
          <TooltipProvider key={i}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Card className="cursor-help transition-all hover:shadow-md hover:border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                        <p className="text-2xl font-black mt-1">{stat.value}</p>
                      </div>
                      <div className={`h-12 w-12 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}>
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs font-medium">{stat.tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>Prevention Performance</CardTitle>
                <CardDescription>Prevented value vs. detected risks (6 months)</CardDescription>
              </div>
              <div className="flex flex-col gap-2 text-[10px] font-bold uppercase tracking-tighter bg-muted/30 p-2 rounded-lg border">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#3498db]" />
                  <span className="text-foreground">Prevented:</span>
                  <span className="text-muted-foreground font-normal normal-case">Duplicates caught & blocked before payment.</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-[#e74c3c]" />
                  <span className="text-foreground">Detected:</span>
                  <span className="text-muted-foreground font-normal normal-case">Risks identified during post-pay audit.</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="prevented" fill="#3498db" radius={[4, 4, 0, 0]} name="Prevented ($)" />
                  <Bar dataKey="detected" fill="#e74c3c" radius={[4, 4, 0, 0]} name="Detected ($)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Detection Categories</CardTitle>
            <CardDescription>Distribution of duplicate types</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {categoryData.map((cat) => (
                <div key={cat.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-xs font-bold whitespace-nowrap">{cat.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">{cat.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

  );
}