"use client"

import { useState, useEffect, Suspense, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Header from "../../components/shared/layout/Header"
import Footer from "../../components/shared/layout/Footer"
import { insurances } from "../../data/insurances"
import InsuranceCard from "../../components/shared/common/InsuranceCard";

function TravelInsuranceContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [selectedInsurance, setSelectedInsurance] = useState(null)
  const [availableInsurances, setAvailableInsurances] = useState(insurances)

  useEffect(() => {
    const insuranceId = searchParams.get("insuranceId")
    if (insuranceId) {
      const insurance = insurances.find((i) => i.id === Number(insuranceId))
      if (insurance) {
        setSelectedInsurance(insurance)
      }
    }
  }, [searchParams])

  const handleInsuranceSelect = useCallback((insurance) => {
    setSelectedInsurance(insurance)
  }, [])

  const handleProceedToPayment = useCallback(() => {
    if (selectedInsurance) {
      router.push(`/payment?insuranceId=${selectedInsurance.id}`)
    }
  }, [selectedInsurance, router])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="py-6 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Get Travel Insurance</h1>
            <p className="text-muted-foreground">Choose from available insurance plans and complete your purchase</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Insurance Selection */}
            <div className="lg:col-span-2">
              <h2 className="text-lg sm:text-xl font-semibold text-foreground mb-4 sm:mb-6">Available Insurance Plans</h2>
              <div className="space-y-4">
                {availableInsurances.map((insurance) => (
                  <InsuranceCard
                    key={insurance.id}
                    insurance={insurance}
                    onSelect={handleInsuranceSelect}
                    isSelected={selectedInsurance?.id === insurance.id}
                  />
                ))}
              </div>
            </div>

            {/* Selection Summary */}
            <div className="lg:col-span-1">
              {selectedInsurance ? (
                <div className="sticky top-8 bg-card rounded-lg border border-border p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Selected Insurance</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-3">
                      <div>
                        <h4 className="font-medium text-card-foreground">{selectedInsurance.name}</h4>
                        <p className="text-sm text-muted-foreground">{selectedInsurance.provider}</p>
                      </div>
                    </div>

                    <div className="border-t pt-3">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span className="text-primary">${selectedInsurance.price}</span>
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
                  <h3 className="text-lg font-semibold text-card-foreground mb-4">Select an Insurance Plan</h3>
                  <p className="text-muted-foreground">
                    Choose an insurance plan from the available options to proceed with payment.
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

export default function TravelInsurancePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <TravelInsuranceContent />
    </Suspense>
  )
}
