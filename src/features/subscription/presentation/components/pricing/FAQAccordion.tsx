"use client";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";

import { FAQ_ITEMS } from "../../utils/pricing.utils";
import { FAQ_BOTTOM_SPACING, PRICING_RADIUS } from "./pricing.tokens";

export default function FAQAccordion() {
  return (
    <Card
      sx={{
        borderRadius: `${PRICING_RADIUS.section}px`,
        overflow: "hidden",
        mb: `${FAQ_BOTTOM_SPACING}px`,
      }}
    >
      <Typography variant="subtitle1" sx={{ fontWeight: 900, p: 2.5, pb: 1.5 }}>
        FAQ
      </Typography>
      {FAQ_ITEMS.map((item, index) => (
        <Accordion
          key={item.question}
          disableGutters
          elevation={0}
          sx={{
            "&::before": { display: "none" },
            borderTop: index === 0 ? "none" : "1px solid",
            borderColor: "divider",
            transition: "background-color 0.2s ease",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreRoundedIcon />}
            sx={{
              minHeight: 52,
              "& .MuiAccordionSummary-content": { my: 1.25 },
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 800 }}>
              {item.question}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ pt: 0, pb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.55 }}>
              {item.answer}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Card>
  );
}
