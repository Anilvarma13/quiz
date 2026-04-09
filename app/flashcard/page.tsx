"use client"

import { useState, useEffect } from "react"
import { Flashcard } from "@/components/Flashcard"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Zap, Home } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { FlashcardItem } from "@/lib/ai"

const FALLBACK_CARDS: FlashcardItem[] = [
  { front: "What is the capital of France?", back: "Paris — the capital and largest city of France." },
  { front: "What is photosynthesis?", back: "The process by which plants convert sunlight into glucose using CO₂ and water." },
]

export default function FlashcardPage() {
  const [cards, setCards] = useState<FlashcardItem[]>(FALLBACK_CARDS)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("quizzy_session")
      if (raw) {
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setCards(parsed)
        }
      }
    } catch {
      // fall back to FALLBACK_CARDS
    }
  }, [])

  const total = cards.length
  const [currentIndex, setCurrentIndex] = useState(0)

  function handleNext() {
    setCurrentIndex((i) => Math.min(i + 1, total - 1))
  }

  function handlePrev() {
    setCurrentIndex((i) => Math.max(i - 1, 0))
  }

  return (
    <div className="min-h-screen bg-background p-6 md:p-12 flex flex-col gap-10 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Numbered Tabs */}
        <div className="flex gap-2 p-2 bg-card/50 backdrop-blur-sm rounded-[2rem] border-2 overflow-x-auto max-w-full">
          {cards.map((_, num) => (
            <button
              key={num}
              onClick={() => setCurrentIndex(num)}
              className={cn(
                "w-11 h-11 rounded-2xl text-sm font-bold transition-all shrink-0",
                currentIndex === num
                  ? "bg-primary text-primary-foreground shadow-lg scale-110"
                  : "hover:bg-accent text-muted-foreground"
              )}
            >
              {num + 1}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link href="/">
            <Button variant="ghost" className="rounded-2xl gap-2 font-bold border-2 border-transparent hover:border-border">
              <Home className="w-4 h-4" />
              Home
            </Button>
          </Link>
          <Link href="/quiz">
            <Button variant="outline" className="rounded-2xl gap-2 font-bold border-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              Switch Quiz
            </Button>
          </Link>
        </div>
      </div>

      {/* Progress indicator */}
      <div className="text-center">
        <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
          Card {currentIndex + 1} of {total}
        </span>
      </div>

      {/* Flashcard carousel — show prev, current, next */}
      <div className="flex-1 flex items-center justify-center gap-6">
        {/* Prev card preview */}
        {currentIndex > 0 && (
          <div
            className="hidden md:flex w-32 h-48 rounded-[2rem] border-2 bg-card/30 items-center justify-center opacity-40 cursor-pointer hover:opacity-60 transition-opacity shrink-0"
            onClick={handlePrev}
          >
            <span className="text-xs text-muted-foreground font-medium text-center px-2 line-clamp-3">
              {cards[currentIndex - 1].front}
            </span>
          </div>
        )}
        {currentIndex === 0 && <div className="hidden md:block w-32 shrink-0" />}

        {/* Main card */}
        <Flashcard
          key={currentIndex}
          question={cards[currentIndex].front}
          answer={cards[currentIndex].back}
        />

        {/* Next card preview */}
        {currentIndex < total - 1 && (
          <div
            className="hidden md:flex w-32 h-48 rounded-[2rem] border-2 bg-card/30 items-center justify-center opacity-40 cursor-pointer hover:opacity-60 transition-opacity shrink-0"
            onClick={handleNext}
          >
            <span className="text-xs text-muted-foreground font-medium text-center px-2 line-clamp-3">
              {cards[currentIndex + 1].front}
            </span>
          </div>
        )}
        {currentIndex === total - 1 && <div className="hidden md:block w-32 shrink-0" />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="h-16 px-8 rounded-3xl gap-3 text-lg font-bold hover:bg-accent transition-all disabled:opacity-40"
        >
          <ChevronLeft className="w-6 h-6" />
          Prev
        </Button>

        {currentIndex < total - 1 ? (
          <Button
            onClick={handleNext}
            className="h-16 px-10 rounded-3xl gap-3 text-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
          >
            Next
            <ChevronRight className="w-6 h-6" />
          </Button>
        ) : (
          <Link href="/">
            <Button className="h-16 px-10 rounded-3xl gap-3 text-lg font-bold shadow-xl hover:scale-105 active:scale-95 transition-all">
              <Home className="w-5 h-5" />
              Done
            </Button>
          </Link>
        )}
      </div>
    </div>
  )
}
