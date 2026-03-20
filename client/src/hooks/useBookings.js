// ============================================================
//  useBookings.js
//  Path: client/src/hooks/useBookings.js
//  No style changes needed — pure data hook, no UI.
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import bookingService from '../services/bookingService';

const useBookings = (type = 'user') => {
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 });

  const fetchBookings = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      if (type === 'admin') {
        const data = await bookingService.getAllBookings(params);
        setBookings(data.data);
        setPagination({ total: data.total, pages: data.pages, currentPage: data.currentPage });
      } else {
        const data = await bookingService.getUserBookings();
        setBookings(data);
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const cancelBooking = async (id) => {
    await bookingService.cancelBooking(id);
    setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
  };

  return { bookings, loading, error, pagination, fetchBookings, cancelBooking };
};

export default useBookings;