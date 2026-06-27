"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  MAX_RECORDING_MS,
  MIN_RECORDING_MS,
  RECORDING_MIME_TYPES,
  type RecordingStatus,
  type VoiceRecording,
} from "../../domain/constants/speech";

export type { VoiceRecording };

type UseAudioRecorderOptions = {
  onRecordingComplete?: (recording: VoiceRecording) => void;
  onPermissionDenied?: () => void;
};

function getSupportedMimeType() {
  if (typeof MediaRecorder === "undefined") {
    return undefined;
  }

  for (const mimeType of RECORDING_MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(mimeType)) {
      return mimeType;
    }
  }

  return undefined;
}

function isPermissionDeniedError(error: unknown) {
  if (!(error instanceof DOMException)) {
    return false;
  }

  return (
    error.name === "NotAllowedError" ||
    error.name === "PermissionDeniedError" ||
    error.name === "SecurityError"
  );
}

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const { onRecordingComplete, onPermissionDenied } = options;

  const [status, setStatus] = useState<RecordingStatus>("idle");
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [lastRecording, setLastRecording] = useState<VoiceRecording | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const mimeTypeRef = useRef<string>("audio/webm");
  const startedAtRef = useRef<number>(0);
  const maxDurationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cleanupStream = useCallback(() => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
    mediaStreamRef.current = null;
  }, []);

  const clearMaxDurationTimer = useCallback(() => {
    if (maxDurationTimerRef.current) {
      clearTimeout(maxDurationTimerRef.current);
      maxDurationTimerRef.current = null;
    }
  }, []);

  const resetRecorder = useCallback(() => {
    clearMaxDurationTimer();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    cleanupStream();
  }, [cleanupStream, clearMaxDurationTimer]);

  const stopRecording = useCallback(async () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === "inactive") {
      resetRecorder();
      setStatus("idle");
      return;
    }

    const elapsedMs = Date.now() - startedAtRef.current;

    if (elapsedMs < MIN_RECORDING_MS) {
      recorder.stop();
      resetRecorder();
      setStatus("idle");
      return;
    }

    setStatus("processing");

    await new Promise<void>((resolve) => {
      recorder.addEventListener(
        "stop",
        () => {
          const blob = new Blob(chunksRef.current, { type: mimeTypeRef.current });
          const recording: VoiceRecording = {
            blob,
            mimeType: mimeTypeRef.current,
            durationMs: elapsedMs,
          };

          setLastRecording(recording);
          onRecordingComplete?.(recording);

          if (process.env.NODE_ENV === "development") {
            console.debug("[voice] recording ready", {
              bytes: blob.size,
              mimeType: recording.mimeType,
              durationMs: recording.durationMs,
            });
          }

          resetRecorder();
          setStatus("idle");
          resolve();
        },
        { once: true }
      );

      recorder.stop();
    });
  }, [onRecordingComplete, resetRecorder]);

  const startRecording = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setPermissionDenied(true);
      onPermissionDenied?.();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);

      mimeTypeRef.current = recorder.mimeType || mimeType || "audio/webm";
      mediaStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      startedAtRef.current = Date.now();

      recorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      });

      recorder.start(250);
      setStatus("recording");
      setPermissionDenied(false);

      clearMaxDurationTimer();
      maxDurationTimerRef.current = setTimeout(() => {
        void stopRecording();
      }, MAX_RECORDING_MS);
    } catch (error) {
      resetRecorder();
      setStatus("idle");

      if (isPermissionDeniedError(error)) {
        setPermissionDenied(true);
        onPermissionDenied?.();
        return;
      }

      throw error;
    }
  }, [clearMaxDurationTimer, onPermissionDenied, resetRecorder, stopRecording]);

  const toggleRecording = useCallback(async () => {
    if (status === "processing") {
      return;
    }

    if (status === "recording") {
      await stopRecording();
      return;
    }

    await startRecording();
  }, [startRecording, status, stopRecording]);

  const dismissPermissionDenied = useCallback(() => {
    setPermissionDenied(false);
  }, []);

  useEffect(() => {
    return () => {
      const recorder = mediaRecorderRef.current;

      if (recorder && recorder.state !== "inactive") {
        recorder.stop();
      }

      resetRecorder();
    };
  }, [resetRecorder]);

  return {
    status,
    toggleRecording,
    permissionDenied,
    dismissPermissionDenied,
    lastRecording,
  };
}
