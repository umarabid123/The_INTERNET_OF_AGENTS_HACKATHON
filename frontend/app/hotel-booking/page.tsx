"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "../../components/shared/layout/Header"
import Footer from "../../components/shared/layout/Footer"
import { hotels } from "../../data/hotels"
import HotelCard from "../../components/shared/common/HotelCard";

function HotelBookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [availableHotels, setAvailableHotels] = useState(hotels)

  useEffect(() => {
    const hotelId = searchParams.get("hotelId")
    if (hotelId) {
      const hotel = hotels.find((h) => h.id === Number.parseInt(hotelId))
      if (hotel) {
        setSelectedHotel(hotel)
      }
    }
  }, [searchParams])

  const handleHotelSelect = useCallback((hotel) => {
    setSelectedHotel(hotel)
  }, [])

  const handleProceedToPayment = useCallback(() => {
    if (selectedHotel) {
      router.push(`/payment?hotelId=${selectedHotel.id}`)
    }
  }, [selectedHotel, router])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Book Your Hotel</h1>
            <p className="text-muted-foreground">Choose from available hotels and complete your booking</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Hotel Selection */}
            <div className="lg:col-span-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Available Hotels</h2>
              <div className="space-y-4">
                {availableHotels.map((hotel) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    onSelect={handleHotelSelect}
                    isSelected={selectedHotel?.id === hotel.id}
                  />
                ))}
              </div>
            </div>

            {/* Selection Summary */}
            <div className="lg:col-span-1">
              {selectedHotel ? (
                <div className="sticky top-8 bg-card rounded-lg border border-border p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Selected Hotel</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium text-card-foreground">{selectedHotel.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedHotel.location}</p>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">${selectedHotel.price}</span>
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
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Select a Hotel</h3>
                  <p className="text-muted-foreground">
                    Choose a hotel from the available options to proceed with payment.
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

export default function HotelBookingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <HotelBookingContent />
    </Suspense>
  )
}
