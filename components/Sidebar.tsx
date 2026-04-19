"use client"

import { Clock, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col h-full bg-white/80 backdrop-blur-xl w-72 p-8 border-r border-slate-200/60 shadow-[4px_0_24px_rgba(0,0,0,0.02)]", className)}>
      <div className="flex items-center gap-3 mb-12">
        <div className="w-10 h-10 rounded-[0.8rem] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/20">
          <span className="text-white font-extrabold text-xl font-sans relative -top-[1px]">Q</span>
        </div>
        <div className="flex flex-col">
          <h2 className="text-slate-900 font-bold text-lg leading-tight tracking-tight">𝐐𝐮𝐢𝐳𝐳𝐲</h2>
          <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-indigo-500">𝐀𝐈</span>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 text-slate-400">
        <Clock className="w-4 h-4" />
        <span className="text-[11px] font-bold uppercase tracking-wider">Recent Sessions</span>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <p className="text-xs font-bold italic text-slate-300 uppercase tracking-wider">
          no data archived.
        </p>
      </div>

      <div className="mt-auto pt-6 border-t border-slate-200/60">
        <div className="flex items-center justify-between hover:bg-slate-50 p-3 -mx-3 rounded-2xl transition-colors cursor-pointer group border border-transparent hover:border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-white group-hover:text-indigo-600 group-hover:shadow-sm transition-all">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-bold text-slate-700">Local Space</p>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Offline Sandbox</p>
            </div>
          </div>
          <Info className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" />
        </div>
      </div>
    </div>
  )
}

