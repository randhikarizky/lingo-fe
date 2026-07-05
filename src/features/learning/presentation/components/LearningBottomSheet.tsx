"use client";

import { useCallback, useRef } from "react";
import { m, AnimatePresence, useDragControls, PanInfo } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import {
  PRACTICE_FOCUS_TIMING,
  focusSheetCollapsedVariants,
} from "@/theme/animate/practice-session";
import type { SessionGoal } from "../../domain/entities/learning-session.entity";
import SessionGoalChecklist from "./SessionGoalChecklist";
import MiniGoalWidget from "./MiniGoalWidget";
import ObjectiveCardCompact from "./ObjectiveCardCompact";

const COLLAPSED_HEIGHT = 52;
const EXPANDED_VH = 72;

const sheetContentVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: index * 0.05,
      duration: 0.28,
      ease: M3_MOTION_EASE.decelerate,
    },
  }),
};

type Props = {
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  scenarioLabel: string;
  scenarioCategory: string;
  objective: string;
  tutorName: string;
  personalityLabel: string;
  difficultyLabel: string;
  estimatedMinutes: number;
  goals: SessionGoal[];
  isEnteringFocus?: boolean;
  goalPulseKey?: number;
  recentlyAchievedGoalIds?: string[];
};

export default function LearningBottomSheet({
  open,
  onOpen,
  onClose,
  scenarioLabel,
  scenarioCategory,
  objective,
  tutorName,
  personalityLabel,
  difficultyLabel,
  estimatedMinutes,
  goals,
  isEnteringFocus = false,
  goalPulseKey = 0,
  recentlyAchievedGoalIds = [],
}: Props) {
  const dragControls = useDragControls();
  const achievedCount = goals.filter((goal) => goal.achieved).length;

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > 80 || info.velocity.y > 400) {
        onClose();
      }
    },
    [onClose]
  );

  const sheetRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <AnimatePresence>
        {open && (
          <Box
            component={m.div}
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: M3_MOTION_EASE.decelerate }}
            onClick={onClose}
            sx={{
              position: "fixed",
              inset: 0,
              bgcolor: "rgba(0,0,0,0.32)",
              zIndex: 1200,
            }}
          />
        )}
      </AnimatePresence>

      <Box ref={sheetRef} sx={{ flexShrink: 0, zIndex: 1201 }}>
        <AnimatePresence>
          {open && (
            <Box
              component={m.div}
              key="expanded"
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.35 }}
              onDragEnd={handleDragEnd}
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{
                y: "100%",
                transition: {
                  duration: PRACTICE_FOCUS_TIMING.sheetCollapseMs,
                  ease: M3_MOTION_EASE.accelerate,
                },
              }}
              transition={{
                duration: PRACTICE_FOCUS_TIMING.sheetExpandMs,
                ease: M3_MOTION_EASE.decelerate,
              }}
              sx={{
                position: "fixed",
                left: 0,
                right: 0,
                marginInline: "auto",
                bottom: 0,
                width: "100%",
                maxWidth: 480,
                maxHeight: `${EXPANDED_VH}vh`,
                bgcolor: "background.paper",
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                boxShadow: (theme) => theme.shadows[8],
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  pt: 1,
                  pb: 0.5,
                  display: "flex",
                  justifyContent: "center",
                  cursor: "grab",
                }}
                onPointerDown={(event) => dragControls.start(event)}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 4,
                    borderRadius: 2,
                    bgcolor: "action.disabled",
                  }}
                />
              </Box>

              <Box sx={{ px: 2, pb: 2, overflowY: "auto", flex: 1 }}>
                <Stack spacing={2}>
                  <Box
                    component={m.div}
                    custom={0}
                    variants={sheetContentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Typography variant="overline" color="text.secondary">
                      Tujuan
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                      {objective}
                    </Typography>
                  </Box>

                  {goals.length > 0 && (
                    <Box
                      component={m.div}
                      custom={1}
                      variants={sheetContentVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <SessionGoalChecklist
                        goals={goals}
                        title="Tujuan Sesi"
                        pulseKey={goalPulseKey}
                        recentlyAchievedIds={recentlyAchievedGoalIds}
                      />
                    </Box>
                  )}

                  <Box
                    component={m.div}
                    custom={2}
                    variants={sheetContentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Divider />
                  </Box>

                  <Stack
                    component={m.div}
                    custom={3}
                    variants={sheetContentVariants}
                    initial="hidden"
                    animate="visible"
                    spacing={0.75}
                  >
                    <Typography variant="overline" color="text.secondary">
                      Tutor
                    </Typography>
                    <Typography variant="body2">{tutorName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Kepribadian: {personalityLabel}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Skenario: {scenarioLabel} ({scenarioCategory})
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Tingkat: {difficultyLabel}
                    </Typography>
                  </Stack>

                  <Box
                    component={m.div}
                    custom={4}
                    variants={sheetContentVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Typography variant="overline" color="text.secondary">
                      Perkiraan Waktu
                    </Typography>
                    <Typography variant="body2">{estimatedMinutes} menit</Typography>
                  </Box>

                  <Box component={m.div} whileTap={{ scale: 0.98 }}>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<KeyboardArrowDownRoundedIcon />}
                      onClick={onClose}
                    >
                      Tutup panel
                    </Button>
                  </Box>
                </Stack>
              </Box>
            </Box>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!open && (
            <Box
              component={m.button}
              key="collapsed"
              type="button"
              onClick={onOpen}
              variants={isEnteringFocus ? focusSheetCollapsedVariants : undefined}
              initial={isEnteringFocus ? "hidden" : { opacity: 1, y: 0 }}
              animate={isEnteringFocus ? "visible" : { opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{
                duration: PRACTICE_FOCUS_TIMING.sheetCollapseMs,
                ease: M3_MOTION_EASE.accelerate,
              }}
              whileTap={{ scale: 0.99 }}
              sx={{
                position: "fixed",
                left: 0,
                right: 0,
                marginInline: "auto",
                bottom: 0,
                width: "100%",
                maxWidth: 480,
                minHeight: COLLAPSED_HEIGHT,
                border: "none",
                cursor: "pointer",
                bgcolor: "background.surfaceContainerLow",
                borderTop: 1,
                borderColor: "divider",
                px: 2,
                py: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
                font: "inherit",
                color: "inherit",
              }}
            >
              <ObjectiveCardCompact scenarioLabel={scenarioLabel} />
              {goals.length > 0 && (
                <MiniGoalWidget
                  achieved={achievedCount}
                  total={goals.length}
                  pulseKey={goalPulseKey}
                />
              )}
              <KeyboardArrowDownRoundedIcon
                sx={{
                  fontSize: 20,
                  color: "text.secondary",
                  transform: "rotate(180deg)",
                }}
              />
            </Box>
          )}
        </AnimatePresence>
      </Box>
    </>
  );
}

export const LEARNING_SHEET_COLLAPSED_HEIGHT = COLLAPSED_HEIGHT;
