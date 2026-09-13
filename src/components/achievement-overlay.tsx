"use client";

import React, { useEffect, useState } from "react";
import { useAchievements, Achievement } from "./achievement-provider";

export function AchievementOverlay() {
  const { achievements, isMenuOpen, setIsMenuOpen, recentUnlock, clearRecentUnlock } = useAchievements();
  const [showToast, setShowToast] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [toastData, setToastData] = useState<Achievement | null>(null);

  // Handle Toast Notifications
  useEffect(() => {
    if (recentUnlock) {
      setToastData(recentUnlock);
      setShowToast(true);
      setIsExiting(false);

      const audio = new Audio("/sounds/achievement.mp3");
      audio.play().catch(() => {});
      
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          setShowToast(false);
          clearRecentUnlock();
        }, 300); // Wait for exit animation
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [recentUnlock, clearRecentUnlock]);

  return (
    <>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(120%); opacity: 0; }
        }
        .toast-enter {
          animation: slideInRight 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .toast-exit {
          animation: slideOutRight 0.3s ease-in forwards;
        }
      `}</style>

      {/* Bottom Right Menu Button */}
      <button
        onClick={() => setIsMenuOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border border-white/10 border-t-white/25 bg-[#0a0210]/60 bg-gradient-to-b from-white/10 to-transparent p-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.2)] backdrop-blur-2xl backdrop-saturate-200 transition-transform duration-300 hover:scale-110 active:scale-95 before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:rounded-t-full before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-50"
        aria-label="Achievements Menu"
      >
        <div className="relative z-10 h-6 w-6 text-white/70 transition-colors hover:text-white bg-current [mask-image:url('/icons/trophy.svg')] [mask-size:contain] [mask-repeat:no-repeat]" />
      </button>

      {/* Toast Notification */}
      {showToast && toastData && (
        <div className={`fixed bottom-24 right-6 z-[60] flex items-center gap-3 overflow-hidden rounded-full border border-white/10 border-t-white/25 bg-white/5 p-1.5 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_0_rgba(255,255,255,0.2)] backdrop-blur-2xl backdrop-saturate-200 before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:rounded-t-full before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-50 [text-shadow:none] ${isExiting ? 'toast-exit' : 'toast-enter'}`}>
          <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#5865F2]/30 bg-[#5865F2]/20 text-[#a5b0ff] shadow-[inset_0_1px_0_0_rgba(88,101,242,0.4)]">
            {toastData.id === 'click_67' ? (
              <span className="font-boblox text-lg text-white" style={{ textShadow: "-1px -1px 0 #9163cb, 1px -1px 0 #9163cb, -1px 1px 0 #9163cb, 1px 1px 0 #9163cb, 0 1.5px 0 #9163cb, 0 2px 0 #9163cb, 0 3px 3px rgba(0,0,0,0.3)" }}>67</span>
            ) : toastData.id === 'click_6767' ? (
              null /* Blank for now */
            ) : (
              <div className="h-5 w-5 bg-current [mask-image:url('/icons/trophy.svg')] [mask-size:contain] [mask-repeat:no-repeat]" />
            )}
          </div>
          <div className="relative z-10 flex flex-col pr-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a5b0ff]">Achievement unlocked</span>
            <span className="text-sm font-medium text-white">{toastData.title}</span>
          </div>
        </div>
      )}

      {/* Achievements Menu Modal */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200 [text-shadow:none]">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-white/10 border-t-white/30 bg-black/20 bg-gradient-to-b from-white/10 to-transparent shadow-[0_8px_32px_0_rgba(0,0,0,0.5),inset_0_1px_0_0_rgba(255,255,255,0.2)] backdrop-blur-3xl backdrop-saturate-200 before:absolute before:inset-x-0 before:top-0 before:h-1/2 before:rounded-t-3xl before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-50">
            {/* Modal Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 bg-transparent p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white">
                  <div className="h-4 w-4 bg-current [mask-image:url('/icons/trophy.svg')] [mask-size:contain] [mask-repeat:no-repeat]" />
                </div>
                <h2 className="font-bold text-xl text-white tracking-tight">Achievements</h2>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="relative z-10 flex max-h-[60vh] flex-col gap-3 overflow-y-auto p-5">
              {achievements.map((ach) => {
                const isUnlocked = ach.unlockedAt !== null;
                
                return (
                  <div 
                    key={ach.id}
                    className={`relative flex items-center gap-4 rounded-2xl border p-4 transition-all overflow-hidden ${
                      isUnlocked 
                        ? "border-[#5865F2]/40 bg-[#5865F2]/10 bg-gradient-to-b from-[#5865F2]/20 to-transparent shadow-[inset_0_1px_0_0_rgba(88,101,242,0.4)] backdrop-blur-md" 
                        : "border-white/10 bg-white/5 bg-gradient-to-b from-white/10 to-transparent opacity-60 grayscale backdrop-blur-md"
                    }`}
                  >
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border ${isUnlocked ? 'border-[#5865F2]/40 bg-[#5865F2]/20 text-[#a5b0ff] shadow-[0_0_15px_rgba(88,101,242,0.3)]' : 'border-white/10 bg-white/5 text-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]'}`}>
                      {isUnlocked ? (
                        ach.id === 'click_67' ? (
                          <span className="font-boblox text-xl text-white" style={{ textShadow: "-1px -1px 0 #9163cb, 1px -1px 0 #9163cb, -1px 1px 0 #9163cb, 1px 1px 0 #9163cb, 0 1.5px 0 #9163cb, 0 2px 0 #9163cb, 0 3px 3px rgba(0,0,0,0.3)" }}>67</span>
                        ) : ach.id === 'click_6767' ? (
                          null /* Blank for now */
                        ) : (
                          <div className="h-6 w-6 bg-current [mask-image:url('/icons/trophy.svg')] [mask-size:contain] [mask-repeat:no-repeat]" />
                        )
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse opacity-50"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-lg leading-none ${isUnlocked ? "text-white" : "text-white/40"}`}>
                          {isUnlocked ? ach.title : "???"}
                        </span>
                        {isUnlocked && (
                          <span className="rounded-full bg-[#5865F2]/20 px-2 py-0.5 text-[10px] font-bold text-[#a5b0ff]">UNLOCKED</span>
                        )}
                      </div>
                      <span className={`mt-1.5 text-sm ${isUnlocked ? "text-white/70" : "text-white/30"}`}>
                        {isUnlocked ? ach.description : "Keep exploring to unlock this achievement..."}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
