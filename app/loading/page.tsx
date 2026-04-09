import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"

export default function LoadingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 gap-12">
      <div className="relative">
        <Loader2 className="w-20 h-20 text-primary animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 bg-background rounded-full" />
        </div>
      </div>

      <div className="w-full max-w-2xl space-y-8 animate-pulse text-center">
        <h2 className="text-3xl font-bold tracking-tight text-muted-foreground">
          Generating your quiz...
        </h2>
        
        <div className="space-y-4">
          <Skeleton className="h-32 w-full rounded-[2rem]" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
          </div>
        </div>
        
        <p className="text-muted-foreground font-medium">
          Curating the best questions for your notes
        </p>
      </div>
    </div>
  )
}
