import { memo, forwardRef } from "react";

import Box from "@mui/material/Box";

import SimpleBar, { Props } from "simplebar-react";
import { SxProps, Theme, alpha, styled } from "@mui/material/styles";

// ----------------------------------------------------------------------

export const StyledRootScrollbar = styled("div")(() => ({
  flexGrow: 1,
  height: "100%",
  overflow: "auto",
}));

export const StyledScrollbar = styled(SimpleBar)(({ theme }) => ({
  maxHeight: "100%",
  "& .simplebar-scrollbar": {
    "&:before": {
      backgroundColor: alpha(theme.palette.grey[600], 0.48),
    },
    "&.simplebar-visible:before": {
      opacity: 1,
    },
  },
  "& .simplebar-mask": {
    zIndex: "inherit",
  },
  "& .simplebar-placeholder": {
    display: "none",
  },
}));

interface ScrollbarProps extends Props {
  children?: React.ReactNode;
  sx?: SxProps<Theme>;
}

const Scrollbar = forwardRef<HTMLDivElement, ScrollbarProps>(
  ({ children, sx, ...other }, ref) => {
    const userAgent =
      typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

    const mobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );

    if (mobile) {
      return (
        <Box ref={ref} sx={{ overflow: "auto", ...sx }} {...other}>
          {children}
        </Box>
      );
    }

    return (
      <StyledRootScrollbar>
        <StyledScrollbar
          scrollableNodeProps={{
            ref,
          }}
          clickOnTrack={false}
          sx={sx}
          {...other}
        >
          {children}
        </StyledScrollbar>
      </StyledRootScrollbar>
    );
  }
);

export default memo(Scrollbar);
