export function extractCorrectionText(content: string): string | null {
  const bracketMatches = [...content.matchAll(/\[([^|]+)\|([^\]]+)\]/g)];

  if (bracketMatches.length > 0) {
    return bracketMatches.map((match) => match[2].trim()).join(". ");
  }

  const insMatches = [...content.matchAll(/<ins[^>]*>([^<]+)<\/ins>/gi)];

  if (insMatches.length > 0) {
    return insMatches.map((match) => match[1].trim()).join(". ");
  }

  return null;
}
