"use client";

import { useCallback, useEffect, useRef } from "react";

export type CorrectionTtsResult = {
  played: boolean;
  needsManualPlay: boolean;
};

function getSpeechSynthesis() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.speechSynthesis ?? null;
}

function waitForVoices(synthesis: SpeechSynthesis, timeoutMs = 1200) {
  return new Promise<SpeechSynthesisVoice[]>((resolve) => {
    const existing = synthesis.getVoices();

    if (existing.length > 0) {
      resolve(existing);
      return;
    }

    let settled = false;

    const finish = (voices: SpeechSynthesisVoice[]) => {
      if (settled) return;
      settled = true;
      synthesis.removeEventListener("voiceschanged", onVoicesChanged);
      resolve(voices);
    };

    const onVoicesChanged = () => {
      finish(synthesis.getVoices());
    };

    synthesis.addEventListener("voiceschanged", onVoicesChanged);

    window.setTimeout(() => {
      finish(synthesis.getVoices());
    }, timeoutMs);
  });
}

function pickVoice(voices: SpeechSynthesisVoice[], locale: string) {
  const normalized = locale.toLowerCase();
  const languagePrefix = normalized.split("-")[0];

  return (
    voices.find((voice) => voice.lang.toLowerCase() === normalized) ??
    voices.find((voice) => voice.lang.toLowerCase().startsWith(languagePrefix)) ??
    null
  );
}

export function useCorrectionTts() {
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const synthesis = getSpeechSynthesis();
    if (!synthesis) return;

    void waitForVoices(synthesis).then((voices) => {
      voicesRef.current = voices;
    });

    return () => {
      synthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    async (text: string, locale: string): Promise<CorrectionTtsResult> => {
      const synthesis = getSpeechSynthesis();

      if (!synthesis || !text.trim()) {
        return { played: false, needsManualPlay: false };
      }

      if (voicesRef.current.length === 0) {
        voicesRef.current = await waitForVoices(synthesis);
      }

      return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text.trim());
        utterance.lang = locale;

        const voice = pickVoice(voicesRef.current, locale);
        if (voice) {
          utterance.voice = voice;
        }

        let settled = false;

        const finish = (result: CorrectionTtsResult) => {
          if (settled) return;
          settled = true;
          resolve(result);
        };

        let started = false;

        utterance.onstart = () => {
          started = true;
          finish({ played: true, needsManualPlay: false });
        };

        utterance.onerror = () => {
          finish({ played: false, needsManualPlay: true });
        };

        synthesis.cancel();
        synthesis.speak(utterance);

        window.setTimeout(() => {
          if (!started && !synthesis.speaking && !synthesis.pending) {
            finish({ played: false, needsManualPlay: true });
          }
        }, 700);
      });
    },
    []
  );

  const cancel = useCallback(() => {
    getSpeechSynthesis()?.cancel();
  }, []);

  return { speak, cancel };
}
