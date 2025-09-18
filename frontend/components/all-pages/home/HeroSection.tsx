"use client"

import { useState } from "react"

export default function HeroSection({ onSearch }) {
  const [query, setQuery] = useState("")
  const [isListening, setIsListening] = useState(false)

  const handleMicClick = () => {
    setIsListening(true)
    // Mock voice input - auto-fill with predefined text
    setTimeout(() => {
      setQuery("Book me a flight from NYC to LA")
      setIsListening(false)
    }, 1500)
  }

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="relative min-h-[70vh] sm:min-h-[80vh] flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src="/stunning-travel-destination-mountains-ocean-sunset.jpg" alt="Travel destination" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/60"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 w-full">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6 text-primary-foreground">
            Your AI Travel Agent
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 sm:mb-12 text-primary-foreground/90 max-w-3xl mx-auto">
            Book flights and hotels with intelligent recommendations. Just tell us where you want to go.
          </p>

          <div className="max-w-2xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4 bg-card rounded-lg p-2 shadow-lg">
              <button
                onClick={handleMicClick}
                disabled={isListening}
                className={`p-3 rounded-lg transition-colors w-full sm:w-auto ${
                  isListening
                    ? "bg-destructive text-destructive-foreground animate-pulse"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </button>

              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tell me where you want to go..."
                className="flex-1 px-4 py-3 text-card-foreground placeholder-muted-foreground border-none outline-none rounded-lg bg-input"
              />

              <button
                onClick={handleSearch}
                className="px-4 sm:px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium w-full sm:w-auto"
              >
                Search
              </button>
            </div>

            {isListening && (
              <p className="mt-4 text-primary-foreground/80 animate-pulse">
                Listening... (Demo: Auto-filling sample query)
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
