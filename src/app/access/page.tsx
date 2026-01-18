'use client';

import * as React from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Fingerprint,
  Key,
  Plus,
  ExternalLink,
  Shield,
  Settings,
  RefreshCw
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";

export default function AccessManagement() {
  const users = [
    { name: "Jane Doe", email: "jane.doe@enterprise.com", role: "Administrator", status: "Active", method: "SSO (Okta)" },
    { name: "John Smith", email: "john.smith@enterprise.com", role: "AP Manager", status: "Active", method: "SSO (Okta)" },
    { name: "Robert Wilson", email: "robert.wilson@enterprise.com", role: "Auditor", status: "Inactive", method: "SSO (Okta)" },
  ];

  const [roles] = React.useState([
    { id: "admin", name: "Administrator", permissions: "Full system access", color: "bg-purple-500" },
    { id: "ap_mgr", name: "AP Manager", permissions: "Review & Release payments", color: "bg-blue-500" },
    { id: "auditor", name: "Auditor", permissions: "Read-only audit logs", color: "bg-slate-500" },
    { id: "connector", name: "Connector", permissions: "API ingestion only", color: "bg-emerald-500" },
  ]);

  return (

    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-foreground">Access Control Cockpit</h1>
          <p className="text-muted-foreground mt-2">
            Provision user roles, manage RBAC policies, and configure SSO endpoints.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-300">
            <Settings className="mr-2 h-4 w-4" /> Policy Config
          </Button>
          <Button className="bg-[#3498db] hover:bg-[#2980b9]">
            <Plus className="mr-2 h-4 w-4" /> Invite User
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enterprise Roles (RBAC)</CardTitle>
            <CardDescription>Available roles and their default permission sets.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="flex items-center justify-between p-3 rounded border bg-muted/30">
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${role.color}`} />
                    <div>
                      <p className="text-sm font-bold">{role.name}</p>
                      <p className="text-xs text-muted-foreground">{role.permissions}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">Configure</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed">
                <Plus className="mr-2 h-4 w-4" /> Define Custom Role
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-t-4 border-t-[#3498db]">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">SSO Provider Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-[#3498db]/10 rounded-lg">
                    <Fingerprint className="h-5 w-5 text-[#3498db]" />
                  </div>
                  <span className="font-bold">Okta Enterprise</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-500">Connected</Badge>
                  <Button variant="ghost" size="icon" className="h-8 w-8"><Settings className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Directory Sync Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="mr-2 h-4 w-4" /> Force SCIM Resync
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive">
                <Shield className="mr-2 h-4 w-4" /> Revoke All External Sessions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Directory</CardTitle>
          <CardDescription>Managed via Single Sign-On directory synchronization.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Auth Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.email}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold">{user.name}</span>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-semibold">{user.role}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-xs">
                      <Key className="h-3 w-3 text-muted-foreground" />
                      {user.method}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span className="text-sm">{user.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SSO Configuration</CardTitle>
          <CardDescription>Configure SAML 2.0 or OIDC for enterprise identity providers.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Entity ID / Issuer URL</Label>
              <div className="flex gap-2">
                <input readOnly value="https://sso.enterprise.com/saml/metadata" className="flex-1 p-2 rounded border bg-muted font-mono text-xs" />
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>ACS URL (Callback)</Label>
              <div className="flex gap-2">
                <input readOnly value="https://api.dpps.enterprise.com/v1/auth/sso/callback" className="flex-1 p-2 rounded border bg-muted font-mono text-xs" />
                <Button variant="outline" size="sm">Copy</Button>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-900 rounded-lg border border-slate-700">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <Shield className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <h4 className="text-white font-bold text-sm">Automated Provisioning Enabled</h4>
                <p className="text-slate-400 text-xs mt-1">
                  SCIM 2.0 is active. Users added to the &apos;DPPS-Users&apos; group in Okta will be automatically provisioned with the &apos;Auditor&apos; role.
                </p>
                <Button variant="link" className="text-[#3498db] h-auto p-0 mt-2 text-xs">
                  View Mapping Rules <ExternalLink className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

  );
}
