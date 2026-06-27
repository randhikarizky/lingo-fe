import { speechApi } from "../network/speech.api";
import { SynthesizeRequest } from "../response/transcribe.response";

class SpeechRepositoryImpl {
  async transcribe(formData: FormData) {
    const { data } = await speechApi.transcribe(formData);
    return data.data;
  }

  async synthesize(request: SynthesizeRequest) {
    return speechApi.synthesize(request);
  }
}

export const speechService = new SpeechRepositoryImpl();
