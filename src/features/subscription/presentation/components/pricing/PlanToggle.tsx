"use client";

import Box from "@mui/material/Box";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { m } from "framer-motion";

import type { BillingPeriod } from "../../utils/pricing.utils";
import { PRICING_RADIUS, pricingToggleGroupSx } from "./pricing.tokens";

type Props = {
  value: BillingPeriod;
  onChange: (value: BillingPeriod) => void;
};

export default function PlanToggle({ value, onChange }: Props) {
  return (
    <ToggleButtonGroup
      exclusive
      fullWidth
      value={value}
      onChange={(_, next: BillingPeriod | null) => {
        if (next) onChange(next);
      }}
      sx={pricingToggleGroupSx}
    >
      {(["monthly", "lifetime"] as const).map((option) => (
        <ToggleButton key={option} value={option} sx={{ position: "relative", overflow: "hidden" }}>
          {value === option && (
            <Box
              component={m.span}
              layoutId="pricing-plan-toggle-indicator"
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              sx={{
                position: "absolute",
                inset: 0,
                borderRadius: `${PRICING_RADIUS.item}px`,
                bgcolor: "background.paper",
                boxShadow: 1,
                zIndex: 0,
              }}
            />
          )}
          <Box component="span" sx={{ position: "relative", zIndex: 1, fontWeight: 700 }}>
            {option === "monthly" ? "Bulanan" : "Seumur Hidup"}
          </Box>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
