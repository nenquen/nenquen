"use client";

import { useEffect, useState } from "react";
import CRTWarp from "./CRTWarp";

export function ClientCRTWarp() {
  const [isMobile, setIsMobile] = useState(true); // Default to true (mobile-first) to prevent heavy load on initial hydration

  useEffect(() => {
    const checkDevice = () => {
      // 768px is the typical md breakpoint
      setIsMobile(window.innerWidth < 768);
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // WebGL shaders kill old mobile devices (like Redmi Note 9). 
  // We completely disable it on mobile.
  if (isMobile) {
    return (
      <div className="absolute inset-0 bg-[#05010a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#c084fc]/15 via-[#05010a] to-[#05010a]" />
    );
  }

  return (
    <CRTWarp
      color="#e9b6ff"
      backgroundColor="#05010a"
      speed={0.4}
      curvature={0}
      scanlineStrength={0.5} // reduced for performance
      scanlineFrequency={150} // reduced for performance
      waveAmplitude={0.25}
      waveFrequency={3}
      bloom={1.0} // reduced for performance
      bloomRadius={1}
      noise={0}
      vignette={0.8}
      brightness={1.25}
      pixelation={1}
      rgbShift={0}
      mouseReact={false}
      mouseStrength={0}
      dpr={1} // Keep native resolution but fps reduced
      fps={30} // Reduced from 60 to 30 to save battery and GPU on low-end laptops
    />
  );
}
