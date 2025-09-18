"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Header from "../../components/shared/layout/Header"
import Footer from "../../components/shared/layout/Footer"
import ConfirmationCard from "../../components/shared/common/ConfirmationCard"
import { getBookings } from "../../utils/localStorage"

function ConfirmationContent() {
  const searchParams = useSearchParams()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const ticketId = searchParams.get("ticketId")
    if (ticketId) {
      const bookings = getBookings()
      const foundBooking = bookings.find((b) => b.ticketId === ticketId)
      setBooking(foundBooking)
    }
    setLoading(false)
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Booking Not Found</h1>
            <p className="text-muted-foreground mb-8">We couldn't find the booking you're looking for.</p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Back to Home
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">
              Your flight has been successfully booked. Check your email for details.
            </p>
          </div>

          <ConfirmationCard booking={booking} />

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/history"
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-center"
            >
              View All Bookings
            </Link>
            <Link
              href="/"
              className="px-6 py-3 bg-card text-card-foreground border border-border rounded-lg hover:bg-muted transition-colors text-center"
            >
              Book Another Flight
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  )
}
