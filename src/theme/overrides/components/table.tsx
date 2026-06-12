import { Theme, alpha } from "@mui/material/styles";
import { tableRowClasses } from "@mui/material/TableRow";
import { tableCellClasses } from "@mui/material/TableCell";
import { m3Transition } from "../../motion";

export function table(theme: Theme) {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          position: "relative",
          borderRadius: 20,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: m3Transition(theme, "background-color"),
          "&:hover": {
            backgroundColor: theme.palette.background.surfaceContainer,
          },
          [`&.${tableRowClasses.selected}`]: {
            backgroundColor:
              theme.palette.primary.tonalContainer ??
              alpha(theme.palette.primary.main, 0.08),
            "&:hover": {
              backgroundColor:
                theme.palette.primary.tonalContainer ??
                alpha(theme.palette.primary.main, 0.12),
            },
          },
          "&:last-of-type": {
            [`& .${tableCellClasses.root}`]: { borderColor: "transparent" },
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${theme.palette.divider}`,
          padding: theme.spacing(1.75, 2),
        },
        head: {
          fontSize: 14,
          color: theme.palette.text.secondary,
          fontWeight: 800,
          backgroundColor: theme.palette.background.surfaceContainer,
          borderBottom: `2px solid ${theme.palette.divider}`,
        },
        stickyHeader: {
          backgroundColor: theme.palette.background.surfaceContainer,
        },
        paddingCheckbox: {
          paddingLeft: theme.spacing(1),
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: { width: "100%" },
        toolbar: { minHeight: 64 },
        actions: { marginRight: 8 },
        select: {
          paddingLeft: 8,
          borderRadius: 12,
          "&:focus": { borderRadius: 12 },
        },
        selectIcon: {
          right: 4,
          width: 18,
          height: 18,
          top: "calc(50% - 9px)",
        },
      },
    },
  };
}
