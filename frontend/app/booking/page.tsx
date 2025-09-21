"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "../../components/shared/layout/Header"
import Footer from "../../components/shared/layout/Footer"
import FlightCard from "../../components/shared/common/FlightCard"
import { flights } from "../../data/flights"

function BookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [availableFlights, setAvailableFlights] = useState(flights)

  useEffect(() => {
    const flightId = searchParams.get("flightId")
    if (flightId) {
      const flight = flights.find((f) => f.id === Number(flightId))
      if (flight) {
        setSelectedFlight(flight)
      }
    }
  }, [searchParams])

  const handleFlightSelect = useCallback((flight) => {
    setSelectedFlight(flight)
  }, [])

  const handleProceedToPayment = useCallback(() => {
    if (selectedFlight) {
      router.push(`/payment?flightId=${selectedFlight.id}`)
    }
  }, [selectedFlight, router])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Book Your Flight</h1>
            <p className="text-muted-foreground">Choose from available flights and complete your booking</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Flight Selection */}
            <div className="lg:col-span-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Available Flights</h2>
              <div className="space-y-4">
                {availableFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onSelect={handleFlightSelect}
                    isSelected={selectedFlight?.id === flight.id}
                  />
                ))}
              </div>
            </div>

            {/* Selection Summary */}
            <div className="lg:col-span-1">
              {selectedFlight ? (
                <div className="sticky top-8 bg-card rounded-lg border border-border p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Selected Flight</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-card-foreground">{selectedFlight.airline}</h4>
                        <p className="text-sm text-muted-foreground">{selectedFlight.route}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Date</p>
                        <p className="font-medium text-card-foreground">{selectedFlight.date}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Time</p>
                        <p className="font-medium text-card-foreground">{selectedFlight.time}</p>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">${selectedFlight.price}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleProceedToPayment}
                    className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Proceed to Payment
                  </button>
                </div>
              ) : (
                <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Select a Flight</h3>
                  <p className="text-muted-foreground">
                    Choose a flight from the available options to proceed with payment.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <BookingContent />
    </Suspense>
  )
}
