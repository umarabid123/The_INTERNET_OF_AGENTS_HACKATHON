"use client"

import Link from "next/link"
import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "../../components/shared/layout/Header"
import Footer from "../../components/shared/layout/Footer"
import { flights } from "../../data/flights"
import { hotels } from "../../data/hotels"
import { insurances } from "../../data/insurances"
import { generateId } from "../../utils/generateId"
import { saveBooking } from "../../utils/localStorage"

function PaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedFlight, setSelectedFlight] = useState(null)
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [selectedInsurance, setSelectedInsurance] = useState(null)
  const [bookingType, setBookingType] = useState(null) // 'flight', 'hotel', or 'insurance'
  const [loading, setLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [bookingDetails, setBookingDetails] = useState<{
    checkIn?: string;
    checkOut?: string;
    guests?: string;
  }>({})

  useEffect(() => {
    const flightId = searchParams.get("flightId")
    const hotelId = searchParams.get("hotelId")
    const insuranceId = searchParams.get("insuranceId")
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")
    const guests = searchParams.get("guests")

    console.log("Payment page params:", { flightId, hotelId, insuranceId, checkIn, checkOut, guests })

    if (flightId) {
      const flight = flights.find((f) => f.id === Number(flightId))
      console.log("Found flight:", flight)
      setSelectedFlight(flight)
      setBookingType("flight")
    } else if (hotelId) {
      const hotel = hotels.find((h) => h.id === Number(hotelId))
      console.log("Found hotel:", hotel)
      setSelectedHotel(hotel)
      setBookingType("hotel")
      setBookingDetails({
        checkIn: checkIn || '',
        checkOut: checkOut || '',
        guests: guests || '1'
      })
    } else if (insuranceId) {
      const insurance = insurances.find((i) => i.id === Number(insuranceId))
      console.log("Found insurance:", insurance)
      setSelectedInsurance(insurance)
      setBookingType("insurance")
    }
    setLoading(false)
  }, [searchParams])

  const handlePayment = useCallback(async () => {
    const selectedItem = selectedFlight || selectedHotel || selectedInsurance
    if (!selectedItem) return

    setIsProcessing(true)

    // Mock payment processing
    setTimeout(() => {
      const booking = {
        ...selectedItem,
        bookingId: generateId(),
        totalPaid: selectedItem.price + 25,
        bookingDate: new Date().toISOString(),
        status: "confirmed",
        paymentMethod,
        type: bookingType,
        ...(bookingType === "hotel" && bookingDetails)
      }

      saveBooking(booking)
      setIsProcessing(false)
      
      if (bookingType === "flight") {
        router.push(`/confirmation?ticketId=${booking.bookingId}`)
      } else if (bookingType === "hotel") {
        router.push(`/confirmation?bookingId=${booking.bookingId}&type=hotel`)
      } else if (bookingType === "insurance") {
        router.push(`/confirmation?bookingId=${booking.bookingId}&type=insurance`)
      }
    }, 2000)
  }, [selectedFlight, selectedHotel, selectedInsurance, bookingType, paymentMethod, router, bookingDetails])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!selectedFlight && !selectedHotel && !selectedInsurance) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Booking Not Found - Debug Mode</h1>
            <p className="text-muted-foreground mb-4">Please select a flight, hotel, or insurance to proceed with payment.</p>
            <div className="mb-6 p-4 bg-muted rounded-lg text-left">
              <p className="text-sm text-muted-foreground">Debug info:</p>
              <div className="text-xs mt-2 space-y-2">
                <div>URL: {typeof window !== 'undefined' ? window.location.href : 'Loading...'}</div>
                <div>Flight ID: {searchParams.get("flightId") || 'Not found'}</div>
                <div>Hotel ID: {searchParams.get("hotelId") || 'Not found'}</div>
                <div>Insurance ID: {searchParams.get("insuranceId") || 'Not found'}</div>
                <div>Selected Flight: {selectedFlight ? 'Yes' : 'No'}</div>
                <div>Selected Hotel: {selectedHotel ? 'Yes' : 'No'}</div>
                <div>Selected Insurance: {selectedInsurance ? 'Yes' : 'No'}</div>
                <div>Booking Type: {bookingType || 'Not set'}</div>
                <div>Available flights: {flights.length}</div>
                <div>Available hotels: {hotels.length}</div>
                <div>Available insurances: {insurances.length}</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/booking"
                className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Select Flight
              </Link>
              <Link
                href="/hotel-booking"
                className="inline-block px-6 py-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors"
              >
                Select Hotel
              </Link>
              <Link
                href="/travel-insurance"
                className="inline-block px-6 py-3 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 transition-colors"
              >
                Select Insurance
              </Link>
            </div>
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
            <p className="text-muted-foreground">
              Review your {bookingType} details and complete the booking
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {/* Booking Summary */}
            <div className="bg-card rounded-lg border border-border p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-semibold text-card-foreground mb-4 sm:mb-6">
                {bookingType === "flight" ? "Flight Summary" : "Hotel Summary"}
              </h2>

              {bookingType === "flight" && selectedFlight && (
                <>
                  <div className="relative mb-4 h-32 sm:h-40 rounded-lg overflow-hidden">
                    <img
                      src={`/beautiful-scene.png?height=160&width=400&query=beautiful ${selectedFlight.route?.split(" to ")[1] || 'destination'} travel destination aerial view`}
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
                </>
              )}

              {bookingType === "hotel" && selectedHotel && (
                <>
                  <div className="relative mb-4 h-32 sm:h-40 rounded-lg overflow-hidden bg-muted">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className="text-sm text-muted-foreground">Hotel Image</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-medium text-card-foreground">{selectedHotel.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedHotel.location}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {bookingDetails.checkIn && (
                        <div>
                          <p className="text-sm text-muted-foreground">Check-in</p>
                          <p className="font-medium text-card-foreground">{bookingDetails.checkIn}</p>
                        </div>
                      )}
                      {bookingDetails.checkOut && (
                        <div>
                          <p className="text-sm text-muted-foreground">Check-out</p>
                          <p className="font-medium text-card-foreground">{bookingDetails.checkOut}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Guests</p>
                        <p className="font-medium text-card-foreground">{bookingDetails.guests || 1}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price per night</p>
                        <p className="font-medium text-card-foreground">${selectedHotel.price}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
                {bookingType === 'flight' ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Hotel ({selectedHotel.name})</span>
                      <span className="font-medium">${selectedHotel.price}/night</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service Fee</span>
                      <span className="font-medium">$15</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">${selectedHotel.price + 15}</span>
                      </div>
                    </div>
                  </>
                )}
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
                  bookingType === 'flight' 
                    ? `Pay $${selectedFlight.price + 25} with ${paymentMethod === "card" ? "Card" : "PayPal"}` 
                    : `Pay $${selectedHotel.price + 15} with ${paymentMethod === "card" ? "Card" : "PayPal"}`
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
