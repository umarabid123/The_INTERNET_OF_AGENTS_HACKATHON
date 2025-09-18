export const saveBooking = (booking) => {
  if (typeof window !== "undefined") {
    const existingBookings = getBookings()
    const updatedBookings = [...existingBookings, booking]
    localStorage.setItem("travelBookings", JSON.stringify(updatedBookings))
  }
}

export const getBookings = () => {
  if (typeof window !== "undefined") {
    const bookings = localStorage.getItem("travelBookings")
    return bookings ? JSON.parse(bookings) : []
  }
  return []
}

export const clearBookings = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("travelBookings")
  }
}
