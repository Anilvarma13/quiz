"use client"

import { useRef, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Sidebar } from "@/components/Sidebar"
import { Sparkles, Upload, ArrowRight, Loader2, Layers, BrainCircuit, X, Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { generateContent } from "@/app/actions"

type Mode = "quiz" | "flashcard"
type Intensity = "easy" | "medium" | "hard" | "mixed"
type QuizSize = 5 | 10 | 15 | 20

export default function HomePage() {
  const router = useRouter()
  const [mode, setMode] = useState<Mode>("quiz")
  const [intensity, setIntensity] = useState<Intensity>("mixed")
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
      setError("Please provide study materials.")
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("mode", mode)
      formData.append("count", String(quizSize))
      formData.append("difficulty", intensity)
      formData.append("notes", notes)
      if (file) formData.append("file", file)

      try {
        const result = await generateContent(formData)
        sessionStorage.setItem("quizzy_session", JSON.stringify({ ...result.data, difficulty: intensity }))
        router.push(`/${result.mode}`)
      } catch (err: any) {
        setError(err?.message || "Synthesis failed. Please try again.")
      }
    })
  }

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Decor: Aurora Orbs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-indigo-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-30 animate-pulse -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] opacity-30 translate-x-1/3 translate-y-1/3"></div>
      
      {/* Sidebar */}
      <Sidebar className="hidden lg:flex z-20" />

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center pt-16 md:pt-20 px-6 md:px-12 overflow-y-auto relative z-10 w-full">
        
        <div className="w-full max-w-5xl flex flex-col items-center space-y-10">
          
          {/* Hero Section */}
          <div className="text-center space-y-5 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/20 bg-white/40 shadow-sm backdrop-blur-md text-[11px] font-bold tracking-[0.1em] text-indigo-700 uppercase">
              <Zap className="w-3 h-3 text-indigo-500 shrink-0" />
              AI-Powered Cognitive Engine
            </div>
            
            <h1 className="text-5xl md:text-7xl text-slate-900 font-extrabold tracking-tight">
              Master Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Knowledge Base
              </span>
            </h1>
            
            <p className="text-slate-500 text-lg md:text-xl font-medium max-w-lg mx-auto">
              Transform documents and notes into powerful study tools instantly with artificial intelligence.
            </p>
          </div>

          {/* Main Interface Card (Glassmorphism) */}
          <div className="w-full bg-white/60 backdrop-blur-3xl rounded-[2.5rem] border border-white/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] p-8 md:p-10 transition-all duration-300 hover:shadow-[0_25px_60px_-15px_rgba(99,102,241,0.1)]">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10 lg:gap-16">
              
              {/* Left Column: Input */}
              <div className="flex flex-col h-full space-y-6">
                <div className="bg-slate-50/50 rounded-3xl border border-slate-200/60 p-6 flex-1 min-h-[300px] flex flex-col transition-all focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-300">
                  {!file ? (
                    <textarea
                      value={notes}
                      onChange={(e) => { setNotes(e.target.value); setError(null) }}
                      placeholder="Enter the text or topics you want to study..."
                      className="w-full h-full resize-none bg-transparent placeholder:text-slate-400 text-slate-700 text-lg font-medium focus:outline-none placeholder:font-normal leading-relaxed"
                    />
                  ) : (
                    <div className="w-full h-full rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50 flex flex-col items-center justify-center p-8 relative group">
                      <div className="p-4 rounded-xl bg-white shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <Layers className="w-8 h-8 text-indigo-600" />
                      </div>
                      <p className="text-lg font-bold text-slate-800 mb-1 max-w-[200px] truncate">{file.name}</p>
                      <p className="text-sm text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                      <button onClick={removeFile} className="absolute top-4 right-4 p-2 rounded-full bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 shadow-sm transition-all focus:outline-none">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-slate-200"></div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">or upload file</span>
                  <div className="flex-1 h-px bg-slate-200"></div>
                </div>

                <div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-white border border-slate-200 hover:border-indigo-300 rounded-[1.5rem] py-4 flex items-center justify-center gap-3 text-slate-600 hover:text-indigo-600 shadow-sm transition-all hover:shadow-md active:scale-[0.98]"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="font-bold">Select Document (PDF, DOCX)</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  {error && <p className="text-sm text-red-500 font-medium text-center mt-3 bg-red-50 p-2 rounded-lg">{error}</p>}
                </div>
              </div>

              {/* Right Column: Controls */}
              <div className="space-y-8 flex flex-col justify-between">
                
                {/* Mode Selection */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Study Mode</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setMode("quiz")}
                      className={cn(
                        "flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all gap-2",
                        mode === "quiz"
                          ? "border-indigo-500 bg-indigo-50/50 text-indigo-700 shadow-sm"
                          : "border-slate-200 bg-white/50 text-slate-500 hover:bg-indigo-50/30 hover:border-indigo-200"
                      )}
                    >
                      <BrainCircuit className="w-6 h-6" />
                      <span className="font-bold text-sm">Quiz</span>
                    </button>
                    <button
                      onClick={() => setMode("flashcard")}
                      className={cn(
                        "flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all gap-2",
                        mode === "flashcard"
                          ? "border-purple-500 bg-purple-50/50 text-purple-700 shadow-sm"
                          : "border-slate-200 bg-white/50 text-slate-500 hover:bg-purple-50/30 hover:border-purple-200"
                      )}
                    >
                      <Layers className="w-6 h-6" />
                      <span className="font-bold text-sm">Flashcards</span>
                    </button>
                  </div>
                </div>

                {/* Question Count & Intensity Group */}
                <div className="p-5 rounded-3xl bg-slate-50/50 border border-slate-200/60 space-y-6">
                  {/* Intensity */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Difficulty</h3>
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full capitalize">{intensity}</span>
                    </div>
                    <div className="flex gap-2">
                      {(["easy", "medium", "hard", "mixed"] as Intensity[]).map((int) => (
                        <button
                          key={int}
                          onClick={() => setIntensity(int)}
                          className={cn(
                            "flex-1 py-2.5 rounded-xl text-xs font-bold capitalize transition-all",
                            intensity === int 
                              ? "bg-slate-800 text-white shadow-md relative scale-105"
                              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                          )}
                        >
                          {int}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Count */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center px-1">
                      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Questions</h3>
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">{quizSize} Total</span>
                    </div>
                    <div className="flex bg-slate-200/50 rounded-2xl p-1 relative">
                      {([5, 10, 15, 20] as QuizSize[]).map((size) => (
                        <button
                          key={size}
                          onClick={() => setQuizSize(size)}
                          className={cn(
                            "flex-1 py-2.5 rounded-xl text-sm font-bold transition-all z-10",
                            quizSize === size 
                              ? "bg-white text-slate-900 shadow-sm"
                              : "text-slate-500 hover:text-slate-800"
                          )}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-[1.5rem] py-5 px-6 flex items-center justify-between transition-all group disabled:opacity-70 disabled:pointer-events-none shadow-lg shadow-indigo-500/25 active:scale-[0.98]"
                >
                  <span className="text-sm font-bold tracking-widest uppercase">Start Generation</span>
                  {isPending ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
