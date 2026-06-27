"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AudioPlaybackResult = {
  played: boolean;
  needsManualPlay: boolean;
};

export function useAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const revokeObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  const cleanup = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.onplay = null;
      audioRef.current.onended = null;
      audioRef.current.onerror = null;
      audioRef.current.src = "";
      audioRef.current = null;
    }

    revokeObjectUrl();
    setIsSpeaking(false);
  }, [revokeObjectUrl]);

  useEffect(() => cleanup, [cleanup]);

  const play = useCallback(
    async (blob: Blob): Promise<AudioPlaybackResult> => {
      cleanup();

      if (typeof window === "undefined") {
        return { played: false, needsManualPlay: true };
      }

      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;

      const audio = new Audio(objectUrl);
      audioRef.current = audio;

      return new Promise((resolve) => {
        let settled = false;

        const finish = (result: AudioPlaybackResult) => {
          if (settled) return;
          settled = true;

          if (audioRef.current) {
            audioRef.current.onplay = null;
            audioRef.current.onended = null;
            audioRef.current.onerror = null;
            audioRef.current.pause();
            audioRef.current.src = "";
            audioRef.current = null;
          }

          revokeObjectUrl();

          if (!result.played) {
            setIsSpeaking(false);
          }

          resolve(result);
        };

        audio.onplay = () => setIsSpeaking(true);
        audio.onended = () => {
          setIsSpeaking(false);
          finish({ played: true, needsManualPlay: false });
        };
        audio.onerror = () => finish({ played: false, needsManualPlay: true });

        audio.play().catch(() => finish({ played: false, needsManualPlay: true }));
      });
    },
    [cleanup, revokeObjectUrl]
  );

  const stop = useCallback(() => {
    cleanup();
  }, [cleanup]);

  return { play, stop, isSpeaking, cleanup };
}
