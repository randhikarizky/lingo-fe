/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import { useGetMe } from "@/features/auth/presentation/controller/auth.controller";
import { buildRecordingFormData } from "../../domain/utils/buildRecordingFormData";
import { extractCorrectionText } from "../../domain/utils/extractCorrectionText";
import type { VoiceRecording } from "../../domain/constants/speech";
import {
  getPersonality,
  type PersonalityId,
} from "../../domain/constants/personalities";
import {
  useChat,
  useCreateConversation,
  useGetConversationDetail,
} from "../controller/conversation.controller";
import { useTranscribe } from "../controller/speech.controller";
import type { ChatMessageEntity, ChatRole } from "../../domain/entities/chat-message.entity";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useCorrectionTts } from "../hooks/useCorrectionTts";
import ChatInputBar from "./ChatInputBar";
import ChatMessageBubble from "./ChatMessageBubble";
import MicPermissionDialog from "./MicPermissionDialog";
import PersonalityPicker from "./PersonalityPicker";
import HistoryDrawer from "./HistoryDrawer";

const FLOATING_INPUT_CLEARANCE = 88;

function createMessage(
  role: ChatMessageEntity["role"],
  content: string,
  extras?: Pick<ChatMessageEntity, "correctionAudioText" | "needsManualPlay">
): ChatMessageEntity {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
    ...extras,
  };
}

export default function ConversationComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const conversationId = searchParams.get("id");
  const queryPersonality = searchParams.get("personality") as PersonalityId | null;
  const queryCharacter = searchParams.get("character");

  const { isError: isAuthError, isLoading: isAuthLoading } = useGetMe();
  const chat = useChat();
  const transcribe = useTranscribe();
  const correctionTts = useCorrectionTts();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const [personalityId, setPersonalityId] = useState<PersonalityId>("santai");
  const personality = getPersonality(personalityId);

  const [messages, setMessages] = useState<ChatMessageEntity[]>([
    createMessage(
      "assistant",
      "Hai! Aku teman belajarmu. Ketuk mic untuk latihan speaking, atau ketik: I [go|went] to school yesterday — aku akan koreksi dengan coretan merah & hijau 💬"
    ),
  ]);
  const messagesRef = useRef(messages);
  const [isMockMode, setIsMockMode] = useState<boolean | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const createConversation = useCreateConversation();
  const { data: detail, isLoading: isDetailLoading } = useGetConversationDetail(conversationId || "");

  // Create new conversation on mount if no ID is present
  useEffect(() => {
    if (!conversationId && !isAuthLoading && !isAuthError && !createConversation.isPending) {
      const pId = queryPersonality || "santai";
      const characterMap: Record<string, string> = {
        santai: "maya",
        bebas: "alex",
        semangat: "sora",
        teliti: "ken",
      };
      const characterId = queryCharacter || characterMap[pId] || "maya";

      createConversation.mutate(
        {
          characterId,
          personality: pId,
          language: "en",
        },
        {
          onSuccess: (data) => {
            router.replace(`/conversation?id=${data.id}`);
          },
        }
      );
    }
  }, [conversationId, isAuthLoading, isAuthError, queryPersonality, queryCharacter, createConversation, router]);

  // Restore messages when conversation details are loaded
  useEffect(() => {
    if (detail) {
      const mappedMessages: ChatMessageEntity[] = detail.messages.map((m) => ({
        id: m.id,
        role: m.role.toLowerCase() as ChatRole,
        content: m.content,
        createdAt: m.createdAt,
      }));

      if (mappedMessages.length === 0) {
        const characterMap: Record<string, string> = {
          maya: "santai",
          alex: "bebas",
          sora: "semangat",
          ken: "teliti",
        };
        const pId = (detail.personality as PersonalityId) || characterMap[detail.characterId] || "santai";
        setPersonalityId(pId);
        setMessages([
          createMessage(
            "assistant",
            `Hai! Aku ${detail.characterId.charAt(0).toUpperCase() + detail.characterId.slice(1)}, teman belajarmu. Ketuk mic untuk latihan speaking, atau ketik: I [go|went] to school yesterday — aku akan koreksi dengan coretan merah & hijau 💬`
          ),
        ]);
      } else {
        setMessages(mappedMessages);
        const characterMap: Record<string, string> = {
          maya: "santai",
          alex: "bebas",
          sora: "semangat",
          ken: "teliti",
        };
        const pId = (detail.personality as PersonalityId) || characterMap[detail.characterId] || "santai";
        setPersonalityId(pId);
      }
    }
  }, [detail]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handlePlayCorrection = useCallback(
    async (text: string, locale: string) => {
      const result = await correctionTts.speak(text, locale);

      if (!result.played && result.needsManualPlay) {
        enqueueSnackbar("Audio tidak bisa diputar otomatis. Ketuk tombol putar lagi.", {
          variant: "info",
        });
      }
    },
    [correctionTts]
  );

  const handleSend = useCallback(
    async (textOverride?: string, options?: { fromVoice?: boolean }) => {
      const text = (textOverride ?? input).trim();
      if (!text || chat.isPending) return;

      const userMessage = createMessage("user", text);
      const nextMessages = [...messagesRef.current, userMessage];

      setMessages(nextMessages);
      if (!textOverride) {
        setInput("");
      }

      try {
        const result = await chat.mutateAsync({
          messages: [
            { role: "system", content: personality.systemPrompt },
            ...nextMessages
              .filter((m) => m.role !== "system")
              .map((m) => ({
                role: m.role as "user" | "assistant",
                content: m.content,
              })),
          ],
          model: personality.model,
          conversationId: conversationId || undefined,
        });

        setIsMockMode(result.mock);

        let reply = result.content;

        const bracketMatch = text.match(/\[([^|]+)\|([^\]]+)\]/);
        if (bracketMatch && result.mock && !options?.fromVoice) {
          reply += `\n\nBagus! Contoh koreksi: Kamu menulis [${bracketMatch[1]}|${bracketMatch[2]}] — seharusnya "${bracketMatch[2]}".`;
        }

        const correctionAudioText = options?.fromVoice
          ? extractCorrectionText(reply)
          : null;

        let needsManualPlay = false;

        if (correctionAudioText && options?.fromVoice) {
          const ttsResult = await correctionTts.speak(
            correctionAudioText,
            personality.speechLocale
          );
          needsManualPlay = ttsResult.needsManualPlay;
        }

        const assistantMessage = createMessage("assistant", reply, {
          correctionAudioText: correctionAudioText ?? undefined,
          needsManualPlay: correctionAudioText ? needsManualPlay : undefined,
        });

        setMessages((prev) => [...prev, assistantMessage]);
        setTimeout(scrollToBottom, 100);
      } catch {
        setMessages((prev) => prev.slice(0, -1));
        if (!textOverride) {
          setInput(text);
        }
      }
    },
    [chat, correctionTts, input, personality, scrollToBottom, conversationId]
  );

  const handleVoicePipeline = useCallback(
    async (recording: VoiceRecording) => {
      if (transcribe.isPending || chat.isPending) {
        return;
      }

      try {
        const formData = buildRecordingFormData(recording, {
          language: personality.sttLanguage,
          conversationId: conversationId || "",
        });

        const result = await transcribe.mutateAsync(formData);
        const transcript = result.transcript.trim();

        if (!transcript) {
          enqueueSnackbar("Transkripsi kosong. Coba bicara lebih jelas.", {
            variant: "warning",
          });
          return;
        }

        await handleSend(transcript, { fromVoice: true });
      } catch {
        // Error snackbar ditangani axios interceptor.
      }
    },
    [chat.isPending, handleSend, personality.sttLanguage, transcribe, conversationId]
  );

  const voicePipelineRef = useRef(handleVoicePipeline);

  useEffect(() => {
    voicePipelineRef.current = handleVoicePipeline;
  }, [handleVoicePipeline]);

  const recorder = useAudioRecorder({
    onRecordingComplete: (recording) => {
      void voicePipelineRef.current(recording);
    },
  });

  useEffect(() => {
    if (!isAuthLoading && isAuthError) {
      router.replace("/login");
    }
  }, [isAuthError, isAuthLoading, router]);

  const isVoiceBusy =
    recorder.status !== "idle" || transcribe.isPending || chat.isPending;

  const statusChip = (() => {
    if (recorder.status === "recording") {
      return {
        label: "Merekam... ketuk mic untuk selesai",
        color: "error" as const,
      };
    }

    if (recorder.status === "processing") {
      return { label: "Memproses rekaman...", color: "default" as const };
    }

    if (transcribe.isPending) {
      return { label: "Menyalin suara...", color: "secondary" as const };
    }

    if (chat.isPending) {
      return {
        label: `${personality.emoji} memikirkan respons...`,
        color: "primary" as const,
      };
    }

    return null;
  })();

  const handleSelectConversation = (id: string) => {
    setIsHistoryOpen(false);
    router.push(`/conversation?id=${id}`);
  };

  if (isAuthLoading || (conversationId && isDetailLoading) || createConversation.isPending) {
    return <LoadingTips label="Menghubungkan ke teman ngobrol..." />;
  }

  return (
    <Box
      sx={{
        mx: -2,
        mt: -2,
        mb: -2,
        height: "calc(100vh - 72px)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        bgcolor: "background.default",
      }}
    >
      <Box sx={{ px: 2, pt: 2, pb: 1.5, flexShrink: 0 }}>
        <Stack direction="row" sx={{ justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
          <Typography variant="h5">Ngobrol</Typography>
          <IconButton onClick={() => setIsHistoryOpen(true)}>
            <HistoryRoundedIcon />
          </IconButton>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Latihan bahasa dengan koreksi ramah
        </Typography>

        {isMockMode && (
          <Alert severity="info" sx={{ borderRadius: 2, mb: 1.5 }}>
            Mode latihan — respons AI & STT dummy aktif
          </Alert>
        )}

        <PersonalityPicker
          value={personalityId}
          onChange={setPersonalityId}
          disabled={isVoiceBusy}
        />
      </Box>

      <Box
        sx={(theme) => ({
          flex: 1,
          overflowY: "auto",
          px: 2,
          pt: 1,
          pb: `${FLOATING_INPUT_CLEARANCE}px`,
          minHeight: 0,
          backgroundColor: theme.palette.background.paper,
          borderTopLeftRadius: Number(theme.shape.borderRadius) || 24,
          borderTopRightRadius: Number(theme.shape.borderRadius) || 24,
        })}
      >
        <Stack spacing={1.5} sx={{ pt: 1 }}>
          {messages.map((message) => (
            <ChatMessageBubble
              key={message.id}
              message={message}
              personalityEmoji={personality.emoji}
              speechLocale={personality.speechLocale}
              onPlayCorrection={handlePlayCorrection}
            />
          ))}
          {statusChip && (
            <Chip
              label={statusChip.label}
              size="small"
              variant="soft"
              color={statusChip.color}
              sx={{
                alignSelf:
                  statusChip.color === "primary" ? "flex-start" : "center",
                ml: statusChip.color === "primary" ? 5 : 0,
              }}
            />
          )}
          <div ref={bottomRef} />
        </Stack>
      </Box>

      <ChatInputBar
        value={input}
        onChange={setInput}
        onSend={() => void handleSend()}
        disabled={isVoiceBusy}
        isSending={chat.isPending}
        recordingStatus={recorder.status}
        onMicToggle={() => void recorder.toggleRecording()}
        isMicDisabled={isVoiceBusy && recorder.status !== "recording"}
      />

      <MicPermissionDialog
        open={recorder.permissionDenied}
        onClose={recorder.dismissPermissionDenied}
        onRetry={() => {
          recorder.dismissPermissionDenied();
          void recorder.toggleRecording();
        }}
      />

      <HistoryDrawer
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        activeId={conversationId}
        onSelect={handleSelectConversation}
      />
    </Box>
  );
}
