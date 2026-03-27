const express = require('express');
const router = express.Router();
const {
  getCars,
  getFeaturedCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
  getNearbyCars,
} = require('../controllers/carController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getCars);
router.get('/featured', getFeaturedCars);
router.get('/nearby', getNearbyCars);   // ← MUST be before /:id
router.get('/:id', getCarById);
router.post('/', protect, adminOnly, createCar);
router.put('/:id', protect, adminOnly, updateCar);
router.delete('/:id', protect, adminOnly, deleteCar);

module.exports = router;