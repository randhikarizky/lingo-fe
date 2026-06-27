import { useMutation } from "@tanstack/react-query";

import { speechService } from "../../data/repositories/speech.repository.impl";
import { SynthesizeRequest } from "../../data/response/transcribe.response";

export const useTranscribe = () =>
  useMutation({
    mutationFn: (formData: FormData) => speechService.transcribe(formData),
  });

export const useSynthesize = () =>
  useMutation({
    mutationFn: (request: SynthesizeRequest) => speechService.synthesize(request),
  });
