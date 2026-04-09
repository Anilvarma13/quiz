"use client"

import { useEffect } from "react"
import "./globals.css"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Home, RefreshCcw, AlertCircle } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="en">
      <body className="antialiased font-sans bg-background text-foreground">
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="w-full max-w-md space-y-8">
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-destructive/10">
                <AlertCircle className="w-12 h-12 text-destructive" />
              </div>
              <h1 className="text-3xl font-black tracking-tight">System Error</h1>
              <p className="text-xl font-medium text-muted-foreground">
                A critical error occurred while loading Quizzy AI.
              </p>
              {error.message && (
                <p className="text-sm text-muted-foreground/60 font-mono bg-muted/30 p-3 rounded-xl border">
                  {error.message}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => reset()}
                className="h-14 px-8 rounded-3xl gap-3 text-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
              >
                <RefreshCcw className="w-5 h-5" />
                Try Again
              </Button>
              <Link href="/" className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  className="h-14 px-8 rounded-3xl gap-3 text-lg font-bold border-2 w-full"
                >
                  <Home className="w-5 h-5" />
                  Go Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
