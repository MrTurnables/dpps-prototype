'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Info, Target, Zap, Shield, AlertTriangle, RefreshCw, Save } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface DppsConfig {
  id: string;
  criticalThreshold: number;
  highThreshold: number;
  mediumThreshold: number;
  invoicePatternTrigger: number;
  dateProximityDays: number;
  fuzzyAmountTolerance: string;
  legalEntityScope: string;
}

const DEFAULT_CONFIG: DppsConfig = {
  id: 'default',
  criticalThreshold: 85,
  highThreshold: 70,
  mediumThreshold: 50,
  invoicePatternTrigger: 80,
  dateProximityDays: 7,
  fuzzyAmountTolerance: "0.5",
  legalEntityScope: "within",
};

export default function SettingsPage() {
  const [config, setConfig] = useState<DppsConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        setConfig({
          ...DEFAULT_CONFIG,
          ...data,
          fuzzyAmountTolerance: String(parseFloat(data.fuzzyAmountTolerance || "0.005") * 100),
        });
      }
    } catch (error) {
      console.error('Failed to fetch config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveConfig = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/config', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          fuzzyAmountTolerance: (parseFloat(config.fuzzyAmountTolerance) / 100).toFixed(3),
        }),
      });

      if (res.ok) {
        toast.success("Configuration saved successfully", {
          description: "Changes are applied to all new payment validations.",
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error("Failed to save configuration", {
        description: "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const resetToDefaults = async () => {
    setIsResetting(true);
    try {
      const res = await fetch('/api/config', { method: 'POST' });
      if (res.ok) {
        await fetchConfig();
        toast.success("Configuration reset to defaults");
      }
    } catch {
      toast.error("Failed to reset configuration");
    } finally {
      setIsResetting(false);
    }
  };

  const getRiskBadge = (value: number, type: 'critical' | 'high' | 'medium') => {
    const styles = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    };
    const labels = {
      critical: 'Auto-Hold',
      high: 'Review',
      medium: 'Flag',
    };
    return (
      <Badge variant="outline" className={`${styles[type]} text-xs font-bold`}>
        {labels[type]}: {value}+
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground tracking-tight">DPPS Configuration</h1>
          <p className="text-muted-foreground mt-2">
            Manage duplicate detection thresholds, signals, and policy settings.
          </p>
        </div>
        <div className="p-3 bg-primary/5 rounded-xl border border-primary/10 flex items-center gap-3 max-w-[250px]">
          <Shield className="h-5 w-5 text-primary shrink-0" />
          <p className="text-[10px] leading-tight text-muted-foreground">
            Changes apply to all new payment validations immediately.
          </p>
        </div>
      </div>

      {/* Risk Threshold Visualization */}
      <Card className="border-2 border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Risk Score Thresholds
          </CardTitle>
          <CardDescription>
            Based on formula: Amount(40%) + Vendor(30%) + Invoice Pattern(30%)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            {getRiskBadge(config.criticalThreshold, 'critical')}
            {getRiskBadge(config.highThreshold, 'high')}
            {getRiskBadge(config.mediumThreshold, 'medium')}
            <Badge variant="outline" className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs font-bold">
              Low: 0-{config.mediumThreshold - 1}
            </Badge>
          </div>
          <div className="relative h-8 bg-gradient-to-r from-emerald-100 via-yellow-100 via-orange-100 to-red-200 rounded-lg overflow-hidden">
            <div
              className="absolute h-full w-1 bg-red-600"
              style={{ left: `${config.criticalThreshold}%` }}
            />
            <div
              className="absolute h-full w-1 bg-orange-500"
              style={{ left: `${config.highThreshold}%` }}
            />
            <div
              className="absolute h-full w-1 bg-yellow-500"
              style={{ left: `${config.mediumThreshold}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-between px-4 text-[10px] font-bold">
              <span className="text-emerald-700">LOW</span>
              <span className="text-yellow-700">MEDIUM</span>
              <span className="text-orange-700">HIGH</span>
              <span className="text-red-700">CRITICAL</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {/* Detection Thresholds Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <CardTitle>Risk Classification Thresholds</CardTitle>
                <CardDescription>Score ranges that determine action requirements</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Critical Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-100 text-red-700 border-red-200">Critical</Badge>
                    <Label className="text-base font-bold">Auto-Hold Threshold</Label>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-[400px]">
                    Scores ≥ {config.criticalThreshold}: Automatically held. Manager approval required to release.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    className="w-20 font-mono font-bold"
                    value={config.criticalThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, criticalThreshold: parseInt(e.target.value) || 85 }))}
                    min={70}
                    max={100}
                  />
                  <span className="text-sm font-bold text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* High Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-200">High</Badge>
                    <Label className="text-base font-bold">Review Threshold</Label>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-[400px]">
                    Scores {config.highThreshold}-{config.criticalThreshold - 1}: Held for analyst review. Notes required to release.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    className="w-20 font-mono font-bold"
                    value={config.highThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, highThreshold: parseInt(e.target.value) || 70 }))}
                    min={50}
                    max={84}
                  />
                  <span className="text-sm font-bold text-muted-foreground">%</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Medium Threshold */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium</Badge>
                    <Label className="text-base font-bold">Flag Threshold</Label>
                  </div>
                  <p className="text-xs text-muted-foreground max-w-[400px]">
                    Scores {config.mediumThreshold}-{config.highThreshold - 1}: Flagged for awareness. Can proceed with override.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Input
                    type="number"
                    className="w-20 font-mono font-bold"
                    value={config.mediumThreshold}
                    onChange={(e) => setConfig(prev => ({ ...prev, mediumThreshold: parseInt(e.target.value) || 50 }))}
                    min={30}
                    max={69}
                  />
                  <span className="text-sm font-bold text-muted-foreground">%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Signal Configuration Card */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-muted/30 border-b">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <div>
                <CardTitle>Detection Signals</CardTitle>
                <CardDescription>Fine-tune when each signal triggers</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* Invoice Pattern Trigger */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-bold">Invoice Pattern (Fuzzy) Trigger</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        Levenshtein similarity percentage above which the Invoice Pattern signal fires. Catches OCR errors like O vs 0.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground">Similarity threshold: {config.invoicePatternTrigger}%</p>
              </div>
              <div className="flex items-center gap-3 w-32">
                <Slider
                  value={[config.invoicePatternTrigger]}
                  onValueChange={([v]) => setConfig(prev => ({ ...prev, invoicePatternTrigger: v }))}
                  min={60}
                  max={95}
                  step={5}
                  className="w-24"
                />
                <span className="text-sm font-mono font-bold w-10">{config.invoicePatternTrigger}%</span>
              </div>
            </div>

            <Separator />

            {/* Date Proximity */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-bold">Date Proximity Window</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        Signal fires when invoice dates are within this many days. Catches re-submitted invoices.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground">Invoices within {config.dateProximityDays} days apart</p>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={String(config.dateProximityDays)}
                  onValueChange={(v) => setConfig(prev => ({ ...prev, dateProximityDays: parseInt(v) }))}
                >
                  <SelectTrigger className="w-24 font-mono font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[3, 5, 7, 14, 30].map(d => (
                      <SelectItem key={d} value={String(d)}>{d} days</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Fuzzy Amount Tolerance */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-bold">Fuzzy Amount Tolerance</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        Signal fires when amounts differ by less than this percentage. Catches discount/rounding duplicates.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground">Amount difference &lt; {config.fuzzyAmountTolerance}%</p>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={config.fuzzyAmountTolerance}
                  onValueChange={(v) => setConfig(prev => ({ ...prev, fuzzyAmountTolerance: v }))}
                >
                  <SelectTrigger className="w-24 font-mono font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["0.1", "0.25", "0.5", "1.0", "2.0"].map(t => (
                      <SelectItem key={t} value={t}>{t}%</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Legal Entity Scope */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Label className="text-base font-bold">Legal Entity Scope</Label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3.5 w-3.5 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-[250px]">
                        Whether to match duplicates only within the same legal entity, or across all entities.
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <p className="text-xs text-muted-foreground">
                  {config.legalEntityScope === 'within'
                    ? 'Match within same legal entity only'
                    : 'Match across all legal entities'}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value={config.legalEntityScope}
                  onValueChange={(v) => setConfig(prev => ({ ...prev, legalEntityScope: v }))}
                >
                  <SelectTrigger className="w-40 font-bold">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="within">Within Entity</SelectItem>
                    <SelectItem value="cross">Cross-Entity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            className="font-bold"
            onClick={resetToDefaults}
            disabled={isResetting}
          >
            {isResetting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Resetting...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset Defaults
              </>
            )}
          </Button>
          <Button
            className="font-bold px-8 shadow-lg"
            onClick={saveConfig}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
