import { useMutation } from '@tanstack/react-query';
import client from '../api/client.js';

export const useAISearch = () => {
  const searchMutation = useMutation({
    mutationFn: async (query) => {
      const response = await client.post('/events/search', { query });
      return response.data.data;
    },
  });

  return {
    search: searchMutation.mutate,
    searchAsync: searchMutation.mutateAsync,
    results: searchMutation.data,
    loading: searchMutation.isPending,
    error: searchMutation.error?.response?.data?.error || searchMutation.error?.message || null,
    reset: searchMutation.reset
  };
};

export default useAISearch;
