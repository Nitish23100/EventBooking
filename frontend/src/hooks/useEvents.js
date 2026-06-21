import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import client from '../api/client.js';

export const useEvents = (initialCategory = 'all', initialLimit = 12) => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState(initialCategory);
  const [search, setSearch] = useState('');

  const eventsQuery = useQuery({
    queryKey: ['events', { page, category, search, limit: initialLimit }],
    queryFn: async () => {
      const response = await client.get('/events', {
        params: {
          page,
          limit: initialLimit,
          category: category !== 'all' ? category : undefined,
          search: search ? search : undefined,
        },
      });
      return response.data.data;
    },
  });

  const changeCategory = (cat) => {
    setCategory(cat);
    setPage(1);
  };

  const changeSearch = (query) => {
    setSearch(query);
    setPage(1);
  };

  return {
    events: eventsQuery.data?.events || [],
    loading: eventsQuery.isLoading,
    error: eventsQuery.error?.response?.data?.error || eventsQuery.error?.message || null,
    page,
    setPage,
    pages: eventsQuery.data?.pagination?.pages || 1,
    category,
    setCategory: changeCategory,
    search,
    setSearch: changeSearch,
  };
};

export default useEvents;
