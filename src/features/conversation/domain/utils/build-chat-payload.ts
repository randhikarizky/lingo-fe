import type { ChatMessageEntity } from "../entities/chat-message.entity";

function isDeliverableMessage(message: ChatMessageEntity) {
  if (message.role === "user") {
    return !message.deliveryStatus || message.deliveryStatus === "sent";
  }

  if (message.role === "assistant") {
    return !message.assistantStatus || message.assistantStatus === "completed";
  }

  return false;
}

export function buildChatPayloadMessages(messages: ChatMessageEntity[]) {
  return messages
    .filter((message) => message.role === "user" || message.role === "assistant")
    .filter(isDeliverableMessage)
    .map((message) => ({
      role: message.role as "user" | "assistant",
      content: message.content,
    }));
}

export function buildChatPayloadUntilUser(
  messages: ChatMessageEntity[],
  userMessageId: string
) {
  const userIndex = messages.findIndex((message) => message.id === userMessageId);
  if (userIndex === -1) return [];

  const slice = messages.slice(0, userIndex + 1);
  return buildChatPayloadMessages(
    slice.map((message) =>
      message.id === userMessageId
        ? { ...message, deliveryStatus: "sent" as const }
        : message
    )
  );
}

export function buildChatPayloadBeforeAssistant(
  messages: ChatMessageEntity[],
  assistantMessageId: string
) {
  const assistantIndex = messages.findIndex((message) => message.id === assistantMessageId);
  if (assistantIndex === -1) return [];

  const preceding = messages.slice(0, assistantIndex);
  const lastUser = [...preceding].reverse().find((message) => message.role === "user");
  if (!lastUser) return [];

  return buildChatPayloadUntilUser(preceding, lastUser.id);
}

export function findThinkingMessageId(messages: ChatMessageEntity[]) {
  return messages.find(
    (message) =>
      message.assistantStatus === "thinking" || message.assistantStatus === "retrying"
  )?.id;
}
