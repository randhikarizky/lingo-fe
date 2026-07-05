/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import EndSessionDialog from "@/features/learning/presentation/components/EndSessionDialog";
import PracticeHeader from "@/features/learning/presentation/components/PracticeHeader";
import FocusSessionShell from "@/features/learning/presentation/components/FocusSessionShell";
import LearningBottomSheet, {
  LEARNING_SHEET_COLLAPSED_HEIGHT,
} from "@/features/learning/presentation/components/LearningBottomSheet";
import SessionGoalsCelebrationOverlay from "@/features/learning/presentation/components/SessionGoalsCelebrationOverlay";
import { useSessionGoalProgress } from "@/features/learning/presentation/hooks/useSessionGoalProgress";
import { useEndSession } from "@/features/learning/presentation/controller/learning.controller";
import { useGetMe } from "@/features/auth/presentation/controller/auth.controller";
import { buildRecordingFormData } from "../../domain/utils/buildRecordingFormData";
import type { VoiceRecording, VoiceUiState } from "../../domain/constants/speech";
import { getPersonality, type PersonalityId } from "../../domain/constants/personalities";
import { useChat, useGetConversationDetail } from "../controller/conversation.controller";
import { useSynthesize, useTranscribe } from "../controller/speech.controller";
import type {
  ChatMessageEntity,
  ChatRole,
} from "../../domain/entities/chat-message.entity";
import { ASSISTANT_FAILED_COPY } from "../../domain/constants/message-status";
import {
  buildChatPayloadBeforeAssistant,
  buildChatPayloadMessages,
} from "../../domain/utils/build-chat-payload";
import { parseApiError } from "../../domain/utils/parse-api-error";
import { useConnectionMonitor } from "../hooks/useConnectionMonitor";
import { useAudioRecorder } from "../hooks/useAudioRecorder";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import ChatInputBar from "./ChatInputBar";
import ChatMessageBubble from "./ChatMessageBubble";
import ConnectionBanner from "./ConnectionBanner";
import VoiceStatusOverlay from "./VoiceStatusOverlay";
import MicPermissionDialog from "./MicPermissionDialog";
import {
  formatDifficultyLabel,
  getTutorName,
} from "@/features/learning/domain/constants/characters";
import HistoryDrawer from "./HistoryDrawer";
import LockedFeatureDialog from "@/features/subscription/presentation/components/LockedFeatureDialog";
import { parseSubscriptionError } from "@/features/subscription/domain/utils/parse-subscription-error";
import {
  PRACTICE_FOCUS_TIMING,
  focusChatAreaVariants,
  focusInputVariants,
  focusSessionContainerVariants,
  focusSessionItemVariants,
} from "@/theme/animate/practice-session";

const FLOATING_INPUT_CLEARANCE = 100;

function getEstimatedMinutes(difficulty: string) {
  switch (difficulty) {
    case "intermediate":
      return 15;
    case "advanced":
      return 20;
    default:
      return 10;
  }
}

function createMessage(
  role: ChatMessageEntity["role"],
  content: string,
  extras?: Partial<ChatMessageEntity>
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
  if (
    value === "santai" ||
    value === "semangat" ||
    value === "teliti" ||
    value === "bebas"
  ) {
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
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const [input, setInput] = useState("");
  const [isLearningPanelOpen, setIsLearningPanelOpen] = useState(false);
  const [isEnteringFocus, setIsEnteringFocus] = useState(
    () => searchParams.get("focus") === "1"
  );
  const endSession = useEndSession();
  const { data: detail, isLoading: isDetailLoading } = useGetConversationDetail(
    conversationId || ""
  );
  const sessionPersonality = getPersonality(resolvePersonalityId(detail?.personality));

  const [messages, setMessages] = useState<ChatMessageEntity[]>([]);
  const messagesRef = useRef(messages);
  const [isMockMode, setIsMockMode] = useState<boolean | null>(null);
  const [voiceUiState, setVoiceUiState] = useState<VoiceUiState>("idle");
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isEndSessionOpen, setIsEndSessionOpen] = useState(false);
  const [lockedDialog, setLockedDialog] = useState<{
    type: "quota" | "feature";
    message: string;
    requiredPlan?: string;
  } | null>(null);
  const { showBanner, reportServerIssue, clearServerIssue } = useConnectionMonitor();

  const showSubscriptionDialog = useCallback((error: unknown) => {
    const parsed = parseSubscriptionError(error);
    if (!parsed) return false;

    setLockedDialog(parsed);
    return true;
  }, []);

  useEffect(() => {
    if (!conversationId && !isAuthLoading && !isAuthError) {
      const params = new URLSearchParams();
      if (queryCharacter) params.set("character", queryCharacter);
      if (queryPersonality) params.set("personality", queryPersonality);
      const suffix = params.toString() ? `?${params.toString()}` : "";
      router.replace(`/practice${suffix}`);
    }
  }, [
    conversationId,
    isAuthLoading,
    isAuthError,
    queryCharacter,
    queryPersonality,
    router,
  ]);

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
            `Hi! I'm ${characterName}. Let's practice ${detail.scenarioLabel.toLowerCase()} together. Your goal: ${detail.objective}`,
            { assistantStatus: "completed" }
          ),
        ]);
      } else {
        setMessages(
          mappedMessages.map((message) => ({
            ...message,
            deliveryStatus: message.role === "user" ? "sent" : undefined,
            assistantStatus: message.role === "assistant" ? "completed" : undefined,
          }))
        );
      }
    }
  }, [detail]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    if (searchParams.get("focus") !== "1" || !conversationId) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("focus");
    const query = params.toString();
    router.replace(
      query ? `/conversation?${query}` : `/conversation?id=${conversationId}`,
      {
        scroll: false,
      }
    );

    const focusTimer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, PRACTICE_FOCUS_TIMING.inputFocusDelayMs);

    const animationTimer = window.setTimeout(() => {
      setIsEnteringFocus(false);
    }, PRACTICE_FOCUS_TIMING.sessionEnterMs);

    return () => {
      window.clearTimeout(focusTimer);
      window.clearTimeout(animationTimer);
    };
  }, [conversationId, router, searchParams]);

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handlePlaySpeech = useCallback(
    async (text: string, messageId: string) => {
      try {
        setVoiceError(null);
        setVoiceUiState("speaking");
        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? { ...message, speechPlaybackStatus: "idle" }
              : message
          )
        );

        const result = await synthesize.mutateAsync({
          text,
          conversationId: conversationId || undefined,
          language: sessionPersonality.sttLanguage,
        });
        const playback = await audioPlayer.play(result.blob);

        if (!playback.played && playback.needsManualPlay) {
          setMessages((prev) =>
            prev.map((message) =>
              message.id === messageId
                ? { ...message, needsManualPlay: true, speechAudioText: text }
                : message
            )
          );
        }

        setVoiceUiState("idle");
      } catch (error) {
        if (showSubscriptionDialog(error)) {
          setVoiceUiState("idle");
          return;
        }

        setMessages((prev) =>
          prev.map((message) =>
            message.id === messageId
              ? { ...message, speechPlaybackStatus: "failed", speechAudioText: text }
              : message
          )
        );
        setVoiceUiState("error");
        setVoiceError("Audio gagal diputar");
      }
    },
    [
      audioPlayer,
      conversationId,
      sessionPersonality.sttLanguage,
      showSubscriptionDialog,
      synthesize,
    ]
  );

  const requestAssistantReply = useCallback(
    async (
      payloadMessages: Array<{ role: "user" | "assistant"; content: string }>,
      context: {
        userMessageId: string;
        thinkingMessageId: string;
        fromVoice?: boolean;
        userText: string;
      }
    ) => {
      try {
        const result = await chat.mutateAsync({
          messages: payloadMessages,
          model: sessionPersonality.model,
          conversationId: conversationId || undefined,
        });

        clearServerIssue();
        setIsMockMode(result.mock);

        let reply = result.content;
        const bracketMatch = context.userText.match(/\[([^|]+)\|([^\]]+)\]/);
        if (bracketMatch && result.mock && !context.fromVoice) {
          reply += `\n\nBagus! Contoh koreksi: Kamu menulis [${bracketMatch[1]}|${bracketMatch[2]}] — seharusnya "${bracketMatch[2]}".`;
        }

        let needsManualPlay = false;
        let speechAudioText: string | undefined;

        if (context.fromVoice) {
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
          } catch (error) {
            if (!showSubscriptionDialog(error)) {
              speechAudioText = reply;
              needsManualPlay = true;
            }
          } finally {
            setVoiceUiState("idle");
          }
        }

        setMessages((prev) =>
          prev.map((message) => {
            if (message.id === context.userMessageId) {
              return { ...message, deliveryStatus: "sent" };
            }
            if (message.id === context.thinkingMessageId) {
              return {
                ...message,
                content: reply,
                assistantStatus: "completed",
                speechAudioText,
                needsManualPlay: speechAudioText ? needsManualPlay : undefined,
                speechPlaybackStatus: undefined,
              };
            }
            return message;
          })
        );
        setTimeout(scrollToBottom, 100);
      } catch (error) {
        if (showSubscriptionDialog(error)) {
          setMessages((prev) =>
            prev
              .filter((message) => message.id !== context.thinkingMessageId)
              .map((message) =>
                message.id === context.userMessageId
                  ? { ...message, deliveryStatus: "failed" }
                  : message
              )
          );
          setVoiceUiState("idle");
          return;
        }

        const parsed = parseApiError(error);
        if (parsed.isNetwork) {
          reportServerIssue(true);
        }

        setMessages((prev) =>
          prev.map((message) => {
            if (message.id === context.userMessageId) {
              return {
                ...message,
                deliveryStatus: "failed",
                errorMessage: parsed.message,
                errorCode: parsed.errorCode,
              };
            }
            if (message.id === context.thinkingMessageId) {
              return {
                ...message,
                assistantStatus: "failed",
                content: ASSISTANT_FAILED_COPY,
                errorMessage: parsed.message,
                errorCode: parsed.errorCode,
              };
            }
            return message;
          })
        );
        setVoiceUiState("idle");
      }
    },
    [
      audioPlayer,
      chat,
      clearServerIssue,
      conversationId,
      reportServerIssue,
      scrollToBottom,
      sessionPersonality,
      showSubscriptionDialog,
      synthesize,
    ]
  );

  const handleSend = useCallback(
    async (textOverride?: string, options?: { fromVoice?: boolean }) => {
      const text = (textOverride ?? input).trim();
      if (!text || chat.isPending) return;

      const userMessage = createMessage("user", text, { deliveryStatus: "sending" });
      const thinkingMessage = createMessage("assistant", "", {
        assistantStatus: "thinking",
      });

      setMessages((prev) => [...prev, userMessage, thinkingMessage]);
      if (!options?.fromVoice) {
        setInput("");
      }

      const payloadMessages = [
        ...buildChatPayloadMessages(messagesRef.current),
        { role: "user" as const, content: text },
      ];

      await requestAssistantReply(payloadMessages, {
        userMessageId: userMessage.id,
        thinkingMessageId: thinkingMessage.id,
        fromVoice: options?.fromVoice,
        userText: text,
      });
    },
    [chat.isPending, input, requestAssistantReply]
  );

  const handleRetryUserMessage = useCallback(
    async (messageId: string) => {
      const target = messagesRef.current.find((message) => message.id === messageId);
      if (!target || target.role !== "user") return;

      const thinkingMessage = createMessage("assistant", "", {
        assistantStatus: "thinking",
      });

      setMessages((prev) => {
        const index = prev.findIndex((message) => message.id === messageId);
        if (index === -1) return prev;

        const next = prev.map((message) =>
          message.id === messageId
            ? { ...message, deliveryStatus: "retrying" as const, errorMessage: undefined }
            : message
        );

        const withoutFailedAssistant = next.filter(
          (message, idx) =>
            !(
              idx === index + 1 &&
              message.role === "assistant" &&
              message.assistantStatus === "failed"
            )
        );

        const insertAt =
          withoutFailedAssistant.findIndex((message) => message.id === messageId) + 1;
        return [
          ...withoutFailedAssistant.slice(0, insertAt),
          thinkingMessage,
          ...withoutFailedAssistant.slice(insertAt),
        ];
      });

      const priorMessages = messagesRef.current.filter(
        (message) => message.id !== messageId
      );
      const payloadMessages = [
        ...buildChatPayloadMessages(priorMessages),
        { role: "user" as const, content: target.content },
      ];

      await requestAssistantReply(payloadMessages, {
        userMessageId: messageId,
        thinkingMessageId: thinkingMessage.id,
        userText: target.content,
      });
    },
    [requestAssistantReply]
  );

  const handleDeleteUserMessage = useCallback((messageId: string) => {
    setMessages((prev) => {
      const index = prev.findIndex((message) => message.id === messageId);
      if (index === -1) return prev;

      const next = [...prev];
      next.splice(index, 1);
      if (next[index]?.assistantStatus === "failed") {
        next.splice(index, 1);
      }
      return next;
    });
  }, []);

  const handleRetryAssistantMessage = useCallback(
    async (assistantMessageId: string) => {
      const payloadMessages = buildChatPayloadBeforeAssistant(
        messagesRef.current,
        assistantMessageId
      );
      if (payloadMessages.length === 0) return;

      setMessages((prev) =>
        prev.map((message) =>
          message.id === assistantMessageId
            ? {
                ...message,
                assistantStatus: "retrying",
                content: "",
                errorMessage: undefined,
              }
            : message
        )
      );

      const userMessageId =
        [...messagesRef.current]
          .slice(
            0,
            messagesRef.current.findIndex((message) => message.id === assistantMessageId)
          )
          .reverse()
          .find((message) => message.role === "user")?.id ?? "";

      await requestAssistantReply(payloadMessages, {
        userMessageId,
        thinkingMessageId: assistantMessageId,
        userText: payloadMessages[payloadMessages.length - 1]?.content ?? "",
      });
    },
    [requestAssistantReply]
  );

  const handleRetrySpeech = useCallback(
    (messageId: string, text: string) => {
      void handlePlaySpeech(text, messageId);
    },
    [handlePlaySpeech]
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
          return;
        }

        setIsMockMode(result.mock);
        setVoiceUiState("processing");
        await handleSend(transcript, { fromVoice: true });
      } catch (error) {
        if (showSubscriptionDialog(error)) {
          setVoiceUiState("idle");
          return;
        }

        const parsed = parseApiError(error);
        setVoiceUiState("error");
        setVoiceError(parsed.message);
        if (parsed.isNetwork) {
          reportServerIssue(true);
        }
      }
    },
    [
      chat.isPending,
      conversationId,
      handleSend,
      sessionPersonality.sttLanguage,
      showSubscriptionDialog,
      synthesize.isPending,
      transcribe,
      voiceUiState,
      reportServerIssue,
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
    audioPlayer.isSpeaking ||
    messages.some(
      (message) =>
        message.deliveryStatus === "sending" ||
        message.deliveryStatus === "retrying" ||
        message.assistantStatus === "thinking" ||
        message.assistantStatus === "retrying"
    );

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

  const sessionGoals = detail?.sessionGoals ?? [];
  const {
    achievedCount: achievedGoals,
    totalGoals,
    pulseKey: goalPulseKey,
    recentlyAchievedIds,
    showCelebration,
    dismissCelebration,
  } = useSessionGoalProgress(sessionGoals, conversationId);

  if (isAuthLoading || !conversationId || (conversationId && isDetailLoading)) {
    if (searchParams.get("focus") === "1" || isEnteringFocus) {
      return <FocusSessionShell />;
    }
    return <LoadingTips label="Menyiapkan sesi latihan..." />;
  }

  const isSessionCompleted = detail?.status === "COMPLETED";
  const characterName = detail ? getTutorName(detail.characterId) : "Tutor";
  const difficultyLabel = detail ? formatDifficultyLabel(detail.difficulty) : "";
  const inputBottomOffset = isLearningPanelOpen ? 0 : LEARNING_SHEET_COLLAPSED_HEIGHT;
  const chatBottomPadding = FLOATING_INPUT_CLEARANCE + inputBottomOffset;

  const showFocusStagger = isEnteringFocus;

  return (
    <Box
      component={showFocusStagger ? m.div : "div"}
      {...(showFocusStagger
        ? {
            variants: focusSessionContainerVariants,
            initial: "hidden",
            animate: "visible",
          }
        : {})}
      sx={{
        mx: -2,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        bgcolor: "background.default",
        overflow: "hidden",
      }}
    >
      <Box
        component={showFocusStagger ? m.div : "div"}
        {...(showFocusStagger ? { variants: focusSessionItemVariants } : {})}
        sx={{ px: 2, pt: 1.5, pb: 1, flexShrink: 0, maxHeight: "10vh" }}
      >
        {detail && (
          <PracticeHeader
            scenarioLabel={detail.scenarioLabel}
            tutorName={characterName}
            difficultyLabel={difficultyLabel}
            achievedGoals={achievedGoals}
            totalGoals={totalGoals}
            goalPulseKey={goalPulseKey}
            isPanelExpanded={isLearningPanelOpen}
            onExpandPanel={() => setIsLearningPanelOpen(true)}
            onEndSession={handleOpenEndSession}
            onOpenHistory={() => setIsHistoryOpen(true)}
            isSessionCompleted={isSessionCompleted}
            isVoiceBusy={isVoiceBusy}
          />
        )}

        {isMockMode && (
          <Alert severity="info" sx={{ borderRadius: 2, mt: 1, py: 0.25 }}>
            Mode latihan — sebagian layanan masih mock (AI/STT/TTS)
          </Alert>
        )}

        {isSessionCompleted && (
          <Alert
            severity="success"
            sx={{ borderRadius: 2, mt: 1, py: 0.25 }}
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
      </Box>

      <ConnectionBanner open={showBanner} />

      <Box
        component={m.div}
        variants={showFocusStagger ? focusChatAreaVariants : undefined}
        initial={showFocusStagger ? "hidden" : false}
        animate={showFocusStagger ? "visible" : undefined}
        sx={(theme) => ({
          flex: 1,
          overflowY: "auto",
          px: 2,
          pt: 1.25,
          pb: `${chatBottomPadding}px`,
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
              tutorName={characterName}
              onPlaySpeech={handlePlaySpeech}
              isSpeechPlaying={audioPlayer.isSpeaking || synthesize.isPending}
              onRetryUser={handleRetryUserMessage}
              onDeleteUser={handleDeleteUserMessage}
              onRetryAssistant={handleRetryAssistantMessage}
              onRetrySpeech={handleRetrySpeech}
            />
          ))}
          <div ref={bottomRef} />
        </Stack>
      </Box>

      {detail && (
        <LearningBottomSheet
          open={isLearningPanelOpen}
          onOpen={() => setIsLearningPanelOpen(true)}
          onClose={() => setIsLearningPanelOpen(false)}
          scenarioLabel={detail.scenarioLabel}
          scenarioCategory={detail.scenarioCategory}
          objective={detail.objective}
          tutorName={characterName}
          personalityLabel={sessionPersonality.label}
          difficultyLabel={difficultyLabel}
          estimatedMinutes={getEstimatedMinutes(detail.difficulty)}
          goals={sessionGoals}
          isEnteringFocus={showFocusStagger}
          goalPulseKey={goalPulseKey}
          recentlyAchievedGoalIds={recentlyAchievedIds}
        />
      )}

      <SessionGoalsCelebrationOverlay
        open={showCelebration && !isSessionCompleted}
        goals={sessionGoals}
        tutorName={characterName}
        onContinue={dismissCelebration}
        onEndSession={() => {
          dismissCelebration();
          handleOpenEndSession();
        }}
      />

      <Box
        component={showFocusStagger ? m.div : "div"}
        {...(showFocusStagger ? { variants: focusInputVariants } : {})}
        sx={{ position: "absolute", left: 0, right: 0, bottom: 0, pointerEvents: "auto" }}
      >
        <VoiceStatusOverlay
          recordingStatus={recorder.status}
          voiceUiState={voiceUiState}
          voiceError={voiceError}
          onRetryVoice={() => {
            setVoiceError(null);
            setVoiceUiState("idle");
            void recorder.toggleRecording();
          }}
        />
        <ChatInputBar
          value={input}
          onChange={setInput}
          onSend={() => void handleSend()}
          disabled={isVoiceBusy || isSessionCompleted}
          isSending={chat.isPending}
          recordingStatus={recorder.status}
          onMicToggle={() => void recorder.toggleRecording()}
          isMicDisabled={
            (isVoiceBusy && recorder.status !== "recording") || isSessionCompleted
          }
          bottomOffset={inputBottomOffset}
          inputRef={inputRef}
          autoFocus={false}
        />
      </Box>

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

      <LockedFeatureDialog
        open={lockedDialog !== null}
        type={lockedDialog?.type ?? "quota"}
        message={lockedDialog?.message ?? ""}
        requiredPlan={lockedDialog?.requiredPlan}
        onClose={() => setLockedDialog(null)}
        onUpgrade={() => router.push("/pricing")}
      />
    </Box>
  );
}
