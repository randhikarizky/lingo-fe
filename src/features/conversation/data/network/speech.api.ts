import api from "@/global/data/network/axios";
import { BaseResponse } from "@/global/data/response/base.response";
import {
  SynthesizeRequest,
  SynthesizeResponse,
  TranscribeResponse,
} from "../response/transcribe.response";

export const speechApi = {
  transcribe: (formData: FormData) =>
    api.post<BaseResponse<TranscribeResponse>>(
      "/api/v1/speech/transcribe",
      formData,
      {
        headers: { "Content-Type": false as unknown as string },
      }
    ),

  synthesize: async (request: SynthesizeRequest): Promise<SynthesizeResponse> => {
    const response = await fetch("/api/v1/speech/synthesize", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/mpeg, audio/*",
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      let message = "Gagal menghasilkan audio";

      try {
        const payload = (await response.json()) as { message?: string };
        message = payload.message ?? message;
      } catch {
        // Response bukan JSON
      }

      throw new Error(message);
    }

    const blob = await response.blob();

    return {
      blob,
      mock: response.headers.get("X-Voice-Mock") === "true",
    };
  },
};
