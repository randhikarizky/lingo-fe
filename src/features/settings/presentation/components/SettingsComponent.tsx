"use client";

import { useRouter } from "next/navigation";
import { m } from "framer-motion";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import { M3_MOTION_EASE } from "@/theme/animate/m3-page";
import {
  useGetMe,
  useLogout,
} from "@/features/auth/presentation/controller/auth.controller";
import { useProgressSummary } from "@/features/dashboard/presentation/controller/progress.controller";
import { useSubscriptionMe } from "@/features/subscription/presentation/controller/subscription.controller";
import AboutCard from "./profile/AboutCard";
import AppearanceCard from "./profile/AppearanceCard";
import DangerZoneCard from "./profile/DangerZoneCard";
import LearningPreferenceCard from "./profile/LearningPreferenceCard";
import LearningSnapshot from "./profile/LearningSnapshot";
import ProfileHeader from "./profile/ProfileHeader";
import SubscriptionProfileCard from "./profile/SubscriptionProfileCard";

const sectionVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.36, ease: M3_MOTION_EASE.decelerate },
  }),
};

export default function SettingsComponent() {
  const router = useRouter();
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { data: subscription, isLoading: isSubscriptionLoading } = useSubscriptionMe();
  const { data: progress, isLoading: isProgressLoading } = useProgressSummary();
  const logout = useLogout();

  if (isUserLoading) {
    return <LoadingTips label="Memuat profil..." />;
  }

  return (
    <Stack
      spacing={2}
      component={m.div}
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
    >
      <Box component={m.div} variants={sectionVariants} custom={0}>
        <Typography variant="h5" sx={{ fontWeight: 900 }}>
          Profil
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.25 }}>
          Identitas, progress, dan preferensi belajarmu
        </Typography>
      </Box>

      {user && (
        <Box component={m.div} variants={sectionVariants} custom={0.04}>
          <ProfileHeader
            name={user.name}
            email={user.email}
            plan={subscription?.plan ?? "FREE"}
          />
        </Box>
      )}

      <Box component={m.div} variants={sectionVariants} custom={0.08}>
        <LearningSnapshot summary={progress} isLoading={isProgressLoading} />
      </Box>

      <Box component={m.div} variants={sectionVariants} custom={0.12}>
        {isSubscriptionLoading ? (
          <Skeleton variant="rounded" height={280} sx={{ borderRadius: "20px" }} />
        ) : subscription ? (
          <SubscriptionProfileCard
            subscription={subscription}
            onManagePlan={() => router.push("/pricing")}
            onUpgrade={() => router.push("/pricing")}
          />
        ) : null}
      </Box>

      <Box component={m.div} variants={sectionVariants} custom={0.16}>
        <LearningPreferenceCard />
      </Box>

      <Box component={m.div} variants={sectionVariants} custom={0.2}>
        <AppearanceCard />
      </Box>

      <Box component={m.div} variants={sectionVariants} custom={0.24}>
        <AboutCard />
      </Box>

      <Box component={m.div} variants={sectionVariants} custom={0.28}>
        <DangerZoneCard
          onLogout={() => logout.mutate()}
          isLoggingOut={logout.isPending}
        />
      </Box>
    </Stack>
  );
}
