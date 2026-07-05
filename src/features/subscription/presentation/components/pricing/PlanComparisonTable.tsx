"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { alpha, useTheme } from "@mui/material/styles";

import type { PlanId } from "../../../domain/entities/subscription.entity";
import { COMPARISON_ROWS, getPlanDisplayLabel } from "../../utils/pricing.utils";
import { PRICING_RADIUS } from "./pricing.tokens";

type Props = {
  currentPlan: PlanId;
};

const PLAN_COLUMNS: PlanId[] = ["FREE", "STARTER", "PRO", "LIFETIME"];

export default function PlanComparisonTable({ currentPlan }: Props) {
  const theme = useTheme();

  return (
    <Card sx={{ borderRadius: `${PRICING_RADIUS.section}px`, overflow: "hidden" }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 900, p: 2.5, pb: 1.5 }}>
        Bandingkan Paket
      </Typography>

      <Box
        sx={{
          overflowX: "auto",
          pb: 1,
          "&::-webkit-scrollbar": { height: 6 },
          "&::-webkit-scrollbar-thumb": {
            bgcolor: "divider",
            borderRadius: 3,
          },
        }}
      >
        <Box
          component="table"
          sx={{
            width: "100%",
            minWidth: 520,
            borderCollapse: "collapse",
            fontSize: "0.8125rem",
          }}
        >
          <thead>
            <tr>
              <Box
                component="th"
                sx={{ textAlign: "left", p: 1.5, pl: 2.5, minWidth: 120 }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontWeight: 800 }}
                >
                  Fitur
                </Typography>
              </Box>
              {PLAN_COLUMNS.map((planId) => {
                const isActive = planId === currentPlan;
                return (
                  <Box
                    component="th"
                    key={planId}
                    sx={{
                      p: 1.5,
                      minWidth: 88,
                      bgcolor: isActive
                        ? alpha(theme.palette.primary.main, 0.12)
                        : "transparent",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        fontWeight: 900,
                        color: isActive ? "primary.main" : "text.primary",
                      }}
                    >
                      {getPlanDisplayLabel(planId)}
                    </Typography>
                  </Box>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature}>
                <Box
                  component="td"
                  sx={{
                    p: 1.5,
                    pl: 2.5,
                    fontWeight: 700,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  {row.feature}
                </Box>
                {PLAN_COLUMNS.map((planId) => {
                  const value = row[planId.toLowerCase() as keyof typeof row];
                  const isActive = planId === currentPlan;
                  return (
                    <Box
                      component="td"
                      key={planId}
                      sx={{
                        p: 1.5,
                        textAlign: "center",
                        fontWeight: isActive ? 800 : 600,
                        color: isActive ? "primary.main" : "text.secondary",
                        bgcolor: isActive
                          ? alpha(theme.palette.primary.main, 0.06)
                          : "transparent",
                        borderBottom: "1px solid",
                        borderColor: "divider",
                        transition: "background-color 0.2s ease",
                      }}
                    >
                      {value}
                    </Box>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Card>
  );
}
