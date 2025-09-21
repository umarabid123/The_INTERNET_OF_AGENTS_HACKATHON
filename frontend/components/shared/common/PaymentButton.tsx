"use client"

import { useState } from "react"

export default function PaymentButton({ flight, onPaymentSuccess }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)

    // Mock payment processing
    setTimeout(() => {
      setIsProcessing(false)
      onPaymentSuccess(flight)
    }, 2000)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Details</h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Flight ({flight.airline})</span>
          <span className="font-medium">${flight.price}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Taxes & Fees</span>
          <span className="font-medium">$25</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>${flight.price + 25}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
          isProcessing ? "bg-gray-400 text-white cursor-not-allowed" : "bg-green-600 text-white hover:bg-green-700"
        }`}
      >
        {isProcessing ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Processing Payment...</span>
          </div>
        ) : (
          "Pay with Crypto"
        )}
      </button>

      <p className="text-xs text-gray-500 text-center mt-2">Secure payment powered by Crossmint (Demo Mode)</p>
    </div>
  )
}
