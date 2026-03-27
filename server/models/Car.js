const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Model is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Car type is required'],
      enum: ['Sedan', 'SUV', 'Hatchback', 'MUV', 'Luxury', 'Convertible', 'Pickup'],
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price must be positive'],
    },
    seats: {
      type: Number,
      required: [true, 'Number of seats is required'],
      min: 2,
      max: 9,
    },
    fuelType: {
      type: String,
      required: [true, 'Fuel type is required'],
      enum: ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG'],
    },
    transmission: {
      type: String,
      enum: ['Manual', 'Automatic'],
      default: 'Manual',
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/400x250?text=Car+Image',
    },
    imageFileId: {
      type: String,
      default: '',
    },
    available: {
      type: Boolean,
      default: true,
    },
    year: {
      type: Number,
    },
    mileage: {
      type: String,
    },
    description: {
      type: String,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    features: [{ type: String }],
    rating: {
      type: Number,
      default: 4.0,
      min: 1,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    // ── MAP FEATURE: added lat/lng ──
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
  },
  { timestamps: true }
);

// Full-text search index
carSchema.index({ brand: 'text', model: 'text', type: 'text' });

module.exports = mongoose.model('Car', carSchema);  