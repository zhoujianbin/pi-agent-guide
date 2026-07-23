import { useEffect, useRef } from "react";

/** 滚动进入视口时触发渐入动画 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = el.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const t = entry.target as HTMLElement;
            t.style.animationPlayState = "running";
            io.unobserve(t);
          }
        });
      },
      { threshold: 0.12 },
    );
    targets.forEach((t) => {
      t.style.animationPlayState = "paused";
      io.observe(t);
    });
    return () => io.disconnect();
  }, []);

  return ref;
}
