"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { QuizQuestion } from "@/components/QuizQuestion"
import { ScoreCircle } from "@/components/ScoreCircle"
import { ChevronLeft, ChevronRight, BookOpen, CheckCircle2, XCircle, Home, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import type { QuizQuestion as QuizQuestionType } from "@/lib/ai"

const FALLBACK_QUESTIONS: QuizQuestionType[] = [
  {
    question: "What is the capital of France?",
    options: ["A. London", "B. Paris", "C. Berlin", "D. Madrid"],
    correctIndex: 1,
    explanation: "Paris is the capital and largest city of France.",
  },
]

export default function QuizPage() {
  const searchParams = useSearchParams()
  const rawData = searchParams.get("data")

  const questions: QuizQuestionType[] = (() => {
    if (!rawData) return FALLBACK_QUESTIONS
    try {
      const parsed = JSON.parse(decodeURIComponent(rawData))
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : FALLBACK_QUESTIONS
    } catch {
      return FALLBACK_QUESTIONS
    }
  })()

  const total = questions.length
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [showResults, setShowResults] = useState(false)

  const currentQ = questions[currentIndex]
  const progressValue = ((currentIndex + 1) / total) * 100

  function handleSelect(option: string) {
    setAnswers((prev) => ({ ...prev, [currentIndex]: option }))
  }

  function handleNext() {
    if (currentIndex < total - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      setShowResults(true)
    }
  }

  function handlePrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1)
  }

  // Score calculation
  const score = questions.reduce((acc, q, i) => {
    const selectedOption = answers[i]
    if (!selectedOption) return acc
    const selectedIndex = q.options.findIndex((o) => o === selectedOption)
    return acc + (selectedIndex === q.correctIndex ? 1 : 0)
  }, 0)

  // Results screen
  if (showResults) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col items-center gap-12 max-w-3xl mx-auto">
        <div className="w-full flex justify-start">
          <Link href="/">
            <Button variant="outline" className="rounded-2xl gap-2 font-bold border-2">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center gap-6 py-4">
          <ScoreCircle score={score} total={total} size={220} strokeWidth={14} />
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              {score >= total * 0.8 ? "Excellent work! 🎉" : score >= total * 0.5 ? "Good effort! 👍" : "Keep practicing! 💪"}
            </h2>
            <p className="text-muted-foreground font-medium mt-1">
              You answered {score} out of {total} correctly.
            </p>
          </div>
        </div>

        <div className="w-full space-y-4">
          <h3 className="text-xl font-bold px-1">Review</h3>
          {questions.map((q, i) => {
            const selectedOption = answers[i]
            const selectedIndex = q.options.findIndex((o) => o === selectedOption)
            const isCorrect = selectedIndex === q.correctIndex
            const notAnswered = !selectedOption
            return (
              <Card key={i} className="p-6 rounded-[2rem] border-2 bg-card/50">
                <div className="flex gap-4 items-start">
                  {notAnswered ? (
                    <XCircle className="w-7 h-7 text-muted-foreground shrink-0 mt-0.5" />
                  ) : isCorrect ? (
                    <CheckCircle2 className="w-7 h-7 text-green-500 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-7 h-7 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-2 flex-1">
                    <p className="text-base font-bold leading-tight">{q.question}</p>
                    {!isCorrect && (
                      <div className="space-y-1">
                        {!notAnswered && (
                          <p className="text-sm text-destructive font-medium">
                            Your answer: {selectedOption}
                          </p>
                        )}
                        <div className="inline-block px-4 py-2 bg-green-500/10 text-green-700 dark:text-green-400 rounded-xl text-sm font-semibold border border-green-500/20">
                          Correct: {q.options[q.correctIndex]}
                        </div>
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground leading-relaxed">{q.explanation}</p>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        <div className="w-full flex flex-col sm:flex-row gap-4 justify-center pb-8">
          <Button
            onClick={() => { setShowResults(false); setCurrentIndex(0); setAnswers({}) }}
            variant="outline"
            className="h-14 px-8 rounded-3xl gap-3 text-lg font-bold border-2"
          >
            <RefreshCcw className="w-5 h-5" />
            Retry Quiz
          </Button>
          <Link href="/">
            <Button className="h-14 px-8 rounded-3xl gap-3 text-lg font-bold shadow-xl w-full sm:w-auto">
              <Home className="w-5 h-5" />
              New Quiz
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Quiz question screen
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col gap-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-6">
        <div className="flex-1 max-w-xl">
          <Progress value={progressValue} className="h-4 rounded-full border-2" />
          <div className="flex justify-between mt-3 px-1">
            <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Progress</span>
            <span className="text-sm font-bold">{currentIndex + 1} / {total}</span>
          </div>
        </div>
        <Link href={`/flashcard${rawData ? `?data=${rawData}` : ""}`}>
          <Button variant="outline" className="rounded-2xl gap-2 font-bold border-2">
            <BookOpen className="w-4 h-4 text-blue-500" />
            Switch Flash
          </Button>
        </Link>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center py-8">
        <QuizQuestion
          question={currentQ.question}
          options={currentQ.options}
          selectedOption={answers[currentIndex]}
          onSelect={handleSelect}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="h-16 px-8 rounded-3xl gap-3 text-lg font-bold hover:bg-accent transition-all disabled:opacity-40"
        >
          <ChevronLeft className="w-6 h-6" />
          Previous
        </Button>
        <Button
          onClick={handleNext}
          className="h-16 px-10 rounded-3xl gap-3 text-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
        >
          {currentIndex === total - 1 ? "Finish" : "Next"}
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
