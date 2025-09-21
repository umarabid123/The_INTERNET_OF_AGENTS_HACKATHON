"use client"

import { formatDate } from "../../../utils/formatDate"

export default function FlightCard({ flight, onSelect, isSelected = false }) {
  return (
    <div
      className={`bg-card rounded-lg border-2 p-4 sm:p-6 transition-all duration-200 hover:shadow-lg cursor-pointer ${
        isSelected ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
      }`}
      onClick={() => onSelect(flight)}
    >
      <div className="relative mb-4 h-32 sm:h-40 rounded-lg overflow-hidden">
        <img
          src={`/beautiful-scene.png?height=160&width=400&query=beautiful ${flight.route.split(" to ")[1]} travel destination aerial view`}
          alt={`${flight.route} destination`}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-sm font-semibold text-primary">
          ${flight.price}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-card-foreground text-sm sm:text-base">{flight.airline}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">{flight.stops}</p>
          </div>
        </div>
        <div className="text-right sm:text-left">
          <p className="text-xl sm:text-2xl font-bold text-card-foreground">${flight.price}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">per person</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">Route</p>
          <p className="font-medium text-card-foreground text-sm sm:text-base">{flight.route}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">Date</p>
          <p className="font-medium text-card-foreground text-sm sm:text-base">{formatDate(flight.date)}</p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">Duration</p>
          <p className="font-medium text-card-foreground text-sm sm:text-base">{flight.duration}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm text-muted-foreground">Departure - Arrival</p>
          <p className="font-medium text-card-foreground text-sm sm:text-base">{flight.time}</p>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSelect(flight)
          }}
          className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base ${
            isSelected ? "bg-primary text-primary-foreground" : "bg-primary text-primary-foreground hover:bg-primary/90"
          }`}
        >
          {isSelected ? "Selected" : "Select Flight"}
        </button>
      </div>
    </div>
  )
}
