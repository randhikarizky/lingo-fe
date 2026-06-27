import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";

import { conversationService } from "../../data/repositories/conversation.repository.impl";
import { ChatRequest } from "../../data/request/chat.request";
import { CreateConversationRequest } from "../../data/network/conversation.api";

export const useChat = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: ChatRequest) => conversationService.chat(request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["progress"] });

      if (variables.conversationId) {
        queryClient.invalidateQueries({
          queryKey: ["conversations", "detail", variables.conversationId],
        });
      }
    },
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CreateConversationRequest) =>
      conversationService.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] });
    },
  });
};

export const useGetConversationList = () =>
  useQuery({
    queryKey: ["conversations", "list"],
    queryFn: () => conversationService.list(),
  });

export const useGetConversationDetail = (id: string) =>
  useQuery({
    queryKey: ["conversations", "detail", id],
    queryFn: () => conversationService.detail(id),
    enabled: !!id,
  });

export const useDeleteConversation = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  return useMutation({
    mutationFn: (id: string) => conversationService.delete(id),
    onSuccess: () => {
      enqueueSnackbar("Percakapan berhasil dihapus", { variant: "success" });
      queryClient.invalidateQueries({ queryKey: ["conversations", "list"] });
    },
  });
};
