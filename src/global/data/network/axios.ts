import axios, { AxiosResponse } from "axios";
import { enqueueSnackbar } from "notistack";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "";

const api = axios.create({
  baseURL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

function redirectToLogin() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.location.pathname.startsWith("/login")) {
    return;
  }

  const redirect = encodeURIComponent(
    `${window.location.pathname}${window.location.search}`
  );
  window.location.href = `/login?redirect=${redirect}`;
}

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
      redirectToLogin();
    } else {
      const subscriptionCode = error.response?.data?.data?.code;
      const isSubscriptionError =
        subscriptionCode === "QUOTA_EXCEEDED" || subscriptionCode === "FEATURE_LOCKED";

      if (!isSubscriptionError && error.message?.toLowerCase() !== "network error") {
        enqueueSnackbar(message, { variant: "error" });
      }
    }

    return Promise.reject(error);
  }
);

export default api;
