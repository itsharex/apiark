import { useState, useEffect } from "react";

export function useResponsive() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return {
    isCompact: width < 900,
    isMedium: width >= 900 && width < 1200,
    isWide: width >= 1200,
    width,
  };
}
