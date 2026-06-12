"use client";

import Box from "@mui/material/Box";
import Typography, { TypographyProps } from "@mui/material/Typography";

type Props = TypographyProps & {
  content: string;
};

/**
 * Supports:
 * 1. HTML: <del>wrong</del> <ins>correct</ins>
 * 2. Pattern: [wrong|correct]
 */
function parseCorrectionContent(content: string) {
  if (/<del>|<ins>|\[.+?\|.+?\]/.test(content)) {
    const html = content.replace(
      /\[([^|]+)\|([^\]]+)\]/g,
      '<del style="color:#FF3B30;text-decoration:line-through">$1</del> <ins style="color:#14B862;text-decoration:none;font-weight:700">$2</ins>'
    );

    return { __html: html };
  }

  return null;
}

export default function InlineCorrectionText({ content, ...typographyProps }: Props) {
  const parsed = parseCorrectionContent(content);

  if (parsed) {
    return (
      <Box
        component="span"
        sx={{ "& del": { color: "error.main" }, "& ins": { color: "success.main", textDecoration: "none", fontWeight: 600 } }}
      >
        <Typography
          component="span"
          {...typographyProps}
          dangerouslySetInnerHTML={parsed}
        />
      </Box>
    );
  }

  return (
    <Typography component="span" {...typographyProps}>
      {content}
    </Typography>
  );
}
