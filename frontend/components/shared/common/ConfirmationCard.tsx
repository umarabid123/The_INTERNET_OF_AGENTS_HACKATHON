import { formatDate } from "../../../utils/formatDate"

export default function ConfirmationCard({ booking }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600">Your flight has been successfully booked</p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Airline</p>
            <p className="font-medium text-gray-900">{booking.airline}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ticket ID</p>
            <p className="font-medium text-gray-900">{booking.ticketId}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Route</p>
            <p className="font-medium text-gray-900">{booking.route}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium text-gray-900">{formatDate(booking.date)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Time</p>
            <p className="font-medium text-gray-900">{booking.time}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="font-medium text-gray-900">${booking.totalPaid}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Important:</strong> Please arrive at the airport at least 2 hours before departure. Your e-ticket has
          been saved to your booking history.
        </p>
      </div>
    </div>
  )
}
