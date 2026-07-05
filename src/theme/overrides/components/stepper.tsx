import { Theme } from "@mui/material/styles";
import { stepConnectorClasses } from "@mui/material/StepConnector";
import { stepIconClasses } from "@mui/material/StepIcon";

export function stepper(theme: Theme) {
  return {
    MuiStepConnector: {
      styleOverrides: {
        line: {
          borderColor: theme.palette.divider,
          borderTopWidth: 3,
          borderRadius: 100,
        },
        root: {
          [`&.${stepConnectorClasses.active}`]: {
            [`& .${stepConnectorClasses.line}`]: {
              borderColor: theme.palette.primary.main,
            },
          },
          [`&.${stepConnectorClasses.completed}`]: {
            [`& .${stepConnectorClasses.line}`]: {
              borderColor: theme.palette.primary.main,
            },
          },
        },
      },
    },
    MuiStepIcon: {
      styleOverrides: {
        root: {
          width: 36,
          height: 36,
          color: theme.palette.background.surfaceContainerHigh,
          transition:
            "color 250ms cubic-bezier(0.05, 0.7, 0.1, 1), transform 250ms cubic-bezier(0.34, 1.4, 0.64, 1)",
          [`&.${stepIconClasses.active}`]: {
            color: theme.palette.primary.main,
            transform: "scale(1.1)",
          },
          [`&.${stepIconClasses.completed}`]: {
            color: theme.palette.primary.main,
          },
        },
        text: {
          fontWeight: 800,
          fontSize: 14,
        },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: {
          fontWeight: 600,
          "&.Mui-active": { fontWeight: 800, color: theme.palette.text.primary },
          "&.Mui-completed": { fontWeight: 700 },
        },
      },
    },
  };
}
