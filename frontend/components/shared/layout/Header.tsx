"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

export default function Header() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <header className="bg-card shadow-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-card-foreground">AI Travel</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/" ? "text-primary bg-primary/10" : "text-card-foreground hover:text-primary"
              }`}
            >
              Home
            </Link>
            <Link
              href="/booking"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/booking" ? "text-primary bg-primary/10" : "text-card-foreground hover:text-primary"
              }`}
            >
              Book Flight
            </Link>
            <Link
              href="/history"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === "/history" ? "text-primary bg-primary/10" : "text-card-foreground hover:text-primary"
              }`}
            >
              My Bookings
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-card-foreground hover:text-primary hover:bg-muted"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === "/"
                    ? "text-primary bg-primary/10"
                    : "text-card-foreground hover:text-primary hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/booking"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === "/booking"
                    ? "text-primary bg-primary/10"
                    : "text-card-foreground hover:text-primary hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Book Flight
              </Link>
              <Link
                href="/history"
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === "/history"
                    ? "text-primary bg-primary/10"
                    : "text-card-foreground hover:text-primary hover:bg-muted"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My Bookings
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
