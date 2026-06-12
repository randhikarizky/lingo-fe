import { speechApi } from "../network/speech.api";

class SpeechRepositoryImpl {
  async transcribe(formData: FormData) {
    const { data } = await speechApi.transcribe(formData);
    return data.data;
  }
}

export const speechService = new SpeechRepositoryImpl();
