import { conversationApi, CreateConversationRequest } from "../network/conversation.api";
import { ChatRequest } from "../request/chat.request";

class ConversationRepositoryImpl {
  async chat(request: ChatRequest) {
    const { data } = await conversationApi.chat(request);
    return data.data;
  }

  async create(request: CreateConversationRequest) {
    const { data } = await conversationApi.create(request);
    return data.data;
  }

  async list() {
    const { data } = await conversationApi.list();
    return data.data;
  }

  async detail(id: string) {
    const { data } = await conversationApi.detail(id);
    return data.data;
  }

  async delete(id: string) {
    const { data } = await conversationApi.delete(id);
    return data.data;
  }
}

export const conversationService = new ConversationRepositoryImpl();
