"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuizQuestionProps {
  question: string
  options: string[]
  selectedOption?: string
  onSelect: (option: string) => void
}

export function QuizQuestion({
  question,
  options,
  selectedOption,
  onSelect,
}: QuizQuestionProps) {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <Card className="p-10 bg-card/80 backdrop-blur-sm border-2 shadow-xl rounded-[2rem]">
        <h2 className="text-2xl md:text-3xl font-bold leading-tight text-center">
          {question}
        </h2>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, index) => {
          const letter = String.fromCharCode(65 + index)
          const isSelected = selectedOption === option
          
          return (
            <Button
              key={option}
              variant="outline"
              onClick={() => onSelect(option)}
              className={cn(
                "h-auto p-6 text-lg justify-start gap-4 rounded-3xl border-2 transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
                isSelected 
                  ? "bg-primary text-primary-foreground border-primary shadow-lg" 
                  : "bg-background hover:bg-accent/50 hover:border-primary/50"
              )}
            >
              <span className={cn(
                "flex-none w-10 h-10 rounded-xl flex items-center justify-center font-bold",
                isSelected ? "bg-primary-foreground/20" : "bg-accent"
              )}>
                {letter}
              </span>
              <span className="flex-1 text-left">{option}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}
