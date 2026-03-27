import { useState, useEffect, useCallback } from 'react';
import carService from '../services/carService';

const useCars = (initialParams = {}) => {
  const [cars, setCars]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [pagination, setPagination] = useState({ total: 0, pages: 1, currentPage: 1 });
  const [params, setParams]         = useState(initialParams);

  const fetchCars = useCallback(async (queryParams) => {
    setLoading(true);
    setError(null);
    try {
      const data = await carService.getCars(queryParams || params);
      setCars(data.cars || []);  // ← was data.data, your API returns data.cars
      setPagination({
        total: data.total || 0,
        pages: data.pages || 1,
        currentPage: data.page || 1,  // ← was data.currentPage, API returns data.page
      });
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load cars');
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => { fetchCars(); }, [fetchCars]);

  const updateParams = (newParams) => {
    const merged = { ...params, ...newParams, page: newParams.page || 1 };
    setParams(merged);
  };

  return { cars, loading, error, pagination, params, updateParams, refetch: fetchCars };
};

export default useCars;