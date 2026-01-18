'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  FileCheck,
  History,
  BarChart3,
  Settings,
  ShieldCheck as ShieldIcon,
  Database,
  Shield,
  BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Open Potential Duplicates", href: "/pre-pay", icon: ShieldAlert },
  { name: "Payment Gate", href: "/gate", icon: FileCheck },
  { name: "Recovery", href: "/recovery", icon: History },
  { name: "Reports", href: "/reports", icon: BarChart3 },
  { name: "Documentation", href: "/docs", icon: BookOpen },
  { name: "Access Control", href: "/access", icon: Shield },
  { name: "Integrations", href: "/integrations", icon: Database },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-[#1c2d3d] text-white border-r border-[#2c3e50] transition-all duration-300 ease-in-out z-20 shadow-xl">
      <div className="flex h-12 items-center px-4 bg-[#121c26] border-b border-[#2c3e50]/50">
        <ShieldIcon className="h-6 w-6 text-[#3498db] shrink-0" />
        <span className="text-sm font-bold font-heading tracking-tight ml-4 whitespace-nowrap text-white">DPPS Enterprise</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <TooltipProvider key={item.name} delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={item.href} className={cn(
                      "group/item flex items-center h-10 px-3 py-2 text-sm font-bold rounded-sm transition-all",
                      isActive
                        ? "bg-[#3498db] text-white shadow-sm"
                        : "text-slate-100 hover:bg-[#2c3e50] hover:text-white"
                    )}>
                      <item.icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-colors",
                          isActive ? "text-white" : "text-slate-300 group-hover/item:text-white"
                        )}
                      />
                      <span className="ml-4 whitespace-nowrap">{item.name}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-[#121c26] border-[#2c3e50] text-white text-[10px] font-bold">
                    {item.name === "Reports" ? "View system efficiency and prevention metrics" : `Go to ${item.name}`}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </nav>
      </div>

      <div className="bg-[#121c26] p-4 overflow-hidden border-t border-[#2c3e50]">
        <div className="flex items-center">
          <div className="h-9 w-9 rounded-sm bg-[#3498db] flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-inner">
            JD
          </div>
          <div className="ml-4 whitespace-nowrap">
            <p className="text-sm font-bold text-white">Jane Doe</p>
            <p className="text-xs text-slate-300 font-semibold uppercase tracking-tighter">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
}
