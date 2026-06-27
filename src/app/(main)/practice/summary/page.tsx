import { Suspense } from "react";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import PracticeSummaryPage from "@/features/learning/presentation/components/PracticeSummaryPage";

export default function SummaryPage() {
  return (
    <Suspense fallback={<LoadingTips label="Memuat ringkasan..." />}>
      <PracticeSummaryPage />
    </Suspense>
  );
}
