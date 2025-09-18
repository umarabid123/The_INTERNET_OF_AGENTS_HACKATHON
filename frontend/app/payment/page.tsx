"use client"

import Link from "next/link"
import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "../../components/shared/layout/Header"
import Footer from "../../components/shared/layout/Footer"
import { flights } from "../../data/flights"
import { generateId } from "../../utils/generateId"
import { saveBooking } from "../../utils/localStorage"

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("crypto")

  useEffect(() => {
    const flightId = searchParams.get("flightId")
    if (flightId) {
      const flight = flights.find((f) => f.id === Number.parseInt(flightId))
      setSelectedFlight(flight)
    }
    setLoading(false)
  }, [searchParams])

  const handlePayment = useCallback(async () => {
    if (!selectedFlight) return

    setIsProcessing(true)

    // Mock payment processing
    setTimeout(() => {
      const booking = {
        ...selectedFlight,
        ticketId: generateId(),
        totalPaid: selectedFlight.price + 25,
        bookingDate: new Date().toISOString(),
        status: "confirmed",
        paymentMethod,
      }

      saveBooking(booking)
      setIsProcessing(false)
      router.push(`/confirmation?ticketId=${booking.ticketId}`)
    }, 2000)
  }, [selectedFlight, paymentMethod, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!selectedFlight) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Flight Not Found</h1>
            <p className="text-muted-foreground mb-8">Please select a flight to proceed with payment.</p>
            <Link
              href="/booking"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Select Flight
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-6 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Complete Your Payment</h1>
            <p className="text-muted-foreground">Review your flight details and complete the booking</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Flight Summary */}
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6">Flight Summary</h2>

              <div className="relative mb-4 h-32 sm:h-40 rounded-lg overflow-hidden">
                <img
                  src={`/beautiful-scene.png?height=160&width=400&query=beautiful ${selectedFlight.route.split(" to ")[1]} travel destination aerial view`}
                  alt={`${selectedFlight.route} destination`}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">{selectedFlight.airline}</h3>
                    <p className="text-sm text-muted-foreground">{selectedFlight.stops}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Route</p>
                    <p className="font-medium text-card-foreground">{selectedFlight.route}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium text-card-foreground">{selectedFlight.date}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium text-card-foreground">{selectedFlight.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium text-card-foreground">{selectedFlight.duration}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6">Payment Details</h2>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-card-foreground mb-3">Payment Method</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="payment"
                      value="crypto"
                      checked={paymentMethod === "crypto"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">₿</span>
                      </div>
                      <span className="font-medium">Cryptocurrency</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === "card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          />
                        </svg>
                      </div>
                      <span className="font-medium">Credit/Debit Card</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/50">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === "paypal"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-primary"
                    />
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-primary/10 rounded flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">P</span>
                      </div>
                      <span className="font-medium">PayPal</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Flight ({selectedFlight.airline})</span>
                  <span className="font-medium">${selectedFlight.price}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxes & Fees</span>
                  <span className="font-medium">$25</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span className="text-primary">${selectedFlight.price + 25}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                  isProcessing
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Payment...</span>
                  </div>
                ) : (
                  `Pay $${selectedFlight.price + 25} with ${paymentMethod === "crypto" ? "Crypto" : paymentMethod === "card" ? "Card" : "PayPal"}`
                )}
              </button>

              <p className="text-xs text-muted-foreground text-center mt-3">
                Secure payment powered by Crossmint (Demo Mode)
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <PaymentContent />
    </Suspense>
  )
}
