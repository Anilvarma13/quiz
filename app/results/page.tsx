import { ScoreCircle } from "@/components/ScoreCircle"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Home, RefreshCcw } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"

const reviewItems = [
  { id: 1, question: "What is the capital of France?", answer: "Paris", correct: true },
  { id: 2, question: "What is 2 + 2?", answer: "4", correct: true },
  { id: 3, question: "Who wrote 'Hamlet'?", answer: "William Shakespeare", correct: false, userHighlight: "Correct answer is William Shakespeare" },
]

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col items-center gap-12 max-w-3xl mx-auto">
      {/* Top Header */}
      <div className="w-full flex justify-start">
        <Link href="/">
          <Button variant="outline" className="rounded-2xl gap-2 font-bold border-2">
            <Home className="w-4 h-4" />
            <span>Home</span>
          </Button>
        </Link>
      </div>

      {/* Score Section */}
      <div className="flex flex-col items-center gap-6 py-8">
        <ScoreCircle score={8} total={10} size={240} strokeWidth={16} />
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">Great job!</h2>
          <p className="text-muted-foreground font-medium">You've mastered most of the concepts.</p>
        </div>
      </div>

      {/* Review List */}
      <div className="w-full space-y-4">
        <h3 className="text-xl font-bold px-1">Review</h3>
        {reviewItems.map((item) => (
          <Card key={item.id} className="p-6 rounded-[2rem] border-2 bg-card/50 backdrop-blur-sm group hover:scale-[1.01] transition-all">
            <div className="flex gap-4 items-start">
              {item.correct ? (
                <CheckCircle2 className="w-7 h-7 text-green-500 shrink-0 mt-1" />
              ) : (
                <XCircle className="w-7 h-7 text-destructive shrink-0 mt-1" />
              )}
              <div className="space-y-2">
                <p className="text-lg font-bold leading-tight">{item.question}</p>
                {!item.correct && item.userHighlight && (
                  <div className="inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-xl text-sm font-semibold border border-destructive/20">
                    {item.userHighlight}
                  </div>
                )}
                {item.correct && (
                  <p className="text-sm text-muted-foreground font-medium">Correct answer: {item.answer}</p>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="w-full pt-8 flex justify-center">
        <Link href="/quiz" className="w-full max-w-xs">
          <Button className="w-full h-16 rounded-3xl gap-3 text-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
            <RefreshCcw className="w-6 h-6" />
            Retry Quiz
          </Button>
        </Link>
      </div>
    </div>
  )
}
