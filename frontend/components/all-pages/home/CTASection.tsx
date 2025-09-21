import Link from "next/link"

export default function CTASection() {
  return (
    <div className="bg-primary text-primary-foreground py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
        <p className="text-lg sm:text-xl text-primary-foreground/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
          Join thousands of travelers who trust AI Travel for their booking needs
        </p>
        <Link
          href="/booking"
          className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-primary-foreground text-primary rounded-lg font-semibold hover:bg-primary-foreground/90 transition-colors"
        >
          Book Your Flight Now
        </Link>
      </div>
    </div>
  )
}
