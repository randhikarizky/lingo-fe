import type { PlanId, PublicPlan } from "../../domain/entities/subscription.entity";

export type BillingPeriod = "monthly" | "lifetime";

export type PlanTheme = {
  bg: string;
  border: string;
  accent: string;
  text: string;
  textMuted: string;
  glow?: string;
};

export const PLAN_THEMES: Record<PlanId, PlanTheme> = {
  FREE: {
    bg: "transparent",
    border: "1px solid",
    accent: "text.secondary",
    text: "text.primary",
    textMuted: "text.secondary",
  },
  STARTER: {
    bg: "linear-gradient(145deg, #1a1240 0%, #0d0818 55%, #12102a 100%)",
    border: "1px solid rgba(245,185,66,0.28)",
    accent: "#F5B942",
    text: "#F5EFEB",
    textMuted: "rgba(255,255,255,0.55)",
    glow: "0 20px 56px rgba(245,185,66,0.18)",
  },
  PRO: {
    bg: "linear-gradient(145deg, #1c1c24 0%, #101014 52%, #16161d 100%)",
    border: "1px solid rgba(245,185,66,0.42)",
    accent: "#F5B942",
    text: "#F5EFEB",
    textMuted: "rgba(255,255,255,0.52)",
    glow: "0 16px 48px rgba(0,0,0,0.45)",
  },
  LIFETIME: {
    bg: "linear-gradient(145deg, #0f2a24 0%, #081612 52%, #0e221c 100%)",
    border: "1px solid rgba(52,211,153,0.35)",
    accent: "#34D399",
    text: "#ECFDF5",
    textMuted: "rgba(236,253,245,0.58)",
    glow: "0 20px 56px rgba(52,211,153,0.15)",
  },
};

export const WHY_UPGRADE_BENEFITS = [
  {
    icon: "🎙",
    title: "Speaking Tanpa Batas",
    description: "Latihan setiap hari tanpa khawatir kehabisan kuota.",
  },
  {
    icon: "👩‍🏫",
    title: "Tutor AI Personal",
    description: "Dapatkan koreksi personal setelah setiap percakapan.",
  },
  {
    icon: "🌍",
    title: "Skenario Kehidupan Nyata",
    description: "Latihan restoran, travel, bisnis, wawancara, dan lainnya.",
  },
] as const;

export const TRUST_ITEMS = [
  "Batal kapan saja",
  "Pembayaran aman",
  "Progres belajar tetap tersimpan",
  "Upgrade instan",
  "AI tersedia 24/7",
  "Tanpa biaya tersembunyi",
] as const;

export const FAQ_ITEMS = [
  {
    question: "Bisakah saya batalkan kapan saja?",
    answer: "Ya. Paket bulanan bisa dibatalkan sebelum siklus tagihan berikutnya tanpa penalti selama beta.",
  },
  {
    question: "Bisakah saya upgrade nanti?",
    answer: "Tentu. Mulai dari Starter, lalu pindah ke Pro atau Lifetime kapan pun siap.",
  },
  {
    question: "Bisakah saya downgrade nanti?",
    answer: "Downgrade berlaku di akhir periode tagihan. Hubungi support selama beta.",
  },
  {
    question: "Apakah progres belajar saya hilang?",
    answer: "Tidak. Percakapan, streak, dan kosakata tetap tersimpan di akunmu.",
  },
  {
    question: "Bisakah pindah dari Bulanan ke Lifetime?",
    answer: "Ya. Upgrade ke Lifetime kapan saja — progres langsung ikut.",
  },
  {
    question: "Apakah pembayaran saya aman?",
    answer: "Pembayaran akan diproses lewat provider tepercaya dengan enkripsi standar industri.",
  },
  {
    question: "Ada diskon pelajar?",
    answer: "Harga pelajar sedang dalam roadmap. Daftar lewat support selama beta.",
  },
] as const;

export type ComparisonRow = {
  feature: string;
  free: string;
  starter: string;
  pro: string;
  lifetime: string;
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  { feature: "Speaking", free: "10 mnt", starter: "60 mnt", pro: "Tanpa batas", lifetime: "Tanpa batas" },
  { feature: "Tutor", free: "2", starter: "Semua", pro: "Semua", lifetime: "Semua" },
  { feature: "Skenario", free: "3", starter: "Semua", pro: "Semua", lifetime: "Semua" },
  { feature: "Feedback AI", free: "Dasar", starter: "Detail", pro: "Lanjutan", lifetime: "Lanjutan" },
  { feature: "Latihan Suara", free: "Ya", starter: "Ya", pro: "Prioritas", lifetime: "Prioritas" },
  { feature: "Analitik", free: "Dasar", starter: "Lanjutan", pro: "Lanjutan", lifetime: "Lanjutan" },
  { feature: "Antrian Prioritas", free: "—", starter: "—", pro: "Ya", lifetime: "Ya" },
];

export const LIFETIME_VALUE_POINTS = [
  "Sekali bayar.",
  "Akses seumur hidup.",
  "Tanpa tagihan berulang.",
] as const;

export function getPlanBenefitTagline(planId: PlanId) {
  switch (planId) {
    case "FREE":
      return "Cocok untuk memulai perjalanan speaking-mu.";
    case "STARTER":
      return "Cocok untuk latihan harian.";
    case "PRO":
      return "Dibuat untuk profesional.";
    case "LIFETIME":
      return "Belajar selamanya dengan sekali bayar.";
    default:
      return "Mulai berbicara hari ini.";
  }
}

export function getHeroHighlights(planId: PlanId) {
  switch (planId) {
    case "STARTER":
      return [
        "Tutor Tanpa Batas",
        "Skenario Tanpa Batas",
        "60 Menit Speaking",
        "Feedback Personal",
      ];
    case "PRO":
      return [
        "Tutor Tanpa Batas",
        "Skenario Tanpa Batas",
        "Speaking Tanpa Batas",
        "Feedback AI Lanjutan",
        "Antrian Prioritas",
      ];
    case "LIFETIME":
      return [
        "Semua fitur Pro",
        "Akses seumur hidup",
        "Tanpa tagihan berulang",
        "Antrian Prioritas",
        "Keuntungan Early Supporter",
      ];
    default:
      return [];
  }
}

export function getPlanHighlights(plan: PublicPlan) {
  const items: string[] = [];

  items.push(plan.features.allScenarios ? "Skenario Tanpa Batas" : "3 Skenario Dasar");
  items.push(plan.features.allTutors ? "Tutor Tanpa Batas" : "2 Tutor AI");

  if (plan.limits.aiRepliesPerDay === null) {
    items.push("Balasan AI Tanpa Batas");
  } else {
    items.push(`${plan.limits.aiRepliesPerDay} Balasan AI`);
  }

  if (plan.limits.speakingMinutesPerDay === null) {
    items.push("Speaking Tanpa Batas");
  } else {
    items.push(`${plan.limits.speakingMinutesPerDay} Menit Speaking`);
  }

  if (plan.features.priorityProcessing) {
    items.push("Antrian Prioritas");
  }

  return items.slice(0, 4);
}

const PLAN_RANK: Record<PlanId, number> = {
  FREE: 0,
  STARTER: 1,
  PRO: 2,
  LIFETIME: 3,
};

export function canUpgradeToPlan(currentPlan: PlanId, targetPlan: PlanId) {
  if (targetPlan === "FREE") return false;
  if (targetPlan === currentPlan) return false;
  return PLAN_RANK[targetPlan] > PLAN_RANK[currentPlan];
}

export function getVisiblePlans(plans: PublicPlan[], billing: BillingPeriod) {
  if (billing === "lifetime") {
    return plans.filter((plan) => plan.id === "LIFETIME");
  }

  return plans.filter((plan) => plan.id !== "LIFETIME");
}

export function getDefaultStickyPlanId(currentPlan: PlanId, billing: BillingPeriod): PlanId {
  if (billing === "lifetime") return "LIFETIME";
  if (currentPlan === "FREE") return "STARTER";
  if (currentPlan === "STARTER") return "PRO";
  return "PRO";
}

export function formatStickyPrice(plan: PublicPlan, billing: BillingPeriod) {
  if (plan.id === "LIFETIME") {
    return "Sekali bayar · Rp1,990,000";
  }
  if (billing === "lifetime") {
    return plan.priceLabel;
  }
  if (plan.priceLabel.includes("/bulan")) {
    return `Hanya ${plan.priceLabel}`;
  }
  return plan.priceLabel;
}

export function getHeroBadge(planId: PlanId) {
  switch (planId) {
    case "STARTER":
      return "PALING POPULER";
    case "LIFETIME":
      return "NILAI TERBAIK";
    default:
      return "REKOMENDASI";
  }
}

export function getPlanDisplayLabel(planId: PlanId) {
  switch (planId) {
    case "FREE":
      return "Gratis";
    case "STARTER":
      return "Starter";
    case "PRO":
      return "Pro";
    case "LIFETIME":
      return "Seumur Hidup";
    default:
      return planId;
  }
}
