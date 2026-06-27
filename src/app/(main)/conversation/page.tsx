import { Suspense } from "react";
import ConversationComponent from "@/features/conversation/presentation/components/ConversationComponent";
import LoadingTips from "@/global/components/Loading/LoadingTips";

export default function ConversationPage() {
  return (
    <Suspense fallback={<LoadingTips label="Menyiapkan ruang belajarmu..." />}>
      <ConversationComponent />
    </Suspense>
  );
}
