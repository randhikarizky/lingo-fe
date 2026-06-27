import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { learningService } from "../../data/repositories/learning.repository.impl";

export const useLearningCatalog = () =>
  useQuery({
    queryKey: ["learning", "catalog"],
    queryFn: () => learningService.catalog(),
    staleTime: 1000 * 60 * 30,
  });

export const useEndSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (conversationId: string) => learningService.endSession(conversationId),
    onSuccess: (_data, conversationId) => {
      queryClient.invalidateQueries({ queryKey: ["conversations", "detail", conversationId] });
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
};
