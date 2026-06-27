import { Suspense } from "react";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import PracticeSetupComponent from "@/features/learning/presentation/components/PracticeSetupComponent";

export default function PracticePage() {
  return (
    <Suspense fallback={<LoadingTips label="Menyiapkan sesi latihan..." />}>
      <PracticeSetupComponent />
    </Suspense>
  );
}
