"use client"

import { Shield, Eye, Lock, Users, FileText, Clock } from "lucide-react"
import Header from "../../components/shared/layout/Header"
import Footer from "../../components/shared/layout/Footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function PrivacyPolicy() {
  const lastUpdated = "September 20, 2025"

  const sections = [
    {
      title: "Information We Collect",
      icon: FileText,
      content: [
        "Personal Information: Name, email address, phone number, and billing information when you create an account or make a booking.",
        "Travel Preferences: Destination preferences, travel dates, accommodation preferences, and other travel-related information.",
        "Usage Data: Information about how you use our website, including pages visited, time spent, and features used.",
        "Device Information: IP address, browser type, device type, and operating system.",
        "Location Data: General location information to provide relevant travel recommendations (with your consent)."
      ]
    },
    {
      title: "How We Use Your Information",
      icon: Users,
      content: [
        "Provide and improve our travel booking services",
        "Process your bookings and payments",
        "Send you booking confirmations and travel updates",
        "Provide personalized travel recommendations using AI",
        "Communicate with you about our services",
        "Comply with legal obligations and prevent fraud",
        "Analyze usage patterns to improve our platform"
      ]
    },
    {
      title: "Information Sharing",
      icon: Eye,
      content: [
        "Travel Partners: We share necessary booking information with airlines, hotels, and other travel service providers to complete your reservations.",
        "Payment Processors: Payment information is shared with secure payment processors to handle transactions.",
        "Service Providers: We may share data with trusted third-party service providers who help us operate our platform.",
        "Legal Requirements: We may disclose information when required by law or to protect our rights and users' safety.",
        "We do not sell your personal information to third parties for marketing purposes."
      ]
    },
    {
      title: "Data Security",
      icon: Lock,
      content: [
        "We use industry-standard encryption to protect your data in transit and at rest",
        "Our systems are regularly updated and monitored for security vulnerabilities",
        "Access to personal information is restricted to authorized personnel only",
        "We use secure payment processing systems that comply with PCI DSS standards",
        "Regular security audits are conducted by independent third parties",
        "We have incident response procedures in place for any potential data breaches"
      ]
    },
    {
      title: "Your Rights and Choices",
      icon: Shield,
      content: [
        "Access: You can request access to your personal information we hold",
        "Correction: You can update or correct your personal information in your account settings",
        "Deletion: You can request deletion of your account and associated data",
        "Portability: You can request a copy of your data in a machine-readable format",
        "Marketing: You can opt-out of marketing communications at any time",
        "Cookies: You can control cookie preferences through your browser settings"
      ]
    },
    {
      title: "Data Retention",
      icon: Clock,
      content: [
        "Account Information: Retained while your account is active and for a reasonable period after closure",
        "Booking Records: Retained for at least 7 years for legal and tax purposes",
        "Marketing Data: Retained until you opt-out or request deletion",
        "Usage Data: Anonymized usage data may be retained indefinitely for analytical purposes",
        "Payment Information: Not stored on our servers; handled by secure payment processors"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground mb-6">
              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
            </p>
            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Last updated: {lastUpdated}</span>
            </div>
          </div>

          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <p className="text-muted-foreground leading-relaxed">
                AI Travel Agent ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our travel booking 
                platform and AI-powered recommendation services. By using our services, you agree to the collection 
                and use of information in accordance with this policy.
              </p>
            </CardContent>
          </Card>

          {/* Main Sections */}
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <section.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span>{section.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* AI-Specific Privacy Notice */}
          <Card className="mt-8 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:border-blue-900">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700 dark:text-blue-300">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-sm">AI</span>
                </div>
                <span>AI and Machine Learning</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-700 dark:text-blue-300 mb-4">
                Our AI-powered recommendation system processes your travel preferences and booking history to provide 
                personalized suggestions. Here's how we handle AI-related data:
              </p>
              <ul className="space-y-2 text-blue-700 dark:text-blue-300">
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>Travel preferences are used to train our recommendation algorithms</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>Personal data is anonymized before being used for AI model improvements</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>You can opt-out of AI-powered recommendations while still using our basic services</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>•</span>
                  <span>AI processing is done securely and in compliance with data protection regulations</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Contact Us About Privacy</CardTitle>
              <CardDescription>
                If you have questions about this Privacy Policy or our privacy practices
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Email</h4>
                  <p className="text-muted-foreground">privacy@aitravel.com</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Mail</h4>
                  <p className="text-muted-foreground">
                    AI Travel Agent<br />
                    Privacy Officer<br />
                    123 Innovation Drive<br />
                    Tech City, TC 12345
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Notice */}
          <Card className="mt-8 bg-muted/50">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground text-center">
                This Privacy Policy may be updated from time to time. We will notify you of any significant changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date. Your continued 
                use of our services after any modifications indicates your acceptance of the updated Privacy Policy.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}