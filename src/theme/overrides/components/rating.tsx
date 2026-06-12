import { alpha, Theme } from "@mui/material/styles";
import { ratingClasses } from "@mui/material/Rating";
import { svgIconClasses } from "@mui/material/SvgIcon";
import { m3Transition } from "../../motion";

export function rating(theme: Theme) {
  return {
    MuiRating: {
      styleOverrides: {
        root: {
          gap: 4,
          [`&.${ratingClasses.disabled}`]: { opacity: 0.48 },
          [`& .${ratingClasses.iconFilled}`]: {
            color: theme.palette.warning.main,
          },
          [`& .${svgIconClasses.root}`]: {
            transition: m3Transition(theme, "transform"),
          },
          [`& .${ratingClasses.iconHover}`]: {
            transform: "scale(1.2)",
          },
          [`& .${ratingClasses.iconActive}`]: {
            transform: "scale(1.35)",
            animation: "m3ExpressivePop 250ms cubic-bezier(0.34, 1.56, 0.64, 1)",
          },
        },
        iconEmpty: {
          color: alpha(theme.palette.grey[500], 0.32),
        },
        sizeSmall: {
          [`& .${svgIconClasses.root}`]: { width: 22, height: 22 },
        },
        sizeMedium: {
          [`& .${svgIconClasses.root}`]: { width: 28, height: 28 },
        },
        sizeLarge: {
          [`& .${svgIconClasses.root}`]: { width: 36, height: 36 },
        },
      },
    },
  };
}
