export function select() {
  return {
    MuiSelect: {
      styleOverrides: {
        select: {
          minHeight: 48,
          display: "flex",
          alignItems: "center",
          fontWeight: 600,
        },
        icon: {
          right: 14,
          width: 20,
          height: 20,
          top: "calc(50% - 10px)",
        },
      },
    },
    MuiNativeSelect: {
      styleOverrides: {
        select: {
          minHeight: 48,
          fontWeight: 600,
        },
        icon: {
          right: 14,
          width: 20,
          height: 20,
          top: "calc(50% - 10px)",
        },
      },
    },
  };
}
