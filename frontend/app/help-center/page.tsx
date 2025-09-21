"use client"

import { useState } from "react"
import { Search, ChevronDown, ChevronRight, Mail, Phone, MessageCircle } from "lucide-react"
import Header from "../../components/shared/layout/Header"
import Footer from "../../components/shared/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

interface FAQ {
  id: number
  question: string
  answer: string
  category: string
}

const faqs: FAQ[] = [
  {
    id: 1,
    question: "How do I book a flight?",
    answer: "To book a flight, go to our Flight Booking page, enter your departure and destination cities, select your travel dates, and choose the number of passengers. Our AI will show you the best available options.",
    category: "Booking"
  },
  {
    id: 2,
    question: "Can I cancel or modify my booking?",
    answer: "Yes, you can cancel or modify your booking depending on the airline's policy. Go to 'My Bookings' section and select the booking you want to change. Cancellation fees may apply.",
    category: "Booking"
  },
  {
    id: 3,
    question: "How does the AI recommendation system work?",
    answer: "Our AI analyzes your preferences, travel history, budget, and real-time data to recommend the best flights and hotels. It considers factors like price, convenience, ratings, and availability.",
    category: "AI Features"
  },
  {
    id: 4,
    question: "Is my payment information secure?",
    answer: "Yes, we use industry-standard encryption and secure payment gateways. Your payment information is never stored on our servers and is processed through certified payment providers.",
    category: "Payment"
  },
  {
    id: 5,
    question: "What if my flight is delayed or cancelled?",
    answer: "If your flight is delayed or cancelled, we'll notify you immediately and help you find alternative flights. You may also be eligible for compensation depending on the airline's policy.",
    category: "Travel Issues"
  },
  {
    id: 6,
    question: "How do I add travel insurance?",
    answer: "You can add travel insurance during the booking process or afterwards in your booking management section. We offer comprehensive coverage options for different travel needs.",
    category: "Insurance"
  }
]

const categories = ["All", "Booking", "AI Features", "Payment", "Travel Issues", "Insurance"]

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [openItems, setOpenItems] = useState<number[]>([])

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="py-8 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to frequently asked questions and get help with your travel bookings
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for help..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-base"
                />
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                size="sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Quick Help Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Email Support</CardTitle>
                <CardDescription>Get help via email within 24 hours</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  support@aitravel.com
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Phone Support</CardTitle>
                <CardDescription>Talk to our agents 24/7</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  1-800-AI-TRAVEL
                </Button>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Live Chat</CardTitle>
                <CardDescription>Chat with us in real-time</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Start Chat
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Frequently Asked Questions
            </h2>
            
            {filteredFAQs.length > 0 ? (
              filteredFAQs.map((faq) => (
                <Card key={faq.id}>
                  <Collapsible>
                    <CollapsibleTrigger 
                      className="w-full"
                      onClick={() => toggleItem(faq.id)}
                    >
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-left text-base font-medium">
                            {faq.question}
                          </CardTitle>
                          {openItems.includes(faq.id) ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <CardContent className="pt-0">
                        <p className="text-muted-foreground">{faq.answer}</p>
                        <div className="mt-3">
                          <span className="inline-block bg-primary/10 text-primary text-xs px-2 py-1 rounded">
                            {faq.category}
                          </span>
                        </div>
                      </CardContent>
                    </CollapsibleContent>
                  </Collapsible>
                </Card>
              ))
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No results found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search terms or contact our support team.
                  </p>
                  <Button variant="outline">
                    Contact Support
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Still Need Help Section */}
          <Card className="mt-12 bg-primary/5 border-primary/20">
            <CardContent className="text-center py-8">
              <h3 className="text-xl font-semibold mb-4">Still need help?</h3>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button>
                  Contact Support
                </Button>
                <Button variant="outline">
                  Submit Feedback
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}