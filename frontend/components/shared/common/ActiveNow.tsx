"use client"

import { useState, useEffect } from "react"
import { Eye, Users } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ActiveNowProps {
  hotelId: number
  initialViewers: number
  className?: string
}

export default function ActiveNow({ hotelId, initialViewers, className = "" }: ActiveNowProps) {
  const [currentViewers, setCurrentViewers] = useState(initialViewers)
  
  useEffect(() => {
    // Simulate realistic fluctuations in viewer count
    const interval = setInterval(() => {
      const fluctuation = Math.floor(Math.random() * 5) - 2 // -2 to +2 change
      const newCount = Math.max(1, Math.min(50, currentViewers + fluctuation))
      setCurrentViewers(newCount)
    }, 3000 + Math.random() * 4000) // Random interval between 3-7 seconds

    return () => clearInterval(interval)
  }, [currentViewers])

  // Different styling based on viewer count
  const getVariant = () => {
    if (currentViewers >= 30) return "destructive" // High activity - red
    if (currentViewers >= 15) return "default" // Medium activity - orange
    return "secondary" // Low activity - gray
  }

  const getIcon = () => {
    if (currentViewers >= 20) return <Users className="h-3 w-3" />
    return <Eye className="h-3 w-3" />
  }

  return (
    <Badge 
      variant={getVariant()} 
      className={`animate-pulse ${className}`}
    >
      {getIcon()}
      <span className="ml-1 text-xs font-medium">
        {currentViewers} viewing now
      </span>
    </Badge>
  )
}