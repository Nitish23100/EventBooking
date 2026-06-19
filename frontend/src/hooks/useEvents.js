import { useState, useEffect } from 'react';
import client from '../api/client.js';

export const useEvents = (initialCategory = 'all', initialLimit = 12) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await client.get('/events', {
          params: {
            page,
            limit: initialLimit,
            category: category !== 'all' ? category : undefined,
            search: search ? search : undefined,
          },
        });
        const { events: fetchedEvents, pagination } = response.data.data;
        setEvents(fetchedEvents);
        setPages(pagination.pages);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch events');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [page, category, search, initialLimit]);

  const changeCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const changeSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  return {
    events,
    loading,
    error,
    page,
    setPage,
    pages,
    category,
    setCategory: changeCategory,
    search,
    setSearch: changeSearch,
  };
};
export default useEvents;
