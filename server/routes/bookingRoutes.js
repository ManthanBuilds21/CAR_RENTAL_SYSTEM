const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/', protect, createBooking);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/user', protect, getUserBookings);
router.get('/:id', protect, getBookingById);
router.delete('/:id', protect, cancelBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

module.exports = router;
