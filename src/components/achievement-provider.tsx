"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlockedAt: number | null;
};

interface AchievementContextType {
  clickCount: number;
  incrementClickCount: () => void;
  achievements: Achievement[];
  isMenuOpen: boolean;
  setIsMenuOpen: (isOpen: boolean) => void;
  recentUnlock: Achievement | null;
  clearRecentUnlock: () => void;
}

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const ACHIEVEMENTS_DATA: Achievement[] = [
  {
    id: "click_67",
    title: "67 Obsession",
    description: "You clicked 67 exactly 67 times.",
    unlockedAt: null,
  },
];

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [clickCount, setClickCount] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>(ACHIEVEMENTS_DATA);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [recentUnlock, setRecentUnlock] = useState<Achievement | null>(null);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const savedCount = localStorage.getItem("achievement_clickCount");
      if (savedCount) setClickCount(parseInt(savedCount, 10));

      const savedAchievements = localStorage.getItem("achievement_data");
      if (savedAchievements) {
        const parsed = JSON.parse(savedAchievements);
        // Merge saved unlock states with default data
        const merged = ACHIEVEMENTS_DATA.map((def) => {
          const saved = parsed.find((a: Achievement) => a.id === def.id);
          return saved ? { ...def, unlockedAt: saved.unlockedAt } : def;
        });
        setAchievements(merged);
      }
    } catch (e) {
      console.error("Failed to load achievements", e);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem("achievement_clickCount", clickCount.toString());
    localStorage.setItem("achievement_data", JSON.stringify(achievements));
  }, [clickCount, achievements]);

  const incrementClickCount = useCallback(() => {
    setClickCount((prev) => {
      const newCount = prev + 1;
      
      // Check for unlock condition
      if (newCount === 67) {
        unlockAchievement("click_67");
      }
      
      return newCount;
    });
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    setAchievements((prev) => {
      const achievementIndex = prev.findIndex((a) => a.id === id);
      if (achievementIndex === -1 || prev[achievementIndex].unlockedAt) return prev; // Already unlocked

      const newAchievements = [...prev];
      const newlyUnlocked = { ...newAchievements[achievementIndex], unlockedAt: Date.now() };
      newAchievements[achievementIndex] = newlyUnlocked;
      
      setRecentUnlock(newlyUnlocked);
      return newAchievements;
    });
  }, []);

  const clearRecentUnlock = useCallback(() => setRecentUnlock(null), []);

  return (
    <AchievementContext.Provider
      value={{
        clickCount,
        incrementClickCount,
        achievements,
        isMenuOpen,
        setIsMenuOpen,
        recentUnlock,
        clearRecentUnlock,
      }}
    >
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error("useAchievements must be used within an AchievementProvider");
  }
  return context;
}
