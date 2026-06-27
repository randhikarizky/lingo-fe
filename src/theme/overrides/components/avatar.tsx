import { AvatarProps } from "@mui/material/Avatar";
import { alpha, Theme } from "@mui/material/styles";
import { AvatarGroupProps, avatarGroupClasses } from "@mui/material/AvatarGroup";
import { m3Transition } from "../../motion";

const COLORS = ["default", "primary", "secondary", "info", "success", "warning", "error"] as const;

const colorByName = (name: string) => {
  const charAt = name.charAt(0).toLowerCase();
  if (["a", "c", "f"].includes(charAt)) return "primary";
  if (["e", "d", "h"].includes(charAt)) return "secondary";
  if (["i", "k", "l"].includes(charAt)) return "info";
  if (["m", "n", "p"].includes(charAt)) return "success";
  if (["q", "s", "t"].includes(charAt)) return "warning";
  if (["v", "x", "y"].includes(charAt)) return "error";
  return "default";
};

declare module "@mui/material/AvatarGroup" {
  interface AvatarGroupPropsVariantOverrides {
    compact: true;
  }
}

export function avatar(theme: Theme) {
  return {
    MuiAvatar: {
      variants: COLORS.map((color) =>
        color === "default"
          ? {
              props: { color: "default" },
              style: {
                color: theme.palette.text.secondary,
                fontWeight: 800,
                backgroundColor: theme.palette.background.surfaceContainerHigh,
              },
            }
          : {
              props: { color },
              style: {
                color:
                  theme.palette[color].onTonalContainer ??
                  theme.palette[color].contrastText,
                fontWeight: 800,
                backgroundColor:
                  theme.palette[color].tonalContainer ??
                  theme.palette[color].main,
              },
            }
      ),
      styleOverrides: {
        root: {
          transition: m3Transition(theme, ["transform", "box-shadow"]),
          "&:hover": { transform: "scale(1.05)" },
        },
        rounded: {
          borderRadius: 16,
        },
        colorDefault: ({ ownerState }: { ownerState: AvatarProps }) => {
          const color = colorByName(`${ownerState.alt}`);
          return {
            ...(!!ownerState.alt && {
              ...(color !== "default"
                ? {
                    color:
                      theme.palette[color].onTonalContainer ??
                      theme.palette[color].contrastText,
                    backgroundColor:
                      theme.palette[color].tonalContainer ??
                      theme.palette[color].main,
                  }
                : {
                    color: theme.palette.text.secondary,
                    backgroundColor: theme.palette.background.surfaceContainerHigh,
                  }),
            }),
          };
        },
      },
    },
    MuiAvatarGroup: {
      styleOverrides: {
        root: ({ ownerState }: { ownerState: AvatarGroupProps }) => ({
          justifyContent: "flex-end",
          ...(ownerState.variant === "compact" && {
            width: 48,
            height: 48,
            position: "relative",
            [`& .${avatarGroupClasses.avatar}`]: {
              margin: 0,
              width: 32,
              height: 32,
              position: "absolute",
              "&:first-of-type": { left: 0, bottom: 0, zIndex: 9 },
              "&:last-of-type": { top: 0, right: 0 },
            },
          }),
        }),
        avatar: {
          fontSize: 16,
          fontWeight: 800,
          border: `2px solid ${theme.palette.background.default}`,
          "&:first-of-type": {
            fontSize: 12,
            color: theme.palette.primary.onTonalContainer ?? theme.palette.primary.dark,
            backgroundColor:
              theme.palette.primary.tonalContainer ?? theme.palette.primary.lighter,
          },
        },
      },
    },
  };
}
