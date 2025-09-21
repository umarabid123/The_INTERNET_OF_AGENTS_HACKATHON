const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    required: true,
    unique: true
  },
  orderId: {
    type: String,
    required: true
  },
  bookingId: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Payment Details
  amount: {
    original: {
      value: {
        type: Number,
        required: true
      },
      currency: {
        type: String,
        required: true,
        default: 'USD'
      }
    },
    crypto: {
      value: Number,
      currency: String,
      exchangeRate: Number
    },
    fees: {
      service: {
        type: Number,
        default: 0
      },
      network: {
        type: Number,
        default: 0
      },
      processing: {
        type: Number,
        default: 0
      }
    },
    total: {
      type: Number,
      required: true
    }
  },

  // Payment Method
  method: {
    type: {
      type: String,
      enum: ['card', 'bank_transfer', 'digital_wallet'],
      required: true
    },
    provider: {
      type: String,
      required: true // 'stripe', 'paypal', etc.
    },
    details: {
      // For card payments
      last4: String,
      brand: String,
      expMonth: Number,
      expYear: Number,
      
      // For bank transfers
      bankName: String,
      accountLast4: String,
      
      // For digital wallets
      walletType: String
    }
  },

  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'expired', 'refunded', 'partially_refunded'],
    default: 'pending'
  },

  // Transaction Details
  transaction: {
    hash: String,
    blockNumber: Number,
    confirmations: {
      type: Number,
      default: 0
    },
    requiredConfirmations: {
      type: Number,
      default: 1
    },
    networkFee: Number,
    gasUsed: Number,
    gasPrice: Number
  },

  // Provider Response
  providerResponse: {
    externalId: String,
    externalStatus: String,
    paymentUrl: String,
    qrCode: String,
    instructions: String,
    metadata: mongoose.Schema.Types.Mixed,
    lastResponse: mongoose.Schema.Types.Mixed
  },

  // Customer Information
  customer: {
    email: {
      type: String,
      required: true
    },
    ipAddress: String,
    userAgent: String,
    deviceFingerprint: String,
    geoLocation: {
      country: String,
      city: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    }
  },

  // Risk Assessment
  riskAssessment: {
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    level: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    factors: [String],
    requiresReview: {
      type: Boolean,
      default: false
    }
  },

  // Timeline
  timeline: {
    initiated: {
      type: Date,
      default: Date.now
    },
    processed: Date,
    completed: Date,
    failed: Date,
    expired: Date,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },

  // Expiration
  expiresAt: {
    type: Date,
    required: true
  },

  // Webhooks and Notifications
  webhooks: [{
    event: String,
    url: String,
    attempts: {
      type: Number,
      default: 0
    },
    lastAttempt: Date,
    successful: {
      type: Boolean,
      default: false
    },
    response: mongoose.Schema.Types.Mixed
  }],

  notifications: {
    customer: {
      email: {
        sent: {
          type: Boolean,
          default: false
        },
        sentAt: Date
      },
      sms: {
        sent: {
          type: Boolean,
          default: false
        },
        sentAt: Date
      }
    },
    merchant: {
      email: {
        sent: {
          type: Boolean,
          default: false
        },
        sentAt: Date
      }
    }
  },

  // Refunds
  refunds: [{
    refundId: String,
    amount: Number,
    currency: String,
    reason: String,
    status: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending'
    },
    transactionHash: String,
    processedAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Security
  security: {
    signature: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'failed'],
      default: 'pending'
    },
    fraudScore: Number,
    amlCheck: {
      status: {
        type: String,
        enum: ['pending', 'passed', 'failed', 'manual_review'],
        default: 'pending'
      },
      provider: String,
      reference: String
    }
  },

  // Additional Data
  metadata: {
    source: String,
    campaign: String,
    referrer: String,
    sessionId: String,
    customFields: mongoose.Schema.Types.Mixed
  },

  // Error Information
  errors: [{
    code: String,
    message: String,
    details: mongoose.Schema.Types.Mixed,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],

  // Reconciliation
  reconciliation: {
    status: {
      type: String,
      enum: ['pending', 'matched', 'discrepancy', 'manual_review'],
      default: 'pending'
    },
    matchedAt: Date,
    reconciledBy: String,
    notes: String
  }
}, {
  timestamps: true
});

// Indexes for performance
paymentSchema.index({ paymentId: 1 }, { unique: true });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ bookingId: 1 });
paymentSchema.index({ userId: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ 'method.type': 1 });
paymentSchema.index({ 'method.provider': 1 });
paymentSchema.index({ 'timeline.initiated': -1 });
paymentSchema.index({ expiresAt: 1 });

// Compound indexes
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ bookingId: 1, status: 1 });
paymentSchema.index({ status: 1, 'timeline.initiated': -1 });

// TTL index for expired payments cleanup
paymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual properties
paymentSchema.virtual('isExpired').get(function() {
  return new Date() > this.expiresAt;
});

paymentSchema.virtual('timeRemaining').get(function() {
  const now = new Date();
  const remaining = this.expiresAt - now;
  return remaining > 0 ? remaining : 0;
});

paymentSchema.virtual('totalRefunded').get(function() {
  return this.refunds
    .filter(refund => refund.status === 'completed')
    .reduce((total, refund) => total + refund.amount, 0);
});

paymentSchema.virtual('statusDisplay').get(function() {
  const statusMap = {
    'pending': 'Awaiting Payment',
    'processing': 'Processing',
    'completed': 'Payment Successful',
    'failed': 'Payment Failed',
    'cancelled': 'Payment Cancelled',
    'expired': 'Payment Expired',
    'refunded': 'Fully Refunded',
    'partially_refunded': 'Partially Refunded'
  };
  return statusMap[this.status] || this.status;
});

// Pre-save middleware
paymentSchema.pre('save', function(next) {
  this.timeline.lastUpdated = new Date();
  next();
});

// Methods
paymentSchema.methods.updateStatus = function(newStatus, providerResponse) {
  const oldStatus = this.status;
  this.status = newStatus;
  
  // Update timeline
  switch (newStatus) {
    case 'processing':
      this.timeline.processed = new Date();
      break;
    case 'completed':
      this.timeline.completed = new Date();
      break;
    case 'failed':
      this.timeline.failed = new Date();
      break;
    case 'expired':
      this.timeline.expired = new Date();
      break;
  }
  
  // Update provider response
  if (providerResponse) {
    this.providerResponse.lastResponse = providerResponse;
    this.providerResponse.externalStatus = providerResponse.status;
  }
  
  return this.save();
};

paymentSchema.methods.addError = function(code, message, details) {
  this.errors.push({
    code: code,
    message: message,
    details: details
  });
  return this.save();
};

paymentSchema.methods.processRefund = function(amount, reason) {
  const refundId = `ref_${Date.now()}`;
  
  this.refunds.push({
    refundId: refundId,
    amount: amount,
    currency: this.amount.original.currency,
    reason: reason,
    status: 'pending'
  });
  
  // Update payment status
  const totalRefunded = this.totalRefunded + amount;
  if (totalRefunded >= this.amount.total) {
    this.status = 'refunded';
  } else {
    this.status = 'partially_refunded';
  }
  
  return this.save();
};

paymentSchema.methods.canBeRefunded = function() {
  return this.status === 'completed' && this.totalRefunded < this.amount.total;
};

// Static methods
paymentSchema.statics.findByBookingId = function(bookingId) {
  return this.find({ bookingId: bookingId }).sort({ createdAt: -1 });
};

paymentSchema.statics.findByUserId = function(userId) {
  return this.find({ userId: userId }).sort({ createdAt: -1 });
};

paymentSchema.statics.findPending = function() {
  return this.find({ 
    status: { $in: ['pending', 'processing'] },
    expiresAt: { $gt: new Date() }
  });
};

paymentSchema.statics.findExpired = function() {
  return this.find({ 
    status: { $in: ['pending', 'processing'] },
    expiresAt: { $lte: new Date() }
  });
};

paymentSchema.statics.getPaymentStats = function(userId, startDate, endDate) {
  const match = { userId: userId };
  
  if (startDate && endDate) {
    match['timeline.initiated'] = {
      $gte: startDate,
      $lte: endDate
    };
  }
  
  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount.total' }
      }
    }
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema);