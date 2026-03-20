const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Car = require('../models/Car');
const imagekit = require('../config/imagekit');

// @desc    Get all cars with filtering, sorting, pagination
// @route   GET /api/cars
// @access  Public
const getCars = asyncHandler(async (req, res) => {
   console.log('ID:', req.params.id);
  const {
    brand, type, fuelType, transmission, available,
    minPrice, maxPrice, seats, search,
    page = 1, limit = 9, sort = '-createdAt',
  } = req.query;

  const query = {};

  if (brand) query.brand = { $regex: brand, $options: 'i' };
  if (type) query.type = type;
  if (fuelType) query.fuelType = fuelType;
  if (transmission) query.transmission = transmission;
  if (available !== undefined) query.available = available === 'true';
  if (seats) query.seats = Number(seats);
  if (minPrice || maxPrice) {
    query.pricePerDay = {};
    if (minPrice) query.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) query.pricePerDay.$lte = Number(maxPrice);
  }
  if (search) {
    query.$or = [
      { brand: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
      { type: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await Car.countDocuments(query);
  const cars = await Car.find(query).sort(sort).skip(skip).limit(limitNum);

  res.json({
    success: true,
    count: cars.length,
    total,
    pages: Math.ceil(total / limitNum),
    currentPage: pageNum,
    data: cars,
  });
});

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid car ID format');
  }
  const car = await Car.findById(req.params.id);
  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }
  res.json({ success: true, data: car });
});

// @desc    Create car (admin)
// @route   POST /api/cars
// @access  Private/Admin
const createCar = asyncHandler(async (req, res) => {
  const car = await Car.create(req.body);
  res.status(201).json({ success: true, data: car });
});

// @desc    Update car (admin)
// @route   PUT /api/cars/:id
// @access  Private/Admin
const updateCar = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid car ID format');
  }
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }
  res.json({ success: true, data: car });
});

// @desc    Delete car (admin)
// @route   DELETE /api/cars/:id
// @access  Private/Admin
const deleteCar = asyncHandler(async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error('Invalid car ID format');
  }
  const car = await Car.findById(req.params.id);
  if (!car) {
    res.status(404);
    throw new Error('Car not found');
  }

  if (car.imageFileId) {
    try {
      await imagekit.deleteFile(car.imageFileId);
    } catch (err) {
      console.warn('ImageKit delete failed:', err.message);
    }
  }

  await car.deleteOne();
  res.json({ success: true, message: 'Car deleted successfully' });
});

// @desc    Get featured/available cars
// @route   GET /api/cars/featured
// @access  Public
const getFeaturedCars = asyncHandler(async (req, res) => {
  const cars = await Car.find({ available: true }).sort({ rating: -1 }).limit(6);
  res.json({ success: true, data: cars });
});

module.exports = { getCars, getCarById, createCar, updateCar, deleteCar, getFeaturedCars }; 