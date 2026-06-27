"use client";

import { useSearchParams } from "next/navigation";
import LearningSummaryScreen from "./LearningSummaryScreen";

export default function PracticeSummaryPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id") || "";

  if (!conversationId) {
    return null;
  }

  return <LearningSummaryScreen conversationId={conversationId} />;
}
