"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Mic, MessageSquare, Plane, CreditCard } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Header from "../components/shared/layout/Header"
import Footer from "../components/shared/layout/Footer"
import HeroSection from "../components/all-pages/home/HeroSection"
import Features from "../components/all-pages/home/Features"
import CTASection from "../components/all-pages/home/CTASection"
import FlightCard from "../components/booking/FlightCard"
import { VoiceChat } from "../components/voice/VoiceChat"
import { flights } from "../data/flights"
import { services } from "@/services/api"

export default function HomePage() {
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [showVoiceChat, setShowVoiceChat] = useState(false)
  const [aiRecommendations, setAiRecommendations] = useState([])
  const [sessionId, setSessionId] = useState(`session_${Date.now()}`)
  const router = useRouter()

  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        // Initialize AI session
        const sessionData = await services.coral.getSession(sessionId)
        console.log('Session initialized:', sessionData)
      } catch (error) {
        console.log('New session started:', sessionId)
      }
    }

    initializeSession()
  }, [sessionId])

  const handleSearch = useCallback(async (query) => {
    setIsSearching(true)

    try {
      // Use AI recommendations service
      const recommendations = await services.recommendation.getRecommendations({
        query,
        preferences: {
          travelers: { adults: 1, children: 0, infants: 0 },
          interests: ["travel", "flights"],
          accommodation: "mid-range",
          activities: ["sightseeing", "relaxation"]
        },
        sessionId
      })

      // Search for flights based on AI recommendations
      const flightResults = await services.recommendation.searchFlights(query, {
        destinations: recommendations.recommendations
          .filter(r => r.type === "destination")
          .map(r => r.title)
      })

      setSearchResults(flightResults.length > 0 ? flightResults : flights.slice(0, 3))
      setAiRecommendations(recommendations.recommendations)
    } catch (error) {
      console.error('Search error:', error)
      // Fallback to mock search
      const results = flights.filter(
        (flight) =>
          (query.toLowerCase().includes("nyc") && query.toLowerCase().includes("la")) ||
          (query.toLowerCase().includes("new york") && query.toLowerCase().includes("los angeles")),
      )
      setSearchResults(results.length > 0 ? results : flights.slice(0, 3))
    } finally {
      setIsSearching(false)
    }
  }, [sessionId])

  const handleFlightSelect = useCallback((flight) => {
    setSelectedFlight(flight)
  }, [])

  const handleFlightBook = useCallback((flight) => {
    setSelectedFlight(flight)
    // Navigate to payment page instead of showing crypto payment modal
    router.push(`/payment?flightId=${flight.id}`)
  }, [])

  const handleVoiceMessage = useCallback(async (message) => {
    try {
      // Send message to AI orchestrator
      const response = await services.coral.orchestrateAgents({
        userQuery: { text: message },
        sessionId,
        context: {
          selectedFlight,
          searchResults,
          aiRecommendations
        }
      })

      // Handle AI response
      if (response.recommendations) {
        setAiRecommendations(response.recommendations)
      }

      if (response.bookingOptions) {
        setSearchResults(response.bookingOptions)
      }

    } catch (error) {
      console.error('Voice message error:', error)
    }
  }, [sessionId, selectedFlight, searchResults, aiRecommendations])

  const handleVoiceCommand = useCallback(async (command) => {
    const lowerCommand = command.toLowerCase()
    
    // Handle specific voice commands
    if (lowerCommand.includes("search") || lowerCommand.includes("find")) {
      await handleSearch(command)
    } else if (lowerCommand.includes("book") && selectedFlight) {
      router.push(`/payment?flightId=${selectedFlight.id}`)
    } else if (lowerCommand.includes("payment") || lowerCommand.includes("pay")) {
      router.push('/payment')
    } else {
      // Send to AI for general processing
      await handleVoiceMessage(command)
    }
  }, [handleSearch, selectedFlight, handleVoiceMessage, router])

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
                    <FlightCard 
                      key={flight.id} 
                      flight={flight} 
                      onSelect={handleFlightSelect} 
                      onBook={handleFlightBook}
                      isSelected={selectedFlight?.id === flight.id} 
                    />
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
            
            {/* Quick Access Services */}
            <div className="py-16 bg-muted/30">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">Quick Access Services</h2>
                  <p className="text-lg text-muted-foreground">Book your entire trip in one place</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="group bg-card rounded-lg p-6 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                        <Plane className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Flights</h3>
                        <p className="text-sm text-muted-foreground">Book domestic and international flights</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      onClick={() => router.push('/booking')}
                    >
                      Book Flights
                    </Button>
                  </div>
                  
                  <div className="group bg-card rounded-lg p-6 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Hotels</h3>
                        <p className="text-sm text-muted-foreground">Find and book accommodations</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => router.push('/hotel-booking')}
                    >
                      Book Hotels
                    </Button>
                  </div>
                  
                  <div className="group bg-card rounded-lg p-6 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Insurance</h3>
                        <p className="text-sm text-muted-foreground">Protect your travel investment</p>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant="secondary"
                      onClick={() => router.push('/travel-insurance')}
                    >
                      Get Insurance
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            <CTASection />
          </>
        )}
      </main>

      {/* Voice Chat Component - Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setShowVoiceChat(!showVoiceChat)}
          size="lg"
          className="rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-all duration-200 bg-primary hover:bg-primary/90"
          title="Voice Assistant"
        >
          <Mic className="w-6 h-6" />
        </Button>
      </div>

      {/* Voice Chat Dialog */}
      {showVoiceChat && (
        <div className="fixed inset-0 z-40 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg shadow-xl max-w-md w-full h-[600px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b flex-shrink-0">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                AI Voice Assistant
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVoiceChat(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ×
              </Button>
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <VoiceChat
                onMessageSent={handleVoiceMessage}
                onVoiceCommand={handleVoiceCommand}
                className="h-full"
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
