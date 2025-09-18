"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Header from "../components/shared/layout/Header"
import Footer from "../components/shared/layout/Footer"
import HeroSection from "../components/all-pages/home/HeroSection"
import Features from "../components/all-pages/home/Features"
import CTASection from "../components/all-pages/home/CTASection"
import FlightCard from "../components/shared/common/FlightCard"
import { flights } from "../data/flights"

export default function HomePage() {
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  const handleSearch = useCallback(async (query) => {
    setIsSearching(true)

    // Mock search processing
    setTimeout(() => {
      // Filter flights based on query (simple mock logic)
      const results = flights.filter(
        (flight) =>
          (query.toLowerCase().includes("nyc") && query.toLowerCase().includes("la")) ||
          (query.toLowerCase().includes("new york") && query.toLowerCase().includes("los angeles")),
      )

      setSearchResults(results.length > 0 ? results : flights.slice(0, 3))
      setIsSearching(false)
    }, 1500)
  }, [])

  const handleFlightSelect = useCallback(
    (flight) => {
      // Navigate to booking page with selected flight
      router.push(`/booking?flightId=${flight.id}`)
    },
    [router],
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main>
        <HeroSection onSearch={handleSearch} />

        {/* Search Results Section */}
        {(isSearching || searchResults.length > 0) && (
          <div className="py-8 sm:py-16 bg-card/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {isSearching ? "Searching for flights..." : "Available Flights"}
                </h2>
                {!isSearching && (
                  <p className="text-muted-foreground">Found {searchResults.length} flights matching your search</p>
                )}
              </div>

              {isSearching ? (
                <div className="flex justify-center">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {searchResults.map((flight) => (
                    <FlightCard key={flight.id} flight={flight} onSelect={handleFlightSelect} isSelected={false} />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Show features only if no search results */}
        {searchResults.length === 0 && !isSearching && (
          <>
            <Features />
            <CTASection />
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}
