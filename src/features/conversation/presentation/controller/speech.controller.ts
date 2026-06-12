import { useMutation } from "@tanstack/react-query";

import { speechService } from "../../data/repositories/speech.repository.impl";

export const useTranscribe = () =>
  useMutation({
    mutationFn: (formData: FormData) => speechService.transcribe(formData),
  });
