const LINE_HEIGHT_PX = 24;

/**
 * Radius dari tinggi container — bukan 9999px.
 * Satu baris: setengah tinggi (= pill). Multiline: mengecil hingga rounded rect.
 */
export function getChatInputBorderRadius(
  height: number,
  minHeight = 52,
  maxRows = 4
): number {
  const maxHeight = minHeight + (maxRows - 1) * LINE_HEIGHT_PX;

  if (height <= minHeight + 2) {
    return minHeight / 2;
  }

  const progress = Math.min(1, (height - minHeight) / (maxHeight - minHeight));
  const maxRadius = 20;
  const minRadius = 12;
  const radius = maxRadius - progress * (maxRadius - minRadius);

  return Math.min(Math.round(radius), Math.floor(height * 0.28));
}

/** Sembunyikan scrollbar, scroll touch tetap aktif (mobile-first). */
export const hideScrollbarStyles = {
  msOverflowStyle: "none",
  scrollbarWidth: "none",
  "&::-webkit-scrollbar": {
    display: "none",
    width: 0,
    height: 0,
  },
} as const;
