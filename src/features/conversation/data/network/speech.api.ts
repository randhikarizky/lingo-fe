import api from "@/global/data/network/axios";
import axios from "axios";
import { BaseResponse } from "@/global/data/response/base.response";
import {
  SynthesizeRequest,
  SynthesizeResponse,
  TranscribeResponse,
} from "../response/transcribe.response";

async function normalizeBlobError(error: unknown) {
  if (!axios.isAxiosError(error) || !(error.response?.data instanceof Blob)) {
    return;
  }

  try {
    const payload = JSON.parse(await error.response.data.text()) as BaseResponse;
    error.response.data = payload;
  } catch {
    // Response bukan JSON
  }
}

export const speechApi = {
  transcribe: (formData: FormData) =>
    api.post<BaseResponse<TranscribeResponse>>("/api/v1/speech/transcribe", formData, {
      headers: { "Content-Type": false as unknown as string },
      silentError: true,
    }),

  synthesize: async (request: SynthesizeRequest): Promise<SynthesizeResponse> => {
    try {
      const response = await api.post<Blob>("/api/v1/speech/synthesize", request, {
        responseType: "blob",
        headers: {
          Accept: "audio/mpeg, audio/*",
        },
        silentError: true,
      });

      return {
        blob: response.data,
        mock: response.headers["x-voice-mock"] === "true",
      };
    } catch (error) {
      await normalizeBlobError(error);
      throw error;
    }
  },
};
