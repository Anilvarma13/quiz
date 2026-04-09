"use client"

import { cn } from "@/lib/utils"

interface ScoreCircleProps {
  score: number
  total: number
  size?: number
  strokeWidth?: number
}

export function ScoreCircle({
  score,
  total,
  size = 200,
  strokeWidth = 12,
}: ScoreCircleProps) {
  const percentage = (score / total) * 100
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="text-primary transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Score</p>
        <p className="text-5xl font-bold tracking-tighter">
          {score}<span className="text-2xl text-muted-foreground font-normal">/{total}</span>
        </p>
      </div>
    </div>
  )
}
