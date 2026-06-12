import api from "@/global/data/network/axios";
import { BaseResponse } from "@/global/data/response/base.response";
import { TranscribeResponse } from "../response/transcribe.response";

export const speechApi = {
  transcribe: (formData: FormData) =>
    api.post<BaseResponse<TranscribeResponse>>(
      "/api/v1/speech/transcribe",
      formData,
      {
        headers: { "Content-Type": false as unknown as string },
      }
    ),
};
