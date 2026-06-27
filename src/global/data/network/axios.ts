import axios, { AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";

// Kosongkan NEXT_PUBLIC_API_URL untuk pakai proxy Next.js (same-origin, tanpa CORS)
const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Terjadi kesalahan pada server";

    if (error.response?.status === 401) {
      enqueueSnackbar("Sesi berakhir, silakan login kembali", {
        variant: "warning",
      });
    } else if (error.message?.toLowerCase() !== "network error") {
      enqueueSnackbar(message, { variant: "error" });
    }

    return Promise.reject(error);
  }
);

export default api;
