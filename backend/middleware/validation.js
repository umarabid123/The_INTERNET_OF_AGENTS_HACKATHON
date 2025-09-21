const { body, validationResult } = require('express-validator');

/**
 * Handle validation errors
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

/**
 * User registration validation
 */
const validateUserRegistration = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  body('firstName')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  body('lastName')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Valid date of birth is required'),
  body('nationality')
    .optional()
    .isLength({ min: 2, max: 3 })
    .withMessage('Nationality must be a valid country code'),
  handleValidationErrors
];

/**
 * User login validation
 */
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

/**
 * Booking validation
 */
const validateBooking = [
  body('type')
    .isIn(['flight', 'hotel', 'car', 'package'])
    .withMessage('Valid booking type is required'),
  body('details')
    .isObject()
    .withMessage('Booking details are required'),
  body('details.origin')
    .if(body('type').equals('flight'))
    .notEmpty()
    .withMessage('Origin is required for flight bookings'),
  body('details.destination')
    .if(body('type').equals('flight'))
    .notEmpty()
    .withMessage('Destination is required for flight bookings'),
  body('details.departureDate')
    .if(body('type').equals('flight'))
    .isISO8601()
    .withMessage('Valid departure date is required for flight bookings'),
  body('details.location')
    .if(body('type').equals('hotel'))
    .notEmpty()
    .withMessage('Location is required for hotel bookings'),
  body('details.checkIn')
    .if(body('type').equals('hotel'))
    .isISO8601()
    .withMessage('Valid check-in date is required for hotel bookings'),
  body('details.checkOut')
    .if(body('type').equals('hotel'))
    .isISO8601()
    .withMessage('Valid check-out date is required for hotel bookings'),
  body('passengers')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Passengers must be between 1 and 10'),
  body('guests')
    .optional()
    .isInt({ min: 1, max: 10 })
    .withMessage('Guests must be between 1 and 10'),
  handleValidationErrors
];

/**
 * Payment validation
 */
const validatePayment = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Valid amount is required'),
  body('currency')
    .isIn(['USD', 'EUR'])
    .withMessage('Valid currency is required'),
  body('type')
    .isIn(['card', 'bank_transfer'])
    .withMessage('Valid payment type is required'),
  body('bookingId')
    .isMongoId()
    .withMessage('Valid booking ID is required'),
  handleValidationErrors
];

/**
 * Search validation
 */
const validateSearch = [
  body('query')
    .notEmpty()
    .withMessage('Search query is required'),
  body('type')
    .optional()
    .isIn(['flight', 'hotel', 'both'])
    .withMessage('Valid search type is required'),
  body('filters')
    .optional()
    .isObject()
    .withMessage('Filters must be an object'),
  body('filters.budget')
    .optional()
    .isObject()
    .withMessage('Budget filter must be an object'),
  body('filters.budget.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum budget must be a positive number'),
  body('filters.budget.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum budget must be a positive number'),
  handleValidationErrors
];

/**
 * Voice command validation
 */
const validateVoiceCommand = [
  body('command')
    .notEmpty()
    .withMessage('Voice command is required'),
  body('context')
    .optional()
    .isObject()
    .withMessage('Context must be an object'),
  handleValidationErrors
];

/**
 * Text-to-speech validation
 */
const validateTextToSpeech = [
  body('text')
    .notEmpty()
    .isLength({ max: 5000 })
    .withMessage('Text is required and must be less than 5000 characters'),
  body('voiceId')
    .optional()
    .isString()
    .withMessage('Voice ID must be a string'),
  body('model')
    .optional()
    .isString()
    .withMessage('Model must be a string'),
  handleValidationErrors
];

/**
 * Coral orchestration validation
 */
const validateOrchestration = [
  body('task')
    .isObject()
    .withMessage('Task specification is required'),
  body('task.type')
    .isIn(['complete_booking', 'search_and_recommend', 'process_payment', 'voice_interaction'])
    .withMessage('Valid task type is required'),
  body('agents')
    .optional()
    .isArray()
    .withMessage('Agents must be an array'),
  body('data')
    .optional()
    .isObject()
    .withMessage('Data must be an object'),
  body('priority')
    .optional()
    .isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Valid priority level is required'),
  handleValidationErrors
];

/**
 * Change password validation
 */
const validateChangePassword = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one lowercase letter, one uppercase letter, and one number'),
  handleValidationErrors
];

/**
 * Profile update validation
 */
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  body('lastName')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Valid phone number is required'),
  body('dateOfBirth')
    .optional()
    .isISO8601()
    .withMessage('Valid date of birth is required'),
  body('nationality')
    .optional()
    .isLength({ min: 2, max: 3 })
    .withMessage('Nationality must be a valid country code'),
  body('preferences')
    .optional()
    .isObject()
    .withMessage('Preferences must be an object'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateBooking,
  validatePayment,
  validateSearch,
  validateVoiceCommand,
  validateTextToSpeech,
  validateOrchestration,
  validateChangePassword,
  validateProfileUpdate
};