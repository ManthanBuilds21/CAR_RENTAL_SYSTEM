const Car = require('../models/Car');

// @desc    Get all cars with filters, sort, pagination
// @route   GET /api/cars
// @access  Public
const getCars = async (req, res) => {
  try {
    const {
      brand, type, fuelType, transmission, seats,
      minPrice, maxPrice, available, search, sort, page = 1, limit = 9,
    } = req.query;

    console.log('ID:', req.params.id);

    const query = {};

    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (type) query.type = type;
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;
    if (seats) query.seats = parseInt(seats);
    if (available !== undefined) query.available = available === 'true';
    if (minPrice || maxPrice) {
      query.pricePerDay = {};
      if (minPrice) query.pricePerDay.$gte = parseInt(minPrice);
      if (maxPrice) query.pricePerDay.$lte = parseInt(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const sortOptions = {};
    if (sort) {
      const sortField = sort.startsWith('-') ? sort.slice(1) : sort;
      sortOptions[sortField] = sort.startsWith('-') ? -1 : 1;
    } else {
      sortOptions.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Car.countDocuments(query);
    const cars = await Car.find(query).sort(sortOptions).skip(skip).limit(parseInt(limit));

    res.json({
      cars,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get featured cars
// @route   GET /api/cars/featured
// @access  Public
const getFeaturedCars = async (req, res) => {
  try {
    const cars = await Car.find({ available: true }).sort({ rating: -1 }).limit(6);
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single car
// @route   GET /api/cars/:id
// @access  Public
const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new car
// @route   POST /api/cars
// @access  Admin
const createCar = async (req, res) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update car
// @route   PUT /api/cars/:id
// @access  Admin
const updateCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete car
// @route   DELETE /api/cars/:id
// @access  Admin
const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: 'Car not found' });
    res.json({ message: 'Car deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get cars near a location
// @route   GET /api/cars/nearby?lat=...&lng=...&radius=...
// @access  Public
const getNearbyCars = async (req, res) => {
  try {
    const { lat, lng, radius = 20 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ message: 'lat and lng query params are required' });
    }

    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);
    const maxRadius = parseFloat(radius);

    // Fetch all available cars that have coordinates
    const cars = await Car.find({
      available: true,
      latitude: { $ne: null },
      longitude: { $ne: null },
    });

    // Haversine formula — distance between two coordinates in km
    const toRad = (val) => (val * Math.PI) / 180;
    const getDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const nearbyCars = cars
      .map((car) => ({
        ...car.toObject(),
        distance: parseFloat(getDistance(userLat, userLng, car.latitude, car.longitude).toFixed(2)),
      }))
      .filter((car) => car.distance <= maxRadius)
      .sort((a, b) => a.distance - b.distance);

    res.json({ count: nearbyCars.length, cars: nearbyCars });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCars,
  getFeaturedCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getNearbyCars,
};