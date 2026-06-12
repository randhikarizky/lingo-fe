import { useMutation } from "@tanstack/react-query";

import { conversationService } from "../../data/repositories/conversation.repository.impl";
import { ChatRequest } from "../../data/request/chat.request";

export const useChat = () =>
  useMutation({
    mutationFn: (request: ChatRequest) => conversationService.chat(request),
  });
