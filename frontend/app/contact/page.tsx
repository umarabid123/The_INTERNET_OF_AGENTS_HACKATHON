"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react"
import Header from "../../components/shared/layout/Header"
import Footer from "../../components/shared/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: ""
      })
    }, 3000)
  }

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone Support",
      description: "Available 24/7 for urgent matters",
      details: "1-800-AI-TRAVEL (1-800-248-7283)",
      subtext: "International: +1-555-123-4567"
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Response within 24 hours",
      details: "support@aitravel.com",
      subtext: "For general inquiries and support"
    },
    {
      icon: MapPin,
      title: "Office Location",
      description: "Visit our headquarters",
      details: "123 Innovation Drive, Tech City, TC 12345",
      subtext: "Monday - Friday, 9 AM - 6 PM"
    },
    {
      icon: Clock,
      title: "Business Hours",
      description: "Support availability",
      details: "24/7 Online Support",
      subtext: "Phone support: 6 AM - 12 AM EST"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8 sm:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help! Reach out to us through any of the channels below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Send className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-green-600 mb-2">Message Sent!</h3>
                      <p className="text-muted-foreground">
                        Thank you for contacting us. We'll respond within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Full Name *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            placeholder="Your full name"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            placeholder="your.email@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="booking">Booking Support</SelectItem>
                            <SelectItem value="technical">Technical Issue</SelectItem>
                            <SelectItem value="billing">Billing Question</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          placeholder="Brief description of your inquiry"
                          required
                        />
                      </div>

                      <div>
                        <Label htmlFor="message">Message *</Label>
                        <Textarea
                          id="message"
                          value={formData.message}
                          onChange={(e) => handleInputChange("message", e.target.value)}
                          placeholder="Please provide details about your inquiry..."
                          rows={6}
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Get in Touch</h2>
              
              {contactInfo.map((item, index) => (
                <Card key={index}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        <p className="font-medium text-foreground">{item.details}</p>
                        <p className="text-sm text-muted-foreground">{item.subtext}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* FAQ Link */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-foreground mb-2">Looking for Quick Answers?</h3>
                  <p className="text-muted-foreground mb-4">
                    Check out our Help Center for instant answers to common questions.
                  </p>
                  <Button variant="outline" asChild>
                    <a href="/help-center">Visit Help Center</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Emergency Contact */}
          <Card className="mt-12 bg-destructive/5 border-destructive/20">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold text-foreground mb-2">Emergency Travel Assistance</h3>
              <p className="text-muted-foreground mb-4">
                For urgent travel emergencies when you're already traveling, call our 24/7 emergency line.
              </p>
              <Button variant="destructive">
                <Phone className="w-4 h-4 mr-2" />
                Emergency Line: 1-800-EMERGENCY
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}