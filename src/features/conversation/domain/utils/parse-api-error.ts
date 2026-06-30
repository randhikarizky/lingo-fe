import axios from "axios";

import type { ApiErrorCode } from "../constants/message-status";

export type ParsedApiError = {
  message: string;
  errorCode?: ApiErrorCode;
  requestId?: string;
  isNetwork: boolean;
  httpStatus?: number;
};

const STATUS_MESSAGES: Record<number, string> = {
  400: "Permintaan tidak valid.",
  401: "Silakan login kembali.",
  403: "Upgrade diperlukan.",
  408: "Permintaan melebihi batas waktu.",
  429: "Terlalu banyak permintaan.",
  500: "Gangguan server.",
  503: "AI sedang tidak tersedia.",
  504: "Permintaan melebihi batas waktu.",
};

const CODE_MESSAGES: Partial<Record<ApiErrorCode, string>> = {
  AI_PROVIDER_ERROR: "Gangguan layanan AI. Coba lagi sebentar.",
  VOICE_PROVIDER_ERROR: "Gangguan layanan suara. Coba lagi sebentar.",
  NETWORK_TIMEOUT: "Koneksi timeout. Periksa jaringanmu.",
  SERVICE_UNAVAILABLE: "Layanan sedang tidak tersedia.",
  SERVER_ERROR: "Gangguan server.",
};

export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError(error)) {
    const httpStatus = error.response?.status;
    const body = error.response?.data as
      | { message?: string; data?: { errorCode?: ApiErrorCode; requestId?: string } }
      | undefined;
    const errorCode = body?.data?.errorCode;
    const requestId = body?.data?.requestId;
    const isNetwork = !error.response || error.code === "ERR_NETWORK";

    const message =
      (errorCode && CODE_MESSAGES[errorCode]) ||
      body?.message ||
      (httpStatus && STATUS_MESSAGES[httpStatus]) ||
      (isNetwork ? "Koneksi ke server sedang bermasalah." : "Terjadi kesalahan.");

    return { message, errorCode, requestId, isNetwork, httpStatus };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      isNetwork: error.message.toLowerCase().includes("network"),
    };
  }

  return { message: "Terjadi kesalahan.", isNetwork: false };
}
