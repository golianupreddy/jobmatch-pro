import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export const analysisKeys = {
  all: ['analyses'],
  list: (page) => ['analyses', 'list', page],
  detail: (id) => ['analyses', 'detail', id],
};

export const useAnalyses = (page = 1) =>
  useQuery({
    queryKey: analysisKeys.list(page),
    queryFn: () => api.get('/analysis', { params: { page } }).then((r) => r.data),
    placeholderData: (prev) => prev,
  });

export const useAnalysis = (id) =>
  useQuery({
    queryKey: analysisKeys.detail(id),
    queryFn: () => api.get(`/analysis/${id}`).then((r) => r.data),
    enabled: !!id,
  });

export const useDeleteAnalysis = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/analysis/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: analysisKeys.all }),
  });
};
