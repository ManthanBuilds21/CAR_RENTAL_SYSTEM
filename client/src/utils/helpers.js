// ============================================================
//  helpers.js
//  Path: client/src/utils/helpers.js
//  No style changes needed — pure utility functions, no UI.
// ============================================================

import { format, differenceInDays, parseISO } from 'date-fns';

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

export const formatDate = (date) => {
  if (!date) return '-';
  try { return format(typeof date === 'string' ? parseISO(date) : date, 'dd MMM yyyy'); }
  catch { return '-'; }
};

export const formatDateInput = (date) => {
  if (!date) return '';
  try { return format(typeof date === 'string' ? parseISO(date) : date, 'yyyy-MM-dd'); }
  catch { return ''; }
};

export const calcTotalDays = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) return 0;
  const days = differenceInDays(new Date(returnDate), new Date(pickupDate));
  return Math.max(days, 0);
};

export const calcTotalPrice = (pricePerDay, pickupDate, returnDate) => {
  const days = calcTotalDays(pickupDate, returnDate);
  return days * pricePerDay;
};

export const getStatusClass = (status) => {
  const map = {
    pending:   'status-pending',
    confirmed: 'status-confirmed',
    active:    'status-active',
    completed: 'status-completed',
    cancelled: 'status-cancelled',
  };
  return map[status] || 'badge bg-dark-700 text-dark-300';
};

export const truncate = (str, n = 80) =>
  str && str.length > n ? str.slice(0, n - 1) + '…' : str;

export const getTodayString = () =>
  new Date().toISOString().split('T')[0];

export const fuelIcon = (fuel) => {
  const icons = { Petrol: '⛽', Diesel: '🛢️', Electric: '⚡', Hybrid: '🌿', CNG: '💨' };
  return icons[fuel] || '⛽';
};

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong';