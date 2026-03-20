const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Car',
      required: true,
    },
    pickupDate: {
      type: Date,
      required: [true, 'Pickup date is required'],
    },
    returnDate: {
      type: Date,
      required: [true, 'Return date is required'],
    },
    totalDays: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'active', 'completed', 'cancelled'],
      default: 'pending',
    },
    pickupLocation: {
      type: String,
      default: 'Main Office',
    },
    dropLocation: {
      type: String,
      default: 'Main Office',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    notes: {
      type: String,
      maxlength: 300,
    },
  },
  { timestamps: true }
);

// Validate returnDate > pickupDate
bookingSchema.pre('save', function (next) {
  if (this.returnDate <= this.pickupDate) {
    return next(new Error('Return date must be after pickup date'));
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
