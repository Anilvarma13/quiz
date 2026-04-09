"use client"

import { Button } from "@/components/ui/button"
import { ScoreCircle } from "@/components/ScoreCircle"
import { CheckCircle2, XCircle, Home, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import type { QuizQuestion as QuizQuestionType } from "@/lib/ai"

interface QuizResultsProps {
  questions: QuizQuestionType[]
  answers: Record<number, string>
  score: number
  total: number
  onRetry: () => void
}

export function QuizResults({ questions, answers, score, total, onRetry }: QuizResultsProps) {
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
          onClick={onRetry}
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
