const express = require('express');
const router = express.Router();
const instantBookingService = require('../services/instantBookingService');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');

/**
 * @route   POST /api/booking/instant
 * @desc    Create instant booking
 * @access  Public
 */
router.post('/instant', async (req, res) => {
  try {
    const {
      type, // 'flight' or 'hotel'
      offerId,
      travelerDetails,
      contactInfo,
      paymentInfo,
      userId
    } = req.body;

    // Validate required fields
    if (!type || !offerId || !travelerDetails || !contactInfo) {
      return res.status(400).json({
        success: false,
        message: 'type, offerId, travelerDetails, and contactInfo are required'
      });
    }

    // Check availability first
    const availability = await instantBookingService.checkAvailability(offerId, type);
    if (!availability.available) {
      return res.status(409).json({
        success: false,
        message: 'Selected option is no longer available',
        data: availability
      });
    }

    // Create instant booking
    const bookingResult = await instantBookingService.createInstantBooking({
      type,
      offerId,
      travelerDetails,
      contactInfo,
      paymentInfo
    });

    if (!bookingResult.success) {
      return res.status(500).json({
        success: false,
        message: 'Failed to create booking'
      });
    }

    // Save booking to database
    const booking = new Booking({
      bookingId: bookingResult.bookingId,
      confirmationNumber: bookingResult.confirmationNumber,
      userId: userId,
      type: type,
      status: 'confirmed',
      
      contactInfo: {
        email: contactInfo.email,
        phone: contactInfo.phone,
        emergencyContact: contactInfo.emergencyContact
      },

      travelers: travelerDetails.map(traveler => ({
        type: traveler.type || 'adult',
        title: traveler.title,
        firstName: traveler.firstName,
        lastName: traveler.lastName,
        dateOfBirth: new Date(traveler.dateOfBirth),
        nationality: traveler.nationality,
        passportNumber: traveler.passportNumber,
        passportExpiry: traveler.passportExpiry ? new Date(traveler.passportExpiry) : undefined,
        specialRequests: traveler.specialRequests || []
      })),

      // Type-specific details will be populated based on booking result
      flightDetails: type === 'flight' ? {
        outbound: bookingResult.details.flights?.[0] || {},
        return: bookingResult.details.flights?.[1] || {},
        class: bookingResult.details.class || 'economy',
        ticketNumbers: bookingResult.tickets || []
      } : undefined,

      hotelDetails: type === 'hotel' ? {
        hotelName: bookingResult.details.hotel?.name,
        hotelId: bookingResult.details.hotel?.id,
        address: bookingResult.details.hotel?.address || {},
        checkIn: bookingResult.details.checkIn ? new Date(bookingResult.details.checkIn) : undefined,
        checkOut: bookingResult.details.checkOut ? new Date(bookingResult.details.checkOut) : undefined,
        nights: bookingResult.details.nights || 1,
        rooms: bookingResult.details.rooms || [],
        hotelConfirmationNumber: bookingResult.details.confirmationNumber
      } : undefined,

      pricing: {
        basePrice: bookingResult.details.totalPrice?.amount || 0,
        totalPrice: bookingResult.details.totalPrice?.amount || 0,
        currency: bookingResult.details.totalPrice?.currency || 'USD'
      },

      provider: {
        name: 'Instant Booking Service',
        reference: bookingResult.providerReference,
        bookingReference: bookingResult.confirmationNumber
      },

      source: {
        platform: 'ai-travel-agent',
        channel: 'web',
        sessionId: req.sessionID
      },

      importantDates: {
        travelDate: type === 'flight' 
          ? (bookingResult.details.flights?.[0]?.departure ? new Date(bookingResult.details.flights[0].departure) : undefined)
          : (bookingResult.details.checkIn ? new Date(bookingResult.details.checkIn) : undefined),
        checkInDate: type === 'hotel' && bookingResult.details.checkIn 
          ? new Date(bookingResult.details.checkIn)
          : undefined
      },

      metadata: {
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      }
    });

    await booking.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`booking-${booking.bookingId}`).emit('booking-created', {
      bookingId: booking.bookingId,
      status: 'confirmed',
      type: type
    });

    res.json({
      success: true,
      data: {
        booking: {
          bookingId: booking.bookingId,
          confirmationNumber: booking.confirmationNumber,
          status: booking.status,
          type: booking.type,
          details: bookingResult.details,
          nextSteps: bookingResult.nextSteps
        }
      }
    });

  } catch (error) {
    console.error('Instant booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create instant booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/booking/:bookingId
 * @desc    Get booking details
 * @access  Public
 */
router.get('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findOne({ bookingId })
      .populate('userId', 'email firstName lastName');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: {
        booking: booking
      }
    });

  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/booking/confirmation/:confirmationNumber
 * @desc    Get booking by confirmation number
 * @access  Public
 */
router.get('/confirmation/:confirmationNumber', async (req, res) => {
  try {
    const { confirmationNumber } = req.params;

    const booking = await Booking.findByConfirmation(confirmationNumber)
      .populate('userId', 'email firstName lastName');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: {
        booking: booking
      }
    });

  } catch (error) {
    console.error('Get booking by confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/booking/user/:userId
 * @desc    Get user's bookings
 * @access  Private (add auth middleware in production)
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      page = 1, 
      limit = 10, 
      status, 
      type,
      upcoming = false 
    } = req.query;

    let query = { userId };

    if (status) {
      query.status = status;
    }

    if (type) {
      query.type = type;
    }

    if (upcoming === 'true') {
      query['importantDates.travelDate'] = { $gte: new Date() };
      query.status = 'confirmed';
    }

    const bookings = await Booking.find(query)
      .sort({ 'importantDates.travelDate': upcoming === 'true' ? 1 : -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Booking.countDocuments(query);

    res.json({
      success: true,
      data: {
        bookings: bookings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve bookings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   PUT /api/booking/:bookingId
 * @desc    Update booking
 * @access  Private (add auth middleware in production)
 */
router.put('/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const updates = req.body;

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Track modifications
    Object.keys(updates).forEach(key => {
      if (booking[key] !== updates[key]) {
        booking.modifications.push({
          type: 'field_update',
          oldValue: booking[key],
          newValue: updates[key],
          modifiedBy: req.user?.id || 'system'
        });
      }
    });

    // Apply updates
    Object.assign(booking, updates);
    await booking.save();

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`booking-${bookingId}`).emit('booking-updated', {
      bookingId: bookingId,
      updates: updates
    });

    res.json({
      success: true,
      data: {
        booking: booking
      }
    });

  } catch (error) {
    console.error('Update booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/booking/:bookingId/cancel
 * @desc    Cancel booking
 * @access  Private (add auth middleware in production)
 */
router.post('/:bookingId/cancel', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason = 'Customer request' } = req.body;

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled at this time'
      });
    }

    // Cancel with provider
    const cancellationResult = await instantBookingService.cancelBooking(bookingId);

    // Update booking status
    await booking.updateStatus('cancelled', reason);

    // Add cancellation note
    await booking.addNote(`Booking cancelled. Reason: ${reason}`, 'system');

    // Emit real-time update
    const io = req.app.get('io');
    io.to(`booking-${bookingId}`).emit('booking-cancelled', {
      bookingId: bookingId,
      status: 'cancelled',
      reason: reason
    });

    res.json({
      success: true,
      data: {
        bookingId: bookingId,
        status: 'cancelled',
        cancellation: cancellationResult
      }
    });

  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   POST /api/booking/:bookingId/notes
 * @desc    Add note to booking
 * @access  Private (add auth middleware in production)
 */
router.post('/:bookingId/notes', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { note, isInternal = false } = req.body;

    if (!note) {
      return res.status(400).json({
        success: false,
        message: 'Note content is required'
      });
    }

    const booking = await Booking.findOne({ bookingId });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    await booking.addNote(note, req.user?.id || 'system', isInternal);

    res.json({
      success: true,
      data: {
        bookingId: bookingId,
        note: note,
        notes: booking.notes
      }
    });

  } catch (error) {
    console.error('Add booking note error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route   GET /api/booking/statistics/:userId
 * @desc    Get booking statistics for user
 * @access  Private (add auth middleware in production)
 */
router.get('/statistics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await Booking.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalSpent: { $sum: '$pricing.totalPrice' }
        }
      }
    ]);

    const upcomingBookings = await Booking.findUpcoming(userId);
    const totalBookings = await Booking.countDocuments({ userId });

    res.json({
      success: true,
      data: {
        statistics: stats,
        totalBookings: totalBookings,
        upcomingTrips: upcomingBookings.length,
        nextTrip: upcomingBookings[0] || null
      }
    });

  } catch (error) {
    console.error('Get booking statistics error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;