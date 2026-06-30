import axios from "axios";

export function getLoginErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string" && message.length > 0) {
      return message;
    }
  }

  return "Email atau kata sandi salah. Coba lagi.";
}
