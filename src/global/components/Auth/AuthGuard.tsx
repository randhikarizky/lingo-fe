"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import LoadingTips from "@/global/components/Loading/LoadingTips";
import { useGetMe } from "@/features/auth/presentation/controller/auth.controller";

type Props = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isError } = useGetMe();

  useEffect(() => {
    if (!isLoading && isError) {
      const redirect = encodeURIComponent(pathname);
      router.replace(`/login?redirect=${redirect}`);
    }
  }, [isError, isLoading, pathname, router]);

  if (isLoading) {
    return <LoadingTips label="Memverifikasi sesi..." />;
  }

  if (isError) {
    return null;
  }

  return <>{children}</>;
}
