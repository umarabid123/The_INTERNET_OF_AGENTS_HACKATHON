export default function Features() {
  const features = [
    {
      icon: (
        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      ),
      title: "AI-Powered Search",
      description: "Our intelligent system understands natural language and finds the best travel options for you.",
      badge: "Smart AI",
      color: "green"
    },
    {
      icon: (
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
            />
          </svg>
        </div>
      ),
      title: "Secure Payments",
      description: "Pay securely with credit cards, debit cards, and PayPal using our integrated payment system.",
      badge: "Secure",
      color: "blue"
    },
    {
      icon: (
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </div>
      ),
      title: "Instant Booking",
      description: "Book flights and hotels instantly with real-time availability and pricing.",
      badge: "Fast",
      color: "orange"
    },
  ]

  return (
    <div className="py-16 sm:py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
            Why Choose AI Travel?
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of travel booking with our intelligent platform powered by cutting-edge technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative text-center bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Background gradient effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Feature badge */}
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                  feature.color === 'green' 
                    ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' 
                    : feature.color === 'blue'
                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800'
                    : 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800'
                }`}>
                  {feature.badge}
                </span>
              </div>

              {/* Icon */}
              <div className="flex justify-center mb-6 mt-4">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
