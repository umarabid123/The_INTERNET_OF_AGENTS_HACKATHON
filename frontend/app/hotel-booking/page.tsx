"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, Filter, MapPin, Star, Calendar, Users, Wifi, Car, Utensils, Dumbbell } from "lucide-react"
import Header from "../../components/shared/layout/Header"
import Footer from "../../components/shared/layout/Footer"
import { hotels } from "../../data/hotels"
import HotelCard from "../../components/shared/common/HotelCard"
import ActiveNow from "../../components/shared/common/ActiveNow"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SimpleHotel } from "@/types/data"

function HotelBookingContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedHotel, setSelectedHotel] = useState<SimpleHotel | null>(null)
  const [availableHotels, setAvailableHotels] = useState<SimpleHotel[]>(hotels)
  const [filteredHotels, setFilteredHotels] = useState<SimpleHotel[]>(hotels)
  const [loading, setLoading] = useState(true)
  
  // Search and filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("price-low")
  const [priceRange, setPriceRange] = useState([0, 1000])
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [checkInDate, setCheckInDate] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  })
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const dayAfterTomorrow = new Date()
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2)
    return dayAfterTomorrow.toISOString().split('T')[0]
  })
  const [guests, setGuests] = useState(1)

  // Enhanced hotel data with more details
  const enhancedHotels = hotels

  useEffect(() => {
    console.log("Hotels loaded:", enhancedHotels)
    setAvailableHotels(enhancedHotels)
    setFilteredHotels(enhancedHotels)
    setLoading(false)
    
    const hotelId = searchParams.get("hotelId")
    if (hotelId) {
      const hotel = enhancedHotels.find((h) => h.id === Number(hotelId))
      if (hotel) {
        setSelectedHotel(hotel)
      }
    }
  }, [searchParams])

  // Filter and search functionality
  useEffect(() => {
    let filtered = [...enhancedHotels]

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(hotel => 
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Location filter
    if (selectedLocation !== "all") {
      filtered = filtered.filter(hotel => 
        hotel.location.toLowerCase().includes(selectedLocation.toLowerCase())
      )
    }

    // Price range filter
    filtered = filtered.filter(hotel => 
      hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
    )

    // Sorting
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => (b as any).rating - (a as any).rating)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    setFilteredHotels(filtered)
  }, [searchTerm, sortBy, priceRange, selectedLocation, enhancedHotels])

  // All useCallback hooks must be called before any conditional returns
  const handleHotelSelect = useCallback((hotel: SimpleHotel) => {
    console.log("Hotel selected:", hotel)
    setSelectedHotel(hotel)
  }, [])

  const handleProceedToPayment = useCallback(() => {
    if (selectedHotel) {
      router.push(`/payment?hotelId=${selectedHotel.id}&checkIn=${checkInDate}&checkOut=${checkOutDate}&guests=${guests}`)
    }
  }, [selectedHotel, router, checkInDate, checkOutDate, guests])

  const handleSearch = () => {
    // Trigger filter update (already handled by useEffect)
    console.log("Search triggered")
  }

  const locations = ["all", "New York", "Los Angeles", "Chicago", "Miami"]

  // NOW we can have conditional returns after all hooks are called
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Find Your Perfect Hotel</h1>
            <p className="text-lg text-muted-foreground mb-8">Discover amazing accommodations with AI-powered recommendations</p>
            
            {/* Search Bar */}
            <Card className="max-w-4xl mx-auto mb-8">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by city or hotel name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Check-in</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={checkInDate}
                        onChange={(e) => setCheckInDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Check-out</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="date"
                        value={checkOutDate}
                        onChange={(e) => setCheckOutDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Guests</label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="number"
                        min="1"
                        max="10"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSearch} className="w-full mt-6" size="lg">
                  <Search className="mr-2 h-4 w-4" />
                  Search Hotels
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Results */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1">
              <Card className="sticky top-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Rating: High to Low</option>
                      <option value="name">Name: A to Z</option>
                    </select>
                  </div>

                  <Separator />

                  {/* Location Filter */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Location</label>
                    <select
                      value={selectedLocation}
                      onChange={(e) => setSelectedLocation(e.target.value)}
                      className="w-full p-2 border border-border rounded-md bg-background"
                    >
                      {locations.map(location => (
                        <option key={location} value={location}>
                          {location === "all" ? "All Locations" : location}
                        </option>
                      ))}
                    </select>
                  </div>

                  <Separator />

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Price Range: ${priceRange[0]} - ${priceRange[1]}
                    </label>
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[0]}
                        onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                        className="w-full"
                      />
                      <input
                        type="range"
                        min="0"
                        max="1000"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hotel Results */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  {filteredHotels.length} hotels found
                </h2>
                <Badge variant="secondary" className="px-3 py-1">
                  {searchTerm ? `Searching: "${searchTerm}"` : "All Hotels"}
                </Badge>
              </div>
              
              {filteredHotels.length > 0 ? (
                <div className="space-y-6">
                  {filteredHotels.map((hotel: any) => (
                    <Card key={hotel.id} className={`transition-all duration-200 hover:shadow-lg ${selectedHotel?.id === hotel.id ? 'border-primary ring-2 ring-primary ring-offset-2' : ''}`}>
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Hotel Image */}
                          <div className="md:col-span-1">
                            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
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
                          
                          {/* Hotel Details */}
                          <div className="md:col-span-2">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <h3 className="text-xl font-semibold text-foreground mb-2">{hotel.name}</h3>
                                <div className="flex items-center space-x-4 mb-2">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{hotel.location}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    {Array.from({ length: Math.floor(hotel.rating || 4) }, (_, i) => (
                                      <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                                    ))}
                                    <span className="text-sm text-muted-foreground">({hotel.reviews || 0} reviews)</span>
                                  </div>
                                  {hotel.activeViewers && (
                                    <ActiveNow 
                                      hotelId={hotel.id} 
                                      initialViewers={hotel.activeViewers} 
                                    />
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">{hotel.description || `Experience luxury and comfort at ${hotel.name}.`}</p>
                                
                                {/* Amenities */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                  {(hotel.amenities || []).map((amenity: string, index: number) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {amenity === "Wifi" && <Wifi className="w-3 h-3 mr-1" />}
                                      {amenity === "Parking" && <Car className="w-3 h-3 mr-1" />}
                                      {amenity === "Restaurant" && <Utensils className="w-3 h-3 mr-1" />}
                                      {amenity === "Gym" && <Dumbbell className="w-3 h-3 mr-1" />}
                                      {amenity}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              
                              {/* Price and Booking */}
                              <div className="text-right">
                                <div className="mb-4">
                                  <div className="text-2xl font-bold text-primary">${hotel.price}</div>
                                  <div className="text-sm text-muted-foreground">per night</div>
                                </div>
                                <div className="mb-4">
                                  <Badge variant={(hotel.availability || 0) > 10 ? "default" : "destructive"} className="mb-2">
                                    {hotel.availability || 0} rooms left
                                  </Badge>
                                </div>
                                <div className="space-y-2">
                                  <Button
                                    onClick={() => handleHotelSelect(hotel)}
                                    variant={selectedHotel?.id === hotel.id ? "default" : "outline"}
                                    className="w-full"
                                  >
                                    {selectedHotel?.id === hotel.id ? "Selected" : "Select Hotel"}
                                  </Button>
                                  {selectedHotel?.id === hotel.id && (
                                    <Button
                                      onClick={handleProceedToPayment}
                                      className="w-full"
                                      size="sm"
                                    >
                                      Book Now
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="w-12 h-12 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">No Hotels Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or filters to find more options.
                  </p>
                  <Button 
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedLocation("all")
                      setPriceRange([0, 1000])
                    }}
                    variant="outline"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Booking Summary */}
          {selectedHotel && (
            <Card className="mt-8 max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hotel:</span>
                    <span className="font-medium">{selectedHotel.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium">{selectedHotel.location}</span>
                  </div>
                  {checkInDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-in:</span>
                      <span className="font-medium">{checkInDate}</span>
                    </div>
                  )}
                  {checkOutDate && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Check-out:</span>
                      <span className="font-medium">{checkOutDate}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Guests:</span>
                    <span className="font-medium">{guests}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-primary">${selectedHotel.price}</span>
                  </div>
                </div>
                <Button onClick={handleProceedToPayment} className="w-full mt-6" size="lg">
                  Proceed to Payment
                </Button>
              </CardContent>
            </Card>
          )}
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
