"use client"

import { useState, useEffect } from "react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { QuizQuestion } from "@/components/QuizQuestion"
import { QuizResults } from "@/components/QuizResults"
import { ChevronLeft, ChevronRight, BookOpen, Home } from "lucide-react"
import Link from "next/link"
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
  const [questions, setQuestions] = useState<QuizQuestionType[]>(FALLBACK_QUESTIONS)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("quizzy_session")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setQuestions(parsed)
        }
      }
    } catch {
      // fall back to FALLBACK_QUESTIONS
    }
  }, [])

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

  function handleRetry() {
    setShowResults(false)
    setCurrentIndex(0)
    setAnswers({})
  }

  // Results screen
  if (showResults) {
    return (
      <QuizResults
        questions={questions}
        answers={answers}
        score={score}
        total={total}
        onRetry={handleRetry}
      />
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
        <Link href="/flashcard">
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
