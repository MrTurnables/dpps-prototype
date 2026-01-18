'use client';

import { Sidebar } from "./Sidebar";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, X, Send, Search, Bot, FileText, ShieldAlert } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-secondary/30">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <header className="h-12 border-b bg-card flex items-center px-8 justify-between sticky top-0 z-10 shadow-sm">
          <div className="text-sm font-medium text-muted-foreground truncate">
            Home / DPPS / <span className="text-foreground">Prevention Control</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
              JD
            </div>
          </div>
        </header>
        <div className="container mx-auto p-8 max-w-7xl animate-in fade-in duration-500 relative">
          {children}

          {/* Global Chatbot Toggle */}
          <div className="fixed bottom-6 right-6 z-[100]">
            <Button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="h-14 w-14 rounded-full shadow-2xl bg-indigo-600 hover:bg-indigo-700 text-white p-0 transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
              data-testid="button-toggle-chatbot"
            >
              {isChatOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
            </Button>

            <AnimatePresence>
              {isChatOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  className="absolute bottom-16 right-0 w-80 sm:w-96 h-[500px] bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
                >
                  {/* Chat Header */}
                  <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">DPPS Assistant</h3>
                        <p className="text-[10px] text-white/70">Online • AI Powered</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/10 h-8 w-8" onClick={() => setIsChatOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                    <div className="flex gap-2">
                      <div className="h-7 w-7 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                        <Bot className="h-4 w-4 text-indigo-600" />
                      </div>
                      <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 text-sm">
                        Hello! I&apos;m your DPPS AI assistant. How can I help you navigate the tool or search for invoices today?
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase text-center py-2">Suggested Actions</p>
                      <div className="grid gap-2">
                        <Button variant="outline" size="sm" className="justify-start text-xs font-medium border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200" onClick={() => { }}>
                          <Search className="h-3 w-3 mr-2" /> &quot;Search for Invoice INV-2024-001&quot;
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start text-xs font-medium border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200" onClick={() => { }}>
                          <ShieldAlert className="h-3 w-3 mr-2" /> &quot;Check pending duplicates&quot;
                        </Button>
                        <Button variant="outline" size="sm" className="justify-start text-xs font-medium border-slate-200 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200" onClick={() => { }}>
                          <FileText className="h-3 w-3 mr-2" /> &quot;How to export results?&quot;
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Chat Input */}
                  <div className="p-4 bg-white border-t">
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="Ask anything..."
                          className="w-full pl-3 pr-10 py-2 bg-slate-100 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
                        />
                        <Search className="absolute right-3 top-2.5 h-4 w-4 text-slate-400" />
                      </div>
                      <Button size="icon" className="bg-indigo-600 hover:bg-indigo-700 h-9 w-9 shrink-0">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
