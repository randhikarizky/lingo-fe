"use client";

import { useEffect, useRef, useState } from "react";

import type { SessionGoal } from "../../domain/entities/learning-session.entity";

function celebrationStorageKey(conversationId: string) {
  return `lingora:goals-celebration:${conversationId}`;
}

export function useSessionGoalProgress(
  goals: SessionGoal[],
  conversationId: string | null
) {
  const prevGoalsRef = useRef<SessionGoal[]>([]);
  const initializedRef = useRef(false);
  const [prevConversationId, setPrevConversationId] = useState(conversationId);
  const [pulseKey, setPulseKey] = useState(0);
  const [recentlyAchievedIds, setRecentlyAchievedIds] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  if (conversationId !== prevConversationId) {
    setPrevConversationId(conversationId);
    setShowCelebration(false);
    setRecentlyAchievedIds([]);
    setPulseKey(0);
  }

  const achievedCount = goals.filter((goal) => goal.achieved).length;
  const totalGoals = goals.length;
  const allComplete = totalGoals > 0 && achievedCount === totalGoals;

  useEffect(() => {
    if (!initializedRef.current) {
      if (goals.length > 0) {
        prevGoalsRef.current = goals;
        initializedRef.current = true;
      }
      return;
    }

    const prev = prevGoalsRef.current;
    const prevAchieved = prev.filter((goal) => goal.achieved).length;
    const nextAchieved = goals.filter((goal) => goal.achieved).length;

    if (nextAchieved > prevAchieved) {
      setPulseKey((key) => key + 1);

      const newlyAchieved = goals
        .filter(
          (goal) =>
            goal.achieved &&
            !prev.some((previous) => previous.id === goal.id && previous.achieved)
        )
        .map((goal) => goal.id);

      if (newlyAchieved.length > 0) {
        setRecentlyAchievedIds(newlyAchieved);
        window.setTimeout(() => setRecentlyAchievedIds([]), 1600);
      }

      if (
        conversationId &&
        totalGoals > 0 &&
        nextAchieved === totalGoals &&
        prevAchieved < totalGoals &&
        sessionStorage.getItem(celebrationStorageKey(conversationId)) !== "1"
      ) {
        setShowCelebration(true);
      }
    }

    prevGoalsRef.current = goals;
  }, [conversationId, goals, totalGoals]);

  useEffect(() => {
    initializedRef.current = false;
    prevGoalsRef.current = [];
  }, [conversationId]);

  const dismissCelebration = () => {
    if (conversationId) {
      sessionStorage.setItem(celebrationStorageKey(conversationId), "1");
    }
    setShowCelebration(false);
  };

  return {
    achievedCount,
    totalGoals,
    allComplete,
    pulseKey,
    recentlyAchievedIds,
    showCelebration,
    dismissCelebration,
  };
}
