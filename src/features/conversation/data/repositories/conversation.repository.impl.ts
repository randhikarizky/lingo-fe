import { conversationApi } from "../network/conversation.api";
import { ChatRequest } from "../request/chat.request";

class ConversationRepositoryImpl {
  async chat(request: ChatRequest) {
    const { data } = await conversationApi.chat(request);
    return data.data;
  }
}

export const conversationService = new ConversationRepositoryImpl();
