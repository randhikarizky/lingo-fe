import { alpha, Theme } from "@mui/material/styles";
import { dividerClasses } from "@mui/material/Divider";
import { checkboxClasses } from "@mui/material/Checkbox";
import { menuItemClasses } from "@mui/material/MenuItem";
import { autocompleteClasses } from "@mui/material/Autocomplete";

import { m3Interactive, m3SurfaceEnter, M3_DURATION, M3_EASING } from "./motion";

export const paper = ({
  theme,
  bgcolor,
  dropdown,
}: {
  theme: Theme;
  bgcolor?: string;
  dropdown?: boolean;
}) => ({
  backgroundImage: "none",
  backgroundColor: bgcolor ?? theme.palette.background.paper,
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: "none",
  ...(dropdown && {
    padding: theme.spacing(1),
    borderRadius: 20,
    ...m3SurfaceEnter(),
  }),
});

export const menuItem = (theme: Theme) => ({
  ...theme.typography.body2,
  fontWeight: 600,
  minHeight: 48,
  padding: theme.spacing(1.25, 1.5),
  borderRadius: 12,
  ...m3Interactive(theme, 0.98),
  "&:not(:last-of-type)": {
    marginBottom: 4,
  },
  [`&.${menuItemClasses.selected}`]: {
    fontWeight: 700,
    color: theme.palette.primary.onTonalContainer ?? theme.palette.primary.dark,
    backgroundColor:
      theme.palette.primary.tonalContainer ??
      alpha(theme.palette.primary.main, 0.12),
    "&:hover": {
      backgroundColor:
        theme.palette.primary.tonalContainer ??
        alpha(theme.palette.primary.main, 0.16),
    },
  },
  "&:hover": {
    backgroundColor: theme.palette.background.surfaceContainerHigh,
  },
  [`& .${checkboxClasses.root}`]: {
    padding: theme.spacing(0.5),
    marginLeft: theme.spacing(-0.5),
    marginRight: theme.spacing(0.5),
  },
  [`&.${autocompleteClasses.option}[aria-selected="true"]`]: {
    fontWeight: 700,
    color: theme.palette.primary.onTonalContainer ?? theme.palette.primary.dark,
    backgroundColor:
      theme.palette.primary.tonalContainer ??
      alpha(theme.palette.primary.main, 0.12),
    "&:hover": {
      backgroundColor: theme.palette.background.surfaceContainerHigh,
    },
  },
  [`&+.${dividerClasses.root}`]: {
    margin: theme.spacing(0.5, 0),
  },
});

type BgBlurProps = {
  blur?: number;
  opacity?: number;
  color?: string;
  imgUrl?: string;
};

export function bgBlur(props?: BgBlurProps) {
  const color = props?.color || "#000000";
  const blur = props?.blur || 6;
  const opacity = props?.opacity || 0.8;
  const imgUrl = props?.imgUrl;

  if (imgUrl) {
    return {
      position: "relative",
      backgroundImage: `url(${imgUrl})`,
      "&:before": {
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 9,
        content: '""',
        width: "100%",
        height: "100%",
        backdropFilter: `blur(${blur}px)`,
        WebkitBackdropFilter: `blur(${blur}px)`,
        backgroundColor: alpha(color, opacity),
      },
    } as const;
  }

  return {
    backdropFilter: `blur(${blur}px)`,
    WebkitBackdropFilter: `blur(${blur}px)`,
    backgroundColor: alpha(color, opacity),
  };
}

type BgGradientProps = {
  direction?: string;
  color?: string;
  startColor?: string;
  endColor?: string;
  imgUrl?: string;
};

export function bgGradient(props?: BgGradientProps) {
  const direction = props?.direction || "to bottom";
  const startColor = props?.startColor;
  const endColor = props?.endColor;
  const imgUrl = props?.imgUrl;
  const color = props?.color;

  if (imgUrl) {
    return {
      background: `linear-gradient(${direction}, ${startColor || color}, ${
        endColor || color
      }), url(${imgUrl})`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center center",
    };
  }

  return {
    background: `linear-gradient(${direction}, ${startColor}, ${endColor})`,
  };
}

export function textGradient(value: string) {
  return {
    background: `-webkit-linear-gradient(${value})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  };
}

export const hideScroll = {
  x: {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    overflowX: "scroll",
    "&::-webkit-scrollbar": { display: "none" },
  },
  y: {
    msOverflowStyle: "none",
    scrollbarWidth: "none",
    overflowY: "scroll",
    "&::-webkit-scrollbar": { display: "none" },
  },
} as const;

export const m3DialogTransition = {
  timeout: { enter: M3_DURATION.enter, exit: M3_DURATION.exit },
  easing: {
    enter: M3_EASING.emphasizedDecelerate,
    exit: M3_EASING.emphasizedAccelerate,
  },
};
