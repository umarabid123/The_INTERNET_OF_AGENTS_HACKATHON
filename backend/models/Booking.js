const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    required: true,
    unique: true
  },
  confirmationNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['flight', 'hotel', 'package', 'insurance'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'failed'],
    default: 'pending'
  },
  
  // Contact Information
  contactInfo: {
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    emergencyContact: {
      name: String,
      phone: String,
      relationship: String
    }
  },

  // Traveler Details
  travelers: [{
    type: {
      type: String,
      enum: ['adult', 'child', 'infant'],
      default: 'adult'
    },
    title: {
      type: String,
      enum: ['Mr', 'Mrs', 'Ms', 'Dr'],
      required: true
    },
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dateOfBirth: {
      type: Date,
      required: true
    },
    nationality: {
      type: String,
      required: true
    },
    passportNumber: String,
    passportExpiry: Date,
    passportIssueCountry: String,
    specialRequests: [String],
    frequentFlyerNumber: String
  }],

  // Flight-specific details
  flightDetails: {
    outbound: {
      flightNumber: String,
      airline: String,
      airlineCode: String,
      departure: {
        airport: String,
        airportCode: String,
        city: String,
        country: String,
        terminal: String,
        gate: String,
        dateTime: Date
      },
      arrival: {
        airport: String,
        airportCode: String,
        city: String,
        country: String,
        terminal: String,
        gate: String,
        dateTime: Date
      },
      duration: String,
      aircraft: String,
      seatNumber: String,
      baggage: {
        cabin: String,
        checked: String
      }
    },
    return: {
      flightNumber: String,
      airline: String,
      airlineCode: String,
      departure: {
        airport: String,
        airportCode: String,
        city: String,
        country: String,
        terminal: String,
        gate: String,
        dateTime: Date
      },
      arrival: {
        airport: String,
        airportCode: String,
        city: String,
        country: String,
        terminal: String,
        gate: String,
        dateTime: Date
      },
      duration: String,
      aircraft: String,
      seatNumber: String,
      baggage: {
        cabin: String,
        checked: String
      }
    },
    class: {
      type: String,
      enum: ['economy', 'premium-economy', 'business', 'first']
    },
    ticketNumbers: [String]
  },

  // Hotel-specific details
  hotelDetails: {
    hotelName: String,
    hotelId: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      postalCode: String
    },
    checkIn: Date,
    checkOut: Date,
    nights: Number,
    rooms: [{
      roomType: String,
      roomNumber: String,
      guests: Number,
      bedType: String,
      amenities: [String]
    }],
    specialRequests: [String],
    cancellationPolicy: String,
    hotelConfirmationNumber: String
  },

  // Insurance details
  insuranceDetails: {
    provider: String,
    policyNumber: String,
    coverage: {
      medical: {
        amount: Number,
        currency: String
      },
      trip: {
        amount: Number,
        currency: String
      },
      baggage: {
        amount: Number,
        currency: String
      }
    },
    beneficiaries: [{
      name: String,
      relationship: String,
      percentage: Number
    }]
  },

  // Pricing
  pricing: {
    basePrice: {
      type: Number,
      required: true
    },
    taxes: {
      type: Number,
      default: 0
    },
    fees: {
      type: Number,
      default: 0
    },
    discounts: {
      type: Number,
      default: 0
    },
    totalPrice: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      required: true,
      default: 'USD'
    },
    breakdown: [{
      item: String,
      amount: Number,
      currency: String
    }]
  },

  // Payment Information
  paymentInfo: {
    paymentId: String,
    method: {
      type: String,
      enum: ['card', 'bank', 'wallet'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'],
      default: 'pending'
    },
    paidAmount: Number,
    paidCurrency: String,
    transactionId: String,
    paymentDate: Date,
    refunds: [{
      amount: Number,
      currency: String,
      reason: String,
      processedDate: Date,
      refundId: String
    }]
  },

  // Provider Information
  provider: {
    name: String,
    reference: String,
    bookingReference: String,
    apiSource: String
  },

  // Booking Source
  source: {
    platform: {
      type: String,
      default: 'ai-travel-agent'
    },
    channel: {
      type: String,
      enum: ['web', 'mobile', 'api', 'voice'],
      default: 'web'
    },
    agent: String,
    sessionId: String
  },

  // AI Context
  aiContext: {
    searchQuery: String,
    recommendations: [mongoose.Schema.Types.Mixed],
    preferences: mongoose.Schema.Types.Mixed,
    conversationHistory: [mongoose.Schema.Types.Mixed]
  },

  // Notifications
  notifications: {
    confirmationSent: {
      type: Boolean,
      default: false
    },
    remindersSent: [{
      type: String,
      sentAt: Date
    }],
    updates: [{
      type: String,
      message: String,
      sentAt: Date,
      channel: String
    }]
  },

  // Important Dates
  importantDates: {
    bookingDate: {
      type: Date,
      default: Date.now
    },
    travelDate: Date,
    checkInDate: Date,
    cancellationDeadline: Date,
    lastModified: {
      type: Date,
      default: Date.now
    }
  },

  // Modifications
  modifications: [{
    type: String,
    oldValue: mongoose.Schema.Types.Mixed,
    newValue: mongoose.Schema.Types.Mixed,
    reason: String,
    cost: Number,
    modifiedBy: String,
    modifiedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Notes and Comments
  notes: [{
    type: String,
    author: String,
    isInternal: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceInfo: mongoose.Schema.Types.Mixed,
    geoLocation: {
      country: String,
      city: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
bookingSchema.index({ bookingId: 1 }, { unique: true });
bookingSchema.index({ confirmationNumber: 1 }, { unique: true });
bookingSchema.index({ userId: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ type: 1 });
bookingSchema.index({ 'importantDates.travelDate': 1 });
bookingSchema.index({ 'paymentInfo.status': 1 });
bookingSchema.index({ createdAt: -1 });

// Compound indexes
bookingSchema.index({ userId: 1, status: 1 });
bookingSchema.index({ userId: 1, type: 1 });
bookingSchema.index({ userId: 1, 'importantDates.travelDate': 1 });

// Virtual for days until travel
bookingSchema.virtual('daysUntilTravel').get(function() {
  if (!this.importantDates.travelDate) return null;
  const today = new Date();
  const travelDate = new Date(this.importantDates.travelDate);
  const diffTime = travelDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for booking status display
bookingSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Pending Confirmation',
    'confirmed': 'Confirmed',
    'cancelled': 'Cancelled',
    'completed': 'Completed',
    'failed': 'Failed'
  };
  return statusMap[this.status] || this.status;
});

// Pre-save middleware
bookingSchema.pre('save', function(next) {
  this.importantDates.lastModified = new Date();
  next();
});

// Methods
bookingSchema.methods.addNote = function(note, author, isInternal = false) {
  this.notes.push({
    type: note,
    author: author,
    isInternal: isInternal
  });
  return this.save();
};

bookingSchema.methods.updateStatus = function(newStatus, reason) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  this.modifications.push({
    type: 'status_change',
    oldValue: oldStatus,
    newValue: newStatus,
    reason: reason
  });
  
  return this.save();
};

bookingSchema.methods.canBeCancelled = function() {
  if (this.status !== 'confirmed') return false;
  if (!this.importantDates.cancellationDeadline) return true;
  return new Date() < this.importantDates.cancellationDeadline;
};

// Static methods
bookingSchema.statics.findByUserId = function(userId) {
  return this.find({ userId: userId }).sort({ createdAt: -1 });
};

bookingSchema.statics.findUpcoming = function(userId) {
  const today = new Date();
  return this.find({ 
    userId: userId,
    status: 'confirmed',
    'importantDates.travelDate': { $gte: today }
  }).sort({ 'importantDates.travelDate': 1 });
};

bookingSchema.statics.findByConfirmation = function(confirmationNumber) {
  return this.findOne({ confirmationNumber: confirmationNumber });
};

module.exports = mongoose.model('Booking', bookingSchema);