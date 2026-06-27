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
import Button from "@mui/material/Button";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import FlagRoundedIcon from "@mui/icons-material/FlagRounded";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import ObjectiveCard from "@/features/learning/presentation/components/ObjectiveCard";
import EndSessionDialog from "@/features/learning/presentation/components/EndSessionDialog";
import { useEndSession } from "@/features/learning/presentation/controller/learning.controller";
import { useGetMe } from "@/features/auth/presentation/controller/auth.controller";
import { buildRecordingFormData } from "../../domain/utils/buildRecordingFormData";
import type { VoiceRecording, VoiceUiState } from "../../domain/constants/speech";
import {
  getPersonality,
  type PersonalityId,
} from "../../domain/constants/personalities";
import {
  useChat,
  useGetConversationDetail,
} from "../controller/conversation.controller";
import { useSynthesize, useTranscribe } from "../controller/speech.controller";
import type { ChatMessageEntity, ChatRole } from "../../domain/entities/chat-message.entity";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import ChatInputBar from "./ChatInputBar";
import ChatMessageBubble from "./ChatMessageBubble";
import MicPermissionDialog from "./MicPermissionDialog";
import SessionContextBar from "@/features/learning/presentation/components/SessionContextBar";
import SessionGoalChecklist from "@/features/learning/presentation/components/SessionGoalChecklist";
import { formatDifficultyLabel, getTutorName } from "@/features/learning/domain/constants/characters";
import HistoryDrawer from "./HistoryDrawer";

const FLOATING_INPUT_CLEARANCE = 88;

function createMessage(
  role: ChatMessageEntity["role"],
  content: string,
  extras?: Pick<ChatMessageEntity, "speechAudioText" | "needsManualPlay">
): ChatMessageEntity {
  return {
    id: crypto.randomUUID(),
    role,
    content,
    createdAt: new Date().toISOString(),
    ...extras,
  };
}

function resolvePersonalityId(value?: string | null): PersonalityId {
  if (value === "santai" || value === "semangat" || value === "teliti" || value === "bebas") {
    return value;
  }

  return "santai";
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
  const synthesize = useSynthesize();
  const audioPlayer = useAudioPlayer();
  const bottomRef = useRef<HTMLDivElement>(null);

  const [input, setInput] = useState("");
  const endSession = useEndSession();
  const { data: detail, isLoading: isDetailLoading } = useGetConversationDetail(conversationId || "");
  const sessionPersonality = getPersonality(resolvePersonalityId(detail?.personality));

  const [messages, setMessages] = useState<ChatMessageEntity[]>([]);
  const messagesRef = useRef(messages);
  const [isMockMode, setIsMockMode] = useState<boolean | null>(null);
  const [voiceUiState, setVoiceUiState] = useState<VoiceUiState>("idle");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEndSessionOpen, setIsEndSessionOpen] = useState(false);

  useEffect(() => {
    if (!conversationId && !isAuthLoading && !isAuthError) {
      const params = new URLSearchParams();
      if (queryCharacter) params.set("character", queryCharacter);
      if (queryPersonality) params.set("personality", queryPersonality);
      const suffix = params.toString() ? `?${params.toString()}` : "";
      router.replace(`/practice${suffix}`);
    }
  }, [conversationId, isAuthLoading, isAuthError, queryCharacter, queryPersonality, router]);

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
        const characterName = getTutorName(detail.characterId);
        setMessages([
          createMessage(
            "assistant",
            `Hi! I'm ${characterName}. Let's practice ${detail.scenarioLabel.toLowerCase()} together. Your goal: ${detail.objective}`
          ),
        ]);
      } else {
        setMessages(mappedMessages);
      }
    }
  }, [detail]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handlePlaySpeech = useCallback(
    async (text: string) => {
      try {
        setVoiceError(null);
        setVoiceUiState("speaking");
        const result = await synthesize.mutateAsync({
          text,
          conversationId: conversationId || undefined,
          language: sessionPersonality.sttLanguage,
        });
        const playback = await audioPlayer.play(result.blob);

        if (!playback.played && playback.needsManualPlay) {
          enqueueSnackbar("Audio tidak bisa diputar otomatis. Ketuk Putar respons.", {
            variant: "info",
          });
        }

        setVoiceUiState("idle");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memutar audio respons";
        enqueueSnackbar(message, { variant: "error" });
        setVoiceUiState("error");
        setVoiceError(message);
      }
    },
    [audioPlayer, conversationId, sessionPersonality.sttLanguage, synthesize]
  );

  const handleSend = useCallback(
    async (textOverride?: string, options?: { fromVoice?: boolean }) => {
      const text = (textOverride ?? input).trim();
      if (!text || chat.isPending) return;

      const userMessage = createMessage("user", text);
      const pendingMessages = [...messagesRef.current, userMessage];

      if (!options?.fromVoice) {
        setMessages(pendingMessages);
        setInput("");
      }

      try {
        const result = await chat.mutateAsync({
          messages: pendingMessages
            .filter((m) => m.role !== "system")
            .map((m) => ({
              role: m.role as "user" | "assistant",
              content: m.content,
            })),
          model: sessionPersonality.model,
          conversationId: conversationId || undefined,
        });

        setIsMockMode(result.mock);

        let reply = result.content;

        const bracketMatch = text.match(/\[([^|]+)\|([^\]]+)\]/);
        if (bracketMatch && result.mock && !options?.fromVoice) {
          reply += `\n\nBagus! Contoh koreksi: Kamu menulis [${bracketMatch[1]}|${bracketMatch[2]}] — seharusnya "${bracketMatch[2]}".`;
        }

        let needsManualPlay = false;
        let speechAudioText: string | undefined;

        if (options?.fromVoice) {
          setVoiceUiState("speaking");
          try {
            const synthesis = await synthesize.mutateAsync({
              text: reply,
              conversationId: conversationId || undefined,
              language: sessionPersonality.sttLanguage,
            });
            setIsMockMode((prev) => prev ?? synthesis.mock);
            const playback = await audioPlayer.play(synthesis.blob);
            needsManualPlay = playback.needsManualPlay;
            speechAudioText = reply;

            if (!playback.played && playback.needsManualPlay) {
              enqueueSnackbar("Respons siap. Ketuk Putar respons untuk mendengarkan.", {
                variant: "info",
              });
            }
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "Gagal menghasilkan audio respons";
            enqueueSnackbar(message, { variant: "error" });
            setVoiceUiState("error");
            setVoiceError(message);
            speechAudioText = reply;
            needsManualPlay = true;
          } finally {
            setVoiceUiState((current) => (current === "error" ? "error" : "idle"));
          }
        }

        const assistantMessage = createMessage("assistant", reply, {
          speechAudioText,
          needsManualPlay: speechAudioText ? needsManualPlay : undefined,
        });

        setMessages((prev) =>
          options?.fromVoice
            ? [...prev, userMessage, assistantMessage]
            : [...prev, assistantMessage]
        );
        setTimeout(scrollToBottom, 100);
      } catch {
        if (!options?.fromVoice) {
          setMessages((prev) => prev.slice(0, -1));
          setInput(text);
        }
        if (options?.fromVoice) {
          setVoiceUiState("error");
          setVoiceError("Gagal mendapatkan respons AI");
          enqueueSnackbar("Gagal mendapatkan respons AI. Percakapan tidak disimpan.", {
            variant: "error",
          });
        }
      }
    },
    [audioPlayer, chat, conversationId, input, sessionPersonality, scrollToBottom, synthesize]
  );

  const handleVoicePipeline = useCallback(
    async (recording: VoiceRecording) => {
      if (
        transcribe.isPending ||
        chat.isPending ||
        synthesize.isPending ||
        voiceUiState === "speaking"
      ) {
        return;
      }

      try {
        setVoiceError(null);
        setVoiceUiState("uploading");

        const formData = buildRecordingFormData(recording, {
          language: sessionPersonality.sttLanguage,
          conversationId: conversationId || "",
        });

        const result = await transcribe.mutateAsync(formData);
        const transcript = (result.text ?? result.transcript).trim();

        if (!transcript) {
          setVoiceUiState("error");
          setVoiceError("Transkripsi kosong");
          enqueueSnackbar("Transkripsi kosong. Coba bicara lebih jelas.", {
            variant: "warning",
          });
          return;
        }

        setIsMockMode(result.mock);
        setVoiceUiState("processing");
        await handleSend(transcript, { fromVoice: true });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Gagal memproses suara";
        setVoiceUiState("error");
        setVoiceError(message);
        enqueueSnackbar(message, { variant: "error" });
      }
    },
    [
      chat.isPending,
      conversationId,
      handleSend,
      sessionPersonality.sttLanguage,
      synthesize.isPending,
      transcribe,
      voiceUiState,
    ]
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
    (voiceUiState !== "idle" && voiceUiState !== "error") ||
    recorder.status !== "idle" ||
    transcribe.isPending ||
    chat.isPending ||
    synthesize.isPending ||
    audioPlayer.isSpeaking;

  const statusChip = (() => {
    if (voiceUiState === "error" && voiceError) {
      return { label: voiceError, color: "error" as const };
    }

    if (recorder.status === "recording" || voiceUiState === "recording") {
      return {
        label: "Merekam... ketuk mic untuk selesai",
        color: "error" as const,
      };
    }

    if (recorder.status === "processing" || voiceUiState === "uploading") {
      return { label: "Mengunggah audio...", color: "secondary" as const };
    }

    if (transcribe.isPending) {
      return { label: "Menyalin suara...", color: "secondary" as const };
    }

    if (chat.isPending || voiceUiState === "processing") {
      return {
        label: `${sessionPersonality.emoji} memproses respons...`,
        color: "primary" as const,
      };
    }

    if (synthesize.isPending || voiceUiState === "speaking" || audioPlayer.isSpeaking) {
      return { label: "Memutar respons AI...", color: "info" as const };
    }

    return null;
  })();

  const handleSelectConversation = (id: string) => {
    setIsHistoryOpen(false);
    router.push(`/conversation?id=${id}`);
  };

  const handleOpenEndSession = useCallback(() => {
    const hasUserMessages =
      messages.some((message) => message.role === "user") ||
      (detail?.messages.some((message) => message.role === "USER") ?? false);

    if (!hasUserMessages) {
      enqueueSnackbar("Kirim minimal satu pesan sebelum mengakhiri sesi.", {
        variant: "info",
      });
      return;
    }

    setIsEndSessionOpen(true);
  }, [detail?.messages, messages]);

  const handleEndSession = useCallback(() => {
    if (!conversationId) return;

    endSession.mutate(conversationId, {
      onSuccess: () => {
        setIsEndSessionOpen(false);
        router.push(`/practice/summary?id=${conversationId}`);
      },
      onError: () => {
        enqueueSnackbar("Gagal mengakhiri sesi latihan", { variant: "error" });
      },
    });
  }, [conversationId, endSession, router]);

  if (isAuthLoading || !conversationId || (conversationId && isDetailLoading)) {
    return <LoadingTips label="Menyiapkan sesi latihan..." />;
  }

  const isSessionCompleted = detail?.status === "COMPLETED";
  const characterName = detail ? getTutorName(detail.characterId) : "Tutor";

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
          <Typography variant="h5">Latihan</Typography>
          <Stack direction="row" spacing={0.5}>
            {!isSessionCompleted && (
              <IconButton
                aria-label="Akhiri sesi"
                onClick={handleOpenEndSession}
                disabled={isVoiceBusy}
              >
                <FlagRoundedIcon />
              </IconButton>
            )}
            <IconButton onClick={() => setIsHistoryOpen(true)}>
              <HistoryRoundedIcon />
            </IconButton>
          </Stack>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
          Latihan roleplay dengan umpan balik dari tutor AI
        </Typography>

        {isMockMode && (
          <Alert severity="info" sx={{ borderRadius: 2, mb: 1.5 }}>
            Mode latihan — sebagian layanan masih mock (AI/STT/TTS)
          </Alert>
        )}

        {detail && (
          <Box sx={{ mb: 1.5 }}>
            <ObjectiveCard
              scenarioLabel={detail.scenarioLabel}
              scenarioCategory={detail.scenarioCategory}
              difficultyLabel={formatDifficultyLabel(detail.difficulty)}
              objective={detail.objective}
              characterName={characterName}
            />
          </Box>
        )}

        {isSessionCompleted && (
          <Alert
            severity="success"
            sx={{ borderRadius: 2, mb: 1.5 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => router.push(`/practice/summary?id=${conversationId}`)}
              >
                Lihat Ringkasan
              </Button>
            }
          >
            Sesi selesai. Buka ringkasan belajar untuk melihat hasil latihanmu.
          </Alert>
        )}

        {detail && detail.sessionGoals?.length > 0 && !isSessionCompleted && (
          <Box sx={{ mb: 1.5 }}>
            <SessionGoalChecklist goals={detail.sessionGoals} compact />
          </Box>
        )}

        {detail && (
          <Box sx={{ mb: 1.5 }}>
            <SessionContextBar
              characterId={detail.characterId}
              personality={detail.personality}
              scenarioLabel={detail.scenarioLabel}
              difficulty={detail.difficulty}
            />
          </Box>
        )}
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
              personalityEmoji={sessionPersonality.emoji}
              onPlaySpeech={handlePlaySpeech}
              isSpeechPlaying={audioPlayer.isSpeaking || synthesize.isPending}
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
        disabled={isVoiceBusy || isSessionCompleted}
        isSending={chat.isPending}
        recordingStatus={recorder.status}
        onMicToggle={() => void recorder.toggleRecording()}
        isMicDisabled={(isVoiceBusy && recorder.status !== "recording") || isSessionCompleted}
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

      <EndSessionDialog
        open={isEndSessionOpen}
        loading={endSession.isPending}
        onClose={() => setIsEndSessionOpen(false)}
        onConfirm={handleEndSession}
      />
    </Box>
  );
}
