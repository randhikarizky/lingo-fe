import { listClasses } from "@mui/material/List";
import { paperClasses } from "@mui/material/Paper";
import { Theme, alpha } from "@mui/material/styles";
import { buttonClasses } from "@mui/material/Button";
import { listItemIconClasses } from "@mui/material/ListItemIcon";
import { tablePaginationClasses } from "@mui/material/TablePagination";

import { paper } from "../../css";

export function dataGrid(theme: Theme) {
  const paperStyles = paper({ theme, dropdown: true });

  return {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "none",
          backgroundColor: theme.palette.background.paper,
          [`& .${tablePaginationClasses.root}`]: { borderTop: 0 },
          [`& .${tablePaginationClasses.toolbar}`]: { height: "auto" },
        },
        cell: {
          borderBottom: `1px solid ${theme.palette.divider}`,
          fontWeight: 500,
        },
        selectedRowCount: { whiteSpace: "nowrap", fontWeight: 700 },
        columnSeparator: { color: theme.palette.divider },
        toolbarContainer: {
          padding: theme.spacing(2),
          borderBottom: `1px solid ${theme.palette.divider}`,
          backgroundColor: theme.palette.background.surfaceContainer,
          borderRadius: "20px 20px 0 0",
        },
        paper: { ...paperStyles, padding: 0 },
        menu: {
          [`& .${paperClasses.root}`]: { ...paperStyles },
          [`& .${listClasses.root}`]: {
            padding: 0,
            [`& .${listItemIconClasses.root}`]: {
              minWidth: 0,
              marginRight: theme.spacing(2),
            },
          },
        },
        columnHeaders: {
          borderRadius: 0,
          backgroundColor: theme.palette.background.surfaceContainer,
          fontWeight: 800,
        },
        panelHeader: { padding: theme.spacing(2), fontWeight: 800 },
        panelFooter: {
          padding: theme.spacing(2),
          justifyContent: "flex-end",
          borderTop: `1px solid ${theme.palette.divider}`,
          [`& .${buttonClasses.root}`]: {
            "&:first-of-type": {
              border: `solid 1.5px ${alpha(theme.palette.grey[500], 0.2)}`,
            },
            "&:last-of-type": {
              marginLeft: theme.spacing(1.5),
            },
          },
        },
        filterForm: { padding: theme.spacing(2) },
        filterFormValueInput: { marginLeft: theme.spacing(2) },
        filterFormColumnInput: { marginLeft: theme.spacing(2) },
        filterFormOperatorInput: { marginLeft: theme.spacing(2) },
      },
    },
  };
}
