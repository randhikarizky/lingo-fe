"use client";

import { useCallback, useEffect, useState } from "react";

export function useConnectionMonitor() {
  const [isOffline, setIsOffline] = useState(false);
  const [hasServerIssue, setHasServerIssue] = useState(false);

  useEffect(() => {
    const syncOnline = () => setIsOffline(!navigator.onLine);
    syncOnline();
    window.addEventListener("online", syncOnline);
    window.addEventListener("offline", syncOnline);
    return () => {
      window.removeEventListener("online", syncOnline);
      window.removeEventListener("offline", syncOnline);
    };
  }, []);

  const reportServerIssue = useCallback((isIssue: boolean) => {
    setHasServerIssue(isIssue);
  }, []);

  const clearServerIssue = useCallback(() => {
    setHasServerIssue(false);
  }, []);

  return {
    showBanner: isOffline || hasServerIssue,
    isOffline,
    reportServerIssue,
    clearServerIssue,
  };
}
