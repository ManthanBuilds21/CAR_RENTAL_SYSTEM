const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Car = require('../models/Car');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
const createBooking = asyncHandler(async (req, res) => {
  const { carId, pickupDate, returnDate, pickupLocation, dropLocation, notes } = req.body;

  const car = await Car.findById(carId);
  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  if (!car.available) {
    res.status(400);
    throw new Error('Car is not available for the selected dates');
  }

  const pickup = new Date(pickupDate);
  const returnD = new Date(returnDate);

  if (returnD <= pickup) {
    res.status(400);
    throw new Error('Return date must be after pickup date');
  }

  if (pickup < new Date()) {
    res.status(400);
    throw new Error('Pickup date cannot be in the past');
  }

  const totalDays = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
  const totalPrice = totalDays * car.pricePerDay;

  // Check for conflicting bookings
  const conflict = await Booking.findOne({
    car: carId,
    status: { $in: ['pending', 'confirmed', 'active'] },
    $or: [
      { pickupDate: { $lt: returnD }, returnDate: { $gt: pickup } },
    ],
  });

  if (conflict) {
    res.status(400);
    throw new Error('Car is already booked for the selected dates');
  }

  const booking = await Booking.create({
    user: req.user._id,
    car: carId,
    pickupDate: pickup,
    returnDate: returnD,
    totalDays,
    totalPrice,
    pickupLocation: pickupLocation || 'Main Office',
    dropLocation: dropLocation || 'Main Office',
    notes,
  });

  const populated = await Booking.findById(booking._id).populate('car', 'brand model image pricePerDay type');

  res.status(201).json({ success: true, data: populated });
});

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10 } = req.query;
  const query = status ? { status } : {};

  const total = await Booking.countDocuments(query);
  const bookings = await Booking.find(query)
    .populate('user', 'name email phone')
    .populate('car', 'brand model image type pricePerDay')
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  res.json({
    success: true,
    count: bookings.length,
    total,
    pages: Math.ceil(total / limit),
    currentPage: Number(page),
    data: bookings,
  });
});

// @desc    Get logged-in user bookings
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('car', 'brand model image type pricePerDay fuelType seats')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: bookings.length, data: bookings });
});

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBookingById = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id)
    .populate('user', 'name email phone')
    .populate('car', 'brand model image type pricePerDay fuelType seats transmission');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Allow only owner or admin
  if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to view this booking');
  }

  res.json({ success: true, data: booking });
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
const cancelBooking = asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  // Only owner or admin can cancel
  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to cancel this booking');
  }

  if (['completed', 'cancelled'].includes(booking.status)) {
    res.status(400);
    throw new Error(`Booking is already ${booking.status}`);
  }

  booking.status = 'cancelled';
  await booking.save();

  res.json({ success: true, message: 'Booking cancelled successfully', data: booking });
});

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
const updateBookingStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'active', 'completed', 'cancelled'];

  if (!validStatuses.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const booking = await Booking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  ).populate('user', 'name email').populate('car', 'brand model');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  res.json({ success: true, data: booking });
});

module.exports = {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
};
