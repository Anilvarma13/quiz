"use client"

import { History, UserCircle, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const historyItems = [
  { id: 1, title: "French Vocabulary", date: "2m ago" },
  { id: 2, title: "React Hooks Basics", date: "1h ago" },
  { id: 3, title: "History of Rome", date: "Yesterday" },
  { id: 4, title: "Quantum Physics", date: "2 days ago" },
]

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col h-full bg-card/50 border-r w-64 p-6", className)}>
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <History className="text-primary-foreground w-5 h-5" />
        </div>
        <h2 className="text-xl font-semibold tracking-tight">History</h2>
      </div>

      <nav className="flex-1 space-y-4 overflow-y-auto">
        {historyItems.map((item) => (
          <div
            key={item.id}
            className="group relative p-3 rounded-xl hover:bg-accent transition-colors cursor-pointer border border-transparent hover:border-border"
          >
            <p className="text-sm font-medium">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.date}</p>
          </div>
        ))}
        
        <Button variant="ghost" className="w-full justify-start gap-2 hover:bg-accent rounded-xl">
          <Plus className="w-4 h-4" />
          <span className="text-sm">New Session</span>
        </Button>
      </nav>

      <div className="mt-auto pt-6 border-t">
        <Button variant="ghost" className="w-full justify-start gap-3 p-3 h-auto hover:bg-accent rounded-xl">
          <UserCircle className="w-6 h-6" />
          <div className="text-left">
            <p className="text-sm font-semibold">Account</p>
            <p className="text-xs text-muted-foreground">Settings & Profile</p>
          </div>
        </Button>
      </div>
    </div>
  )
}
