import { learningApi } from "../network/learning.api";

export const learningService = {
  catalog: async () => {
    const { data } = await learningApi.catalog();
    return data.data;
  },
  endSession: async (conversationId: string) => {
    const { data } = await learningApi.endSession(conversationId);
    return data.data;
  },
};
