"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Upload, Zap, BookOpen, FileText, X, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateContent } from "@/app/actions"

type Mode = "quiz" | "flashcard"
type QuizSize = 8 | 10 | 12

export default function HomePage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("quiz")
  const [quizSize, setQuizSize] = useState<QuizSize>(10)
  const [notes, setNotes] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (!selected) return
    setFile(selected)
    setNotes("")
    setError(null)
  }

  function removeFile() {
    setFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function handleSubmit() {
    setError(null)
    if (!notes.trim() && !file) {
      setError("Please paste your notes or upload a file.")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("mode", mode)
      formData.append("count", String(quizSize))
      formData.append("notes", notes)
      if (file) formData.append("file", file)

      try {
        const result = await generateContent(formData)
        sessionStorage.setItem("quizzy_session", JSON.stringify(result.data))
        router.push(`/${result.mode}`)
      } catch (err: any) {
        setError(err?.message || "Something went wrong. Please try again.")
      }
    })
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar - Hidden on mobile */}
      <Sidebar className="hidden lg:flex" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 overflow-y-auto">
        <div className="w-full max-w-4xl space-y-12 text-center">

          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-6xl md:text-7xl font-black tracking-tight text-foreground">
              Quizzy <span className="text-primary">AI</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-medium">
              Learn any topic with fun
            </p>
          </div>

          {/* Main Card */}
          <Card className="p-8 md:p-12 bg-card/60 backdrop-blur-md border-2 rounded-[3rem] shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

              {/* Left: Notes Input */}
              <div className="space-y-4">
                {/* Textarea */}
                {!file && (
                  <textarea
                    value={notes}
                    onChange={(e) => { setNotes(e.target.value); setError(null) }}
                    placeholder="Paste your notes here..."
                    rows={8}
                    className={cn(
                      "w-full resize-none rounded-[1.5rem] border-2 border-dashed bg-background/60 p-5 text-sm",
                      "placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 transition-colors",
                      "hover:border-primary/40"
                    )}
                  />
                )}

                {/* File Preview */}
                {file && (
                  <div className="aspect-square rounded-[2rem] border-2 border-primary/40 bg-primary/5 flex flex-col items-center justify-center gap-4 p-6 relative">
                    <div className="p-5 rounded-3xl bg-accent">
                      <FileText className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="text-base font-bold truncate max-w-[180px]">{file.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={removeFile}
                      className="absolute top-4 right-4 p-1.5 rounded-full bg-muted hover:bg-destructive hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Upload Button */}
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-2xl gap-2 border-2 hover:border-primary/60"
                    onClick={() => fileInputRef.current?.click()}
                    type="button"
                  >
                    <Upload className="w-4 h-4" />
                    Upload PDF, DOCX, or TXT
                  </Button>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-sm text-destructive font-medium px-1">{error}</p>
                )}
              </div>

              {/* Right: Controls */}
              <div className="space-y-8 text-left">
                {/* Mode Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1">
                    Select Mode
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setMode("quiz")}
                      className={cn(
                        "h-16 rounded-2xl gap-3 border-2 transition-all",
                        mode === "quiz"
                          ? "bg-primary text-primary-foreground border-primary shadow-lg"
                          : "hover:border-primary/50"
                      )}
                    >
                      <Zap className="w-5 h-5" />
                      <span className="font-bold">Quiz</span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setMode("flashcard")}
                      className={cn(
                        "h-16 rounded-2xl gap-3 border-2 transition-all",
                        mode === "flashcard"
                          ? "bg-primary text-primary-foreground border-primary shadow-lg"
                          : "hover:border-primary/50"
                      )}
                    >
                      <BookOpen className="w-5 h-5" />
                      <span className="font-bold">Flashcard</span>
                    </Button>
                  </div>
                </div>

                {/* Quiz Size */}
                <div className="space-y-4">
                  <label className="text-sm font-bold uppercase tracking-widest text-muted-foreground px-1">
                    {mode === "quiz" ? "Quiz Size" : "Card Count"}
                  </label>
                  <div className="flex gap-2">
                    {([8, 10, 12] as QuizSize[]).map((size) => (
                      <Button
                        key={size}
                        onClick={() => setQuizSize(size)}
                        variant="secondary"
                        className={cn(
                          "flex-1 h-12 rounded-xl text-lg font-bold transition-all",
                          quizSize === size
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "hover:bg-primary/10"
                        )}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Info */}
                <p className="text-xs text-muted-foreground px-1 leading-relaxed">
                  AI will generate {quizSize} {mode === "quiz" ? "multiple-choice questions" : "flashcards"} from your notes using Groq · Llama 3.3 70B
                </p>
              </div>
            </div>

            {/* Generate Button */}
            <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12">
              <Button
                size="icon"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] md:rounded-[2rem] shadow-xl hover:scale-110 active:scale-95 transition-all disabled:opacity-60 disabled:scale-100"
              >
                {isPending ? (
                  <Loader2 className="w-8 h-8 md:w-10 md:h-10 animate-spin" />
                ) : (
                  <ArrowRight className="w-8 h-8 md:w-10 md:h-10" />
                )}
              </Button>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
