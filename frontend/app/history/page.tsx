"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "../../components/shared/layout/Header"
import Footer from "../../components/shared/layout/Footer"
import { getBookings, clearBookings } from "../../utils/localStorage"
import { formatDate } from "../../utils/formatDate"

export default function HistoryPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedBookings = getBookings()
    setBookings(savedBookings)
    setLoading(false)
  }, [])

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all booking history?")) {
      clearBookings()
      setBookings([])
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
              <p className="text-gray-600">View and manage your travel bookings</p>
            </div>

            {bookings.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear History
              </button>
            )}
          </div>

          {bookings.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">No Bookings Yet</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                You haven't made any bookings yet. Start planning your next trip!
              </p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Book Your First Flight
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookings.map((booking) => (
                <div
                  key={booking.ticketId}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-medium text-green-600">Confirmed</span>
                    </div>
                    <span className="text-sm text-gray-500">{booking.ticketId}</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{booking.airline}</h3>
                      <p className="text-gray-600">{booking.route}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-500">Date</p>
                        <p className="font-medium">{formatDate(booking.date)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Time</p>
                        <p className="font-medium">{booking.time}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">Total Paid</span>
                        <span className="font-semibold text-gray-900">${booking.totalPaid}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Link
                      href={`/confirmation?ticketId=${booking.ticketId}`}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
