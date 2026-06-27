export type TranscribeResponse = {
  text: string;
  transcript: string;
  mock: boolean;
  message: string;
};

export type SynthesizeRequest = {
  text: string;
  conversationId?: string;
  language?: string;
  voice?: string;
};

export type SynthesizeResponse = {
  blob: Blob;
  mock: boolean;
};
