'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  FileText, 
  Users, 
  Database, 
  Shield, 
  Code, 
  Workflow,
  CheckCircle,
  AlertTriangle,
  Settings,
  Upload,
  Search,
  TrendingUp,
  Terminal,
  Package,
  Server,
  Wrench
} from "lucide-react";

export default function Documentation() {
  return (
    
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-primary" />
            Documentation
          </h1>
          <p className="text-muted-foreground mt-2">
            Complete solution documentation and client onboarding guides for DPPS.
          </p>
        </div>

        <Tabs defaultValue="solution" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="solution" className="text-sm font-semibold" data-testid="tab-solution">
              <FileText className="h-4 w-4 mr-2" />
              Solution
            </TabsTrigger>
            <TabsTrigger value="onboarding" className="text-sm font-semibold" data-testid="tab-onboarding">
              <Users className="h-4 w-4 mr-2" />
              Onboarding
            </TabsTrigger>
            <TabsTrigger value="setup" className="text-sm font-semibold" data-testid="tab-setup">
              <Wrench className="h-4 w-4 mr-2" />
              Setup
            </TabsTrigger>
            <TabsTrigger value="source" className="text-sm font-semibold" data-testid="tab-source">
              <Code className="h-4 w-4 mr-2" />
              Source Code
            </TabsTrigger>
          </TabsList>

          <TabsContent value="solution" className="mt-6">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-6 pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      Executive Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      The Duplicate Payment Prevention System (DPPS) is an enterprise-grade, ERP-agnostic solution 
                      designed to prevent and recover duplicate payments. It provides comprehensive fraud detection 
                      and payment validation capabilities.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 bg-primary/5 rounded-lg border">
                        <h4 className="font-semibold mb-2">Pre-Payment Detection</h4>
                        <p className="text-sm text-muted-foreground">Validates payment proposals before release with automatic blocking</p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-lg border">
                        <h4 className="font-semibold mb-2">Case Management</h4>
                        <p className="text-sm text-muted-foreground">Full-featured analyst cockpits for AP/Payments teams</p>
                      </div>
                      <div className="p-4 bg-primary/5 rounded-lg border">
                        <h4 className="font-semibold mb-2">Recovery Tracking</h4>
                        <p className="text-sm text-muted-foreground">End-to-end workflow for recovering duplicate payments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      System Architecture
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Technology Stack</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Frontend</Badge>
                            <span className="text-sm">React 18 + TypeScript</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Backend</Badge>
                            <span className="text-sm">Express.js + TypeScript</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Database</Badge>
                            <span className="text-sm">PostgreSQL + Drizzle ORM</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">UI</Badge>
                            <span className="text-sm">shadcn/ui + Tailwind CSS</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Data Model</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Users - Authentication & authorization</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Vendors - Supplier information with risk levels</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Cases - PREPAY/RECOVERY case types</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Invoices - Source system agnostic records</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Recovery Items - Post-payment tracking</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5 text-primary" />
                      Duplicate Detection Logic
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      The duplicate detection engine uses a multi-factor scoring algorithm combining exact matching, 
                      fuzzy matching, and pattern recognition.
                    </p>
                    
                    <div className="bg-muted/30 p-4 rounded-lg font-mono text-sm">
                      <p className="font-semibold mb-2">Similarity Scoring Formula:</p>
                      <p>Total Score = (Amount Match × 40%) + (Vendor Match × 30%) + (Invoice Pattern × 30%)</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <h4 className="font-semibold mb-2">Detection Signals</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span>Exact Amount - Amounts match to the cent</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span>Vendor Match - Same vendor ID</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span>Invoice Pattern (Fuzzy) - Similarity &gt; 80%</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-amber-500" />
                            <span>Date Proximity - Within 7 days</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Risk Score Thresholds</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center justify-between p-2 bg-red-50 rounded">
                            <span>85-100: Critical</span>
                            <Badge variant="destructive">Auto-Hold</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-amber-50 rounded">
                            <span>70-84: High</span>
                            <Badge className="bg-amber-500">Review</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-blue-50 rounded">
                            <span>50-69: Medium</span>
                            <Badge variant="secondary">Flag</Badge>
                          </div>
                          <div className="flex items-center justify-between p-2 bg-green-50 rounded">
                            <span>0-49: Low</span>
                            <Badge variant="outline">Proceed</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Code className="h-5 w-5 text-primary" />
                      API Reference
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-green-600">GET</Badge>
                            <code className="text-sm">/api/dashboard/metrics</code>
                          </div>
                          <p className="text-sm text-muted-foreground">Returns aggregate metrics for the dashboard</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-green-600">GET</Badge>
                            <code className="text-sm">/api/cases</code>
                          </div>
                          <p className="text-sm text-muted-foreground">List all cases or filter by status</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-blue-600">POST</Badge>
                            <code className="text-sm">/api/payment-gate/validate</code>
                          </div>
                          <p className="text-sm text-muted-foreground">Validate a batch of invoices for duplicates</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-green-600">GET</Badge>
                            <code className="text-sm">/api/recovery</code>
                          </div>
                          <p className="text-sm text-muted-foreground">List all recovery items or filter by status</p>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge className="bg-green-600">GET</Badge>
                            <code className="text-sm">/api/vendors</code>
                          </div>
                          <p className="text-sm text-muted-foreground">List all vendors ordered by total spend</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="onboarding" className="mt-6">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-6 pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="h-5 w-5 text-primary" />
                      Implementation Timeline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
                      <div className="space-y-6 ml-10">
                        <div className="relative">
                          <div className="absolute -left-[26px] w-4 h-4 rounded-full bg-primary border-2 border-white" />
                          <div>
                            <h4 className="font-semibold">Discovery Phase</h4>
                            <p className="text-sm text-muted-foreground">1-2 weeks - Requirements gathering, system assessment</p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[26px] w-4 h-4 rounded-full bg-primary border-2 border-white" />
                          <div>
                            <h4 className="font-semibold">Configuration</h4>
                            <p className="text-sm text-muted-foreground">1 week - Vendor setup, threshold configuration</p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[26px] w-4 h-4 rounded-full bg-primary border-2 border-white" />
                          <div>
                            <h4 className="font-semibold">Integration</h4>
                            <p className="text-sm text-muted-foreground">2-4 weeks - ERP connection, file format mapping</p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[26px] w-4 h-4 rounded-full bg-primary border-2 border-white" />
                          <div>
                            <h4 className="font-semibold">Testing</h4>
                            <p className="text-sm text-muted-foreground">1-2 weeks - UAT, parallel processing</p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[26px] w-4 h-4 rounded-full bg-primary border-2 border-white" />
                          <div>
                            <h4 className="font-semibold">Training</h4>
                            <p className="text-sm text-muted-foreground">1 week - User training, documentation</p>
                          </div>
                        </div>
                        <div className="relative">
                          <div className="absolute -left-[26px] w-4 h-4 rounded-full bg-green-500 border-2 border-white" />
                          <div>
                            <h4 className="font-semibold">Go-Live</h4>
                            <p className="text-sm text-muted-foreground">1 day - Production deployment, monitoring</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4 font-medium">Total: 6-10 weeks depending on complexity</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      ERP Integration Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">SAP</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>• SAP ECC (F110 Export)</p>
                          <p>• SAP S/4HANA (API)</p>
                          <p>• RFC/BAPI Integration</p>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Oracle</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>• E-Business Suite</p>
                          <p>• Oracle Cloud</p>
                          <p>• REST API Integration</p>
                        </div>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Microsoft</h4>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <p>• Dynamics 365 F&O</p>
                          <p>• Data Management Export</p>
                          <p>• OData API Integration</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Upload className="h-5 w-5 text-primary" />
                      Supported File Formats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Input Formats</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">CSV</Badge>
                            <span className="text-sm">Comma-separated values</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">XML</Badge>
                            <span className="text-sm">ISO 20022 pain.001</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">IDOC</Badge>
                            <span className="text-sm">SAP REMADV/PAYEXT</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Excel</Badge>
                            <span className="text-sm">.xls, .xlsx formats</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Export Formats</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Excel</Badge>
                            <span className="text-sm">.xlsx with formatting</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">CSV</Badge>
                            <span className="text-sm">For data analysis</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">XML</Badge>
                            <span className="text-sm">For ERP import</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">JSON</Badge>
                            <span className="text-sm">For API consumers</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-primary" />
                      User Training Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">Session 1: System Overview</h4>
                          <p className="text-sm text-muted-foreground">Introduction, navigation, dashboard</p>
                        </div>
                        <Badge>1 hour</Badge>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">Session 2: Payment Gate Operations</h4>
                          <p className="text-sm text-muted-foreground">File upload, validation, decisions</p>
                        </div>
                        <Badge>2 hours</Badge>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">Session 3: Case Management</h4>
                          <p className="text-sm text-muted-foreground">Pre-Pay Cockpit, investigation workflow</p>
                        </div>
                        <Badge>2 hours</Badge>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">Session 4: Recovery Management</h4>
                          <p className="text-sm text-muted-foreground">Recovery workflow, vendor communication</p>
                        </div>
                        <Badge>1.5 hours</Badge>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">Session 5: Reporting & Analytics</h4>
                          <p className="text-sm text-muted-foreground">Dashboard metrics, exports, KPIs</p>
                        </div>
                        <Badge>1 hour</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Go-Live Checklist
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-3">Technical Readiness</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Production environment deployed</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Database connectivity verified</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Integration endpoints configured</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>All user accounts created</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Backup procedures tested</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-3">Business Readiness</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>All users completed training</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Support contacts documented</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Escalation procedures defined</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Parallel processing plan created</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span>Rollback plan documented</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="setup" className="mt-6">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-6 pr-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      Prerequisites
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Before you begin, ensure you have the following software installed:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Node.js</h4>
                        <p className="text-sm text-muted-foreground mb-2">v20.x or higher</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">node --version</code>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">PostgreSQL</h4>
                        <p className="text-sm text-muted-foreground mb-2">v14.x or higher</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">psql --version</code>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">npm</h4>
                        <p className="text-sm text-muted-foreground mb-2">v10.x or higher</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">npm --version</code>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Git</h4>
                        <p className="text-sm text-muted-foreground mb-2">Latest version</p>
                        <code className="text-xs bg-muted px-2 py-1 rounded">git --version</code>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-primary" />
                      Quick Start Commands
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-900 rounded-lg text-white font-mono text-sm">
                        <div className="space-y-3">
                          <div>
                            <span className="text-slate-400"># 1. Clone the repository</span>
                            <p>git clone &lt;repo-url&gt; dpps && cd dpps</p>
                          </div>
                          <div>
                            <span className="text-slate-400"># 2. Create PostgreSQL database</span>
                            <p>createdb dpps</p>
                          </div>
                          <div>
                            <span className="text-slate-400"># 3. Set environment variable</span>
                            <p>export DATABASE_URL="postgresql://localhost:5432/dpps"</p>
                          </div>
                          <div>
                            <span className="text-slate-400"># 4. Install dependencies</span>
                            <p>npm install</p>
                          </div>
                          <div>
                            <span className="text-slate-400"># 5. Push database schema</span>
                            <p>npm run db:push</p>
                          </div>
                          <div>
                            <span className="text-slate-400"># 6. Seed sample data (optional)</span>
                            <p>npx tsx server/seed.ts</p>
                          </div>
                          <div>
                            <span className="text-slate-400"># 7. Start development server</span>
                            <p>npm run dev</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      Database Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Step 1: Create Database</h4>
                        <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                          <p>CREATE DATABASE dpps;</p>
                          <p>CREATE USER dpps_user WITH ENCRYPTED PASSWORD 'your_password';</p>
                          <p>GRANT ALL PRIVILEGES ON DATABASE dpps TO dpps_user;</p>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Step 2: Configure Environment</h4>
                        <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                          DATABASE_URL=postgresql://dpps_user:your_password@localhost:5432/dpps
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">Step 3: Push Schema</h4>
                        <div className="p-3 bg-muted rounded-lg font-mono text-sm">
                          npm run db:push
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-primary" />
                      Running the Application
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Development Mode</h4>
                        <div className="p-3 bg-muted rounded-lg font-mono text-sm mb-2">
                          npm run dev
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Starts the server with hot reloading at http://localhost:5000
                        </p>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-2">Production Mode</h4>
                        <div className="p-3 bg-muted rounded-lg font-mono text-sm mb-2">
                          npm run build && npm start
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Builds and runs the optimized production version
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Environment Variables
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <code className="font-mono font-semibold">DATABASE_URL</code>
                          <p className="text-sm text-muted-foreground">PostgreSQL connection string</p>
                        </div>
                        <Badge variant="destructive">Required</Badge>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <code className="font-mono font-semibold">NODE_ENV</code>
                          <p className="text-sm text-muted-foreground">Environment mode (development/production)</p>
                        </div>
                        <Badge variant="secondary">Optional</Badge>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <code className="font-mono font-semibold">PORT</code>
                          <p className="text-sm text-muted-foreground">Server port (default: 5000)</p>
                        </div>
                        <Badge variant="secondary">Optional</Badge>
                      </div>
                      <div className="p-3 border rounded-lg flex justify-between items-center">
                        <div>
                          <code className="font-mono font-semibold">SESSION_SECRET</code>
                          <p className="text-sm text-muted-foreground">Session encryption key</p>
                        </div>
                        <Badge variant="secondary">Optional</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-primary" />
                      Troubleshooting
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg">
                        <h4 className="font-semibold text-amber-800">DATABASE_URL not set</h4>
                        <p className="text-sm text-amber-700">Ensure the .env file exists and contains DATABASE_URL</p>
                      </div>
                      <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg">
                        <h4 className="font-semibold text-amber-800">ECONNREFUSED error</h4>
                        <p className="text-sm text-amber-700">PostgreSQL is not running. Start it with: sudo systemctl start postgresql</p>
                      </div>
                      <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg">
                        <h4 className="font-semibold text-amber-800">Port 5000 in use</h4>
                        <p className="text-sm text-amber-700">Kill the process: lsof -i :5000 then kill -9 PID</p>
                      </div>
                      <div className="p-4 border-l-4 border-amber-500 bg-amber-50 rounded-r-lg">
                        <h4 className="font-semibold text-amber-800">Module not found</h4>
                        <p className="text-sm text-amber-700">Remove node_modules and reinstall: rm -rf node_modules && npm install</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="source" className="mt-6">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-6 pr-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-blue-800 font-medium">
                    Complete source code is available in the <code className="bg-blue-100 px-2 py-1 rounded">docs/DPPS_Source_Code_Reference.md</code> file. 
                    Each code block below can be copied directly into your project.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      shared/schema.ts - Data Models
                    </CardTitle>
                    <CardDescription>Database schema with Drizzle ORM - defines all tables and relationships</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap">
{`import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql\`gen_random_uuid()\`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Vendors table
export const vendors = pgTable("vendors", {
  id: varchar("id").primaryKey().default(sql\`gen_random_uuid()\`),
  name: text("name").notNull(),
  totalSpend: decimal("total_spend", { precision: 15, scale: 2 }).notNull().default("0"),
  duplicateCount: integer("duplicate_count").notNull().default(0),
  paymentTerms: text("payment_terms"),
  riskLevel: text("risk_level").notNull().default("low"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Cases table
export const cases = pgTable("cases", {
  id: varchar("id").primaryKey().default(sql\`gen_random_uuid()\`),
  caseNumber: text("case_number").notNull().unique(),
  status: text("status").notNull().default("open"),
  priority: text("priority").notNull().default("medium"),
  assignedTo: varchar("assigned_to").references(() => users.id),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
  potentialSavings: decimal("potential_savings", { precision: 15, scale: 2 }).notNull(),
  riskScore: integer("risk_score").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Invoices table
export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql\`gen_random_uuid()\`),
  caseId: varchar("case_id").references(() => cases.id),
  invoiceNumber: text("invoice_number").notNull(),
  vendorId: varchar("vendor_id").notNull().references(() => vendors.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  invoiceDate: timestamp("invoice_date").notNull(),
  docId: text("doc_id"),
  status: text("status").notNull().default("pending"),
  similarityScore: integer("similarity_score"),
  isDuplicate: boolean("is_duplicate").notNull().default(false),
  matchedInvoiceId: varchar("matched_invoice_id"),
  signals: text("signals").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Recovery Items table
export const recoveryItems = pgTable("recovery_items", {
  id: varchar("id").primaryKey().default(sql\`gen_random_uuid()\`),
  invoiceId: varchar("invoice_id").notNull().references(() => invoices.id),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  status: text("status").notNull().default("initiated"),
  vendorId: varchar("vendor_id").notNull().references(() => vendors.id),
  assignedAnalyst: varchar("assigned_analyst").references(() => users.id),
  recoveryMethod: text("recovery_method").notNull(),
  notes: text("notes"),
  initiatedDate: timestamp("initiated_date").notNull().defaultNow(),
  resolvedDate: timestamp("resolved_date"),
});

// Case Activities table
export const caseActivities = pgTable("case_activities", {
  id: varchar("id").primaryKey().default(sql\`gen_random_uuid()\`),
  caseId: varchar("case_id").notNull().references(() => cases.id),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(),
  notes: text("notes"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-primary" />
                      server/db.ts - Database Connection
                    </CardTitle>
                    <CardDescription>PostgreSQL connection using Drizzle ORM</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap">
{`import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-5 w-5 text-primary" />
                      server/index.ts - Express Server
                    </CardTitle>
                    <CardDescription>Main server entry point with middleware setup</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap">
{`import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";

const app = express();
const httpServer = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (req.path.startsWith("/api")) {
      console.log(\`\${req.method} \${req.path} \${res.statusCode} in \${duration}ms\`);
    }
  });
  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen({ port, host: "0.0.0.0" }, () => {
    console.log(\`Server running on port \${port}\`);
  });
})();`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Workflow className="h-5 w-5 text-primary" />
                      Duplicate Detection Algorithm
                    </CardTitle>
                    <CardDescription>Fuzzy matching with Levenshtein distance for invoice comparison</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap">
{`// Similarity calculation for duplicate detection
function calculateSimilarity(invoice1: any, invoice2: any): number {
  let score = 0;
  
  // Exact amount match (40 points)
  if (invoice1.amount === invoice2.amount) score += 40;
  
  // Vendor match (30 points)
  if (invoice1.vendorId === invoice2.vendorId) score += 30;
  
  // Invoice number similarity using Levenshtein (30 points max)
  const similarity = levenshteinSimilarity(
    invoice1.invoiceNumber, 
    invoice2.invoiceNumber
  );
  score += similarity * 30;
  
  return Math.min(100, Math.round(score));
}

function detectSignals(invoice1: any, invoice2: any): string[] {
  const signals = [];
  
  if (invoice1.amount === invoice2.amount) {
    signals.push("Exact Amount");
  }
  
  if (invoice1.vendorId === invoice2.vendorId) {
    signals.push("Vendor Match");
  }
  
  const similarity = levenshteinSimilarity(
    invoice1.invoiceNumber, 
    invoice2.invoiceNumber
  );
  if (similarity > 0.8) {
    signals.push("Invoice Pattern (Fuzzy)");
  }
  
  return signals;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

function levenshteinSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      package.json - Dependencies
                    </CardTitle>
                    <CardDescription>All required npm packages for the project</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap">
{`{
  "name": "dpps",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "tsx script/build.ts",
    "start": "NODE_ENV=production node dist/index.cjs",
    "db:push": "drizzle-kit push"
  },
  "dependencies": {
    "@tanstack/react-query": "^5.60.5",
    "drizzle-orm": "^0.39.3",
    "drizzle-zod": "^0.7.0",
    "express": "^4.21.2",
    "lucide-react": "^0.545.0",
    "pg": "^8.16.3",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "recharts": "^2.15.4",
    "wouter": "^3.3.5",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^5.0.4",
    "drizzle-kit": "^0.31.4",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.20.5",
    "typescript": "5.6.3",
    "vite": "^7.1.9"
  }
}`}
                    </pre>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      drizzle.config.ts - Database Config
                    </CardTitle>
                    <CardDescription>Drizzle Kit configuration for migrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-xs font-mono whitespace-pre-wrap">
{`import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL must be set");
}

export default defineConfig({
  out: "./migrations",
  schema: "./shared/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});`}
                    </pre>
                  </CardContent>
                </Card>

                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Full Source Code</h4>
                  <p className="text-green-700 text-sm">
                    For the complete source code including all API routes, storage layer, and seed data, 
                    see the file: <code className="bg-green-100 px-2 py-1 rounded">docs/DPPS_Source_Code_Reference.md</code>
                  </p>
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    
  );
}
