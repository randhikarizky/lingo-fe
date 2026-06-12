import { Nunito } from "next/font/google";

export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

declare module "@mui/material/styles" {
  interface TypographyVariants {
    fontSecondaryFamily: React.CSSProperties["fontFamily"];
    fontWeightSemiBold: React.CSSProperties["fontWeight"];
  }
}

export const primaryFont = Nunito({
  weight: ["500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Quicksand", "Helvetica", "Arial", "sans-serif"],
});

export const typography = {
  fontFamily: primaryFont.style.fontFamily,
  fontSecondaryFamily: primaryFont.style.fontFamily,
  fontWeightRegular: 500,
  fontWeightMedium: 600,
  fontWeightSemiBold: 700,
  fontWeightBold: 800,
  h1: {
    fontWeight: 900,
    lineHeight: 1.15,
    fontSize: pxToRem(40),
    letterSpacing: "-0.02em",
  },
  h2: {
    fontWeight: 800,
    lineHeight: 1.2,
    fontSize: pxToRem(32),
    letterSpacing: "-0.015em",
  },
  h3: {
    fontWeight: 800,
    lineHeight: 1.25,
    fontSize: pxToRem(26),
  },
  h4: {
    fontWeight: 700,
    lineHeight: 1.3,
    fontSize: pxToRem(20),
  },
  h5: {
    fontWeight: 700,
    lineHeight: 1.35,
    fontSize: pxToRem(18),
  },
  h6: {
    fontWeight: 700,
    lineHeight: 1.4,
    fontSize: pxToRem(16),
  },
  subtitle1: {
    fontWeight: 700,
    lineHeight: 1.45,
    fontSize: pxToRem(16),
  },
  subtitle2: {
    fontWeight: 600,
    lineHeight: 1.45,
    fontSize: pxToRem(14),
  },
  body1: {
    fontWeight: 600,
    lineHeight: 1.55,
    fontSize: pxToRem(17),
    letterSpacing: "0.006em",
  },
  body2: {
    fontWeight: 500,
    lineHeight: 1.5,
    fontSize: pxToRem(15),
  },
  caption: {
    fontWeight: 500,
    lineHeight: 1.45,
    fontSize: pxToRem(12),
  },
  overline: {
    fontWeight: 800,
    lineHeight: 1.4,
    fontSize: pxToRem(11),
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
  },
  button: {
    fontWeight: 800,
    lineHeight: 1.2,
    fontSize: pxToRem(16),
    textTransform: "none" as const,
    letterSpacing: "0.01em",
  },
} as const;
