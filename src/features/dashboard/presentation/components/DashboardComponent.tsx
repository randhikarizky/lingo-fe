"use client";

import { useEffect, useMemo, useState } from "react";
import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { useRouter } from "next/navigation";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import { useGetMe } from "@/features/auth/presentation/controller/auth.controller";
import { useGetConversationList } from "@/features/conversation/presentation/controller/conversation.controller";
import {
  useProgressSummary,
  useProgressActivity,
} from "@/features/dashboard/presentation/controller/progress.controller";
import { getLastSession } from "@/features/learning/presentation/utils/last-session.storage";
import { useSubscriptionMe } from "@/features/subscription/presentation/controller/subscription.controller";

import GreetingHero from "./adventure/GreetingHero";
import MissionHeroCard from "./adventure/MissionHeroCard";
import DashboardLearningSnapshot from "./adventure/DashboardLearningSnapshot";
import JourneyTimeline from "./adventure/JourneyTimeline";
import TutorCarousel from "./adventure/TutorCarousel";
import RecentPracticeCard from "./adventure/RecentPracticeCard";
import ActivityHeatmap from "./adventure/ActivityHeatmap";
import SubscriptionMiniCard from "./adventure/SubscriptionMiniCard";
import { DASHBOARD_RADIUS } from "./adventure/dashboard.tokens";
import {
  buildJourneyNodes,
  resolveMissionState,
} from "../utils/dashboard.utils";

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.36, ease: M3_MOTION_EASE.decelerate },
  }),
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 1.25 }}>
      {children}
    </Typography>
  );
}

export default function DashboardComponent() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { data: conversations = [] } = useGetConversationList();
  const {
    data: summary,
    isLoading: isSummaryLoading,
    isError: isSummaryError,
    refetch: refetchSummary,
  } = useProgressSummary();
  const {
    data: activity,
    isLoading: isActivityLoading,
    isError: isActivityError,
    refetch: refetchActivity,
  } = useProgressActivity();
  const { data: subscription } = useSubscriptionMe();

  const [lastSession, setLastSession] = useState(() =>
    typeof window !== "undefined" ? getLastSession() : null
  );

  useEffect(() => {
    setLastSession(getLastSession());
  }, []);

  const missionState = useMemo(
    () => resolveMissionState(conversations, summary, lastSession),
    [conversations, summary, lastSession]
  );

  const journeyNodes = useMemo(
    () => buildJourneyNodes(summary?.conversationCount ?? 0),
    [summary?.conversationCount]
  );

  const recentConversation = useMemo(() => {
    return [...conversations].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )[0];
  }, [conversations]);

  const recommendedCharacterId = useMemo(() => {
    if (missionState.kind === "continue") return missionState.conversation.characterId;
    if (lastSession) return lastSession.characterId;
    if (recentConversation) return recentConversation.characterId;
    return "maya";
  }, [missionState, lastSession, recentConversation]);

  const recommendedScenario = useMemo(() => {
    if (missionState.kind === "continue") return missionState.conversation.scenarioLabel;
    if (lastSession) return lastSession.scenarioLabel;
    if (recentConversation) return recentConversation.scenarioLabel;
    return "";
  }, [missionState, lastSession, recentConversation]);

  if (isUserLoading) {
    return <LoadingTips label="Menyiapkan pusat petualanganmu..." />;
  }

  const isProgressLoading = isSummaryLoading || isActivityLoading;
  const isProgressError = isSummaryError || isActivityError;

  const handleRetry = () => {
    refetchSummary();
    refetchActivity();
  };

  return (
    <Stack
      spacing={2.5}
      component={m.div}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
    >
      <Box component={m.div} variants={sectionVariants} custom={0}>
        <GreetingHero name={user?.name ?? "Pelajar"} />
      </Box>

      <Box component={m.div} variants={sectionVariants} custom={0.02}>
        <MissionHeroCard state={missionState} />
      </Box>

      {isProgressError ? (
        <Card
          component={m.div}
          variants={sectionVariants}
          custom={0.05}
          sx={{
            p: 3,
            textAlign: "center",
            borderColor: "error.light",
            borderWidth: 1,
            borderStyle: "solid",
          }}
        >
          <Typography variant="subtitle2" color="error" sx={{ fontWeight: 700, mb: 1 }}>
            Gagal memuat progres belajar
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>
            Koneksi atau server error saat mengambil statistikmu.
          </Typography>
          <Button variant="outlined" color="primary" size="small" onClick={handleRetry}>
            Coba Lagi
          </Button>
        </Card>
      ) : isProgressLoading ? (
        <>
          <Box
            component={m.div}
            variants={sectionVariants}
            custom={0.05}
            sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 1.5 }}
          >
            {[...Array(4)].map((_, i) => (
              <Card key={i} sx={{ p: 1.75 }}>
                <Skeleton variant="circular" width={28} height={28} />
                <Skeleton variant="text" width="60%" sx={{ mt: 1 }} />
                <Skeleton variant="text" width="40%" />
              </Card>
            ))}
          </Box>
          <Card component={m.div} variants={sectionVariants} custom={0.08} sx={{ p: 2.5 }}>
            <Skeleton variant="text" width="180px" />
            <Skeleton variant="rectangular" height={120} sx={{ mt: 1.5, borderRadius: 1 }} />
          </Card>
        </>
      ) : summary ? (
        <>
          <Box component={m.div} variants={sectionVariants} custom={0.05}>
            <SectionTitle>Ringkasan Belajar</SectionTitle>
            <DashboardLearningSnapshot summary={summary} />
          </Box>

          <Box component={m.div} variants={sectionVariants} custom={0.08}>
            <SectionTitle>Perjalanan Belajar</SectionTitle>
            <JourneyTimeline nodes={journeyNodes} />
          </Box>
        </>
      ) : null}

      <Box component={m.div} variants={sectionVariants} custom={0.1}>
        <SectionTitle>Tutor Rekomendasi</SectionTitle>
        <TutorCarousel
          recommendedCharacterId={recommendedCharacterId}
          scenarioLabel={recommendedScenario}
          subscription={subscription}
        />
      </Box>

      <Box component={m.div} variants={sectionVariants} custom={0.12}>
        <SectionTitle>Latihan Terbaru</SectionTitle>
        <RecentPracticeCard conversation={recentConversation} />
      </Box>

      {!isProgressLoading && !isProgressError && (
        <Card
          component={m.div}
          variants={sectionVariants}
          custom={0.14}
          sx={{ p: 2.5, borderRadius: `${DASHBOARD_RADIUS.section}px` }}
        >
          <SectionTitle>Aktivitas Belajar</SectionTitle>
          <ActivityHeatmap data={activity ?? []} />
        </Card>
      )}

      {subscription && (
        <Box component={m.div} variants={sectionVariants} custom={0.18}>
          <SubscriptionMiniCard
            subscription={subscription}
            onUpgrade={() => router.push("/pricing")}
          />
        </Box>
      )}
    </Stack>
  );
}
