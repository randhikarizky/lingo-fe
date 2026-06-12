import { Theme } from "@mui/material/styles";
import { accordionClasses } from "@mui/material/Accordion";
import { typographyClasses } from "@mui/material/Typography";
import { accordionSummaryClasses } from "@mui/material/AccordionSummary";
import { m3Interactive, m3Transition } from "../../motion";

export function accordion(theme: Theme) {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          boxShadow: "none",
          borderRadius: 20,
          overflow: "hidden",
          "&:before": { display: "none" },
          [`&.${accordionClasses.expanded}`]: {
            boxShadow: "none",
            borderRadius: 20,
            backgroundColor: theme.palette.background.surfaceContainer,
            margin: theme.spacing(1, 0),
          },
          [`&.${accordionClasses.disabled}`]: {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          minHeight: 56,
          paddingLeft: theme.spacing(2),
          paddingRight: theme.spacing(1.5),
          borderRadius: 20,
          ...m3Interactive(theme, 0.99),
          [`&.${accordionSummaryClasses.expanded}`]: {
            minHeight: 56,
          },
          [`&.${accordionSummaryClasses.disabled}`]: {
            opacity: 1,
            color: theme.palette.action.disabled,
            [`& .${typographyClasses.root}`]: { color: "inherit" },
          },
        },
        content: {
          margin: theme.spacing(1.25, 0),
          fontWeight: 700,
          [`&.${accordionSummaryClasses.expanded}`]: {
            margin: theme.spacing(1.25, 0),
          },
        },
        expandIconWrapper: {
          color: "inherit",
          transition: m3Transition(theme, "transform"),
          [`&.${accordionSummaryClasses.expanded}`]: {
            transform: "rotate(180deg)",
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: theme.spacing(0, 2, 2),
        },
      },
    },
  };
}
