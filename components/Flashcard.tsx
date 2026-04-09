"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FlashcardProps {
  question: string
  answer: string
}

export function Flashcard({ question, answer }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div 
      className="group perspective-1000 w-full max-w-md aspect-[3/4] cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className={cn(
        "relative w-full h-full transition-all duration-500 preserve-3d",
        isFlipped ? "rotate-y-180" : ""
      )}>
        {/* Front */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden flex flex-col items-center justify-center p-8 text-center",
          "bg-card/90 border-2 rounded-[2.5rem] shadow-xl"
        )}>
          <div className="flex-1 flex items-center justify-center">
            <h3 className="text-3xl font-bold leading-tight">{question}</h3>
          </div>
          <p className="mt-auto text-sm text-muted-foreground font-medium uppercase tracking-widest">
            Tap to flip
          </p>
        </Card>

        {/* Back */}
        <Card className={cn(
          "absolute inset-0 w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 text-center",
          "bg-primary text-primary-foreground border-2 border-primary rounded-[2.5rem] shadow-xl"
        )}>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-2xl font-medium leading-relaxed">{answer}</p>
          </div>
          <p className="mt-auto text-sm opacity-70 font-medium uppercase tracking-widest">
            Tap to see question
          </p>
        </Card>
      </div>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
    </div>
  )
}
