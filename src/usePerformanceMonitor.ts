import { useEffect, useState } from "react";

export function usePerformanceMonitor() {
  const [stats, setStats] = useState({
    fps: 0,
    ramMB: 0,
    jsHeapMB: 0,
    totalHeapMB: 0,
    downloadedMB: 0,
    segments: 0,
  });

  let lastFrame = performance.now();
  let frames = 0;
  let downloadedBytes = 0;
  let segments = 0;

  const handleFragLoaded = (data: any) => {
    downloadedBytes += data.stats.total;
    segments++;
  };

  useEffect(() => {
    const loop = () => {
      const now = performance.now();
      frames++;

      if (now - lastFrame >= 1000) {
        const ram = performance.memory || undefined;
        setStats({
          fps: frames,
          ramMB: ram ? (ram.usedJSHeapSize / 1024 / 1024).toFixed(1) : "N/A",
          jsHeapMB: ram ? (ram.usedJSHeapSize / 1024 / 1024).toFixed(1) : "N/A",
          totalHeapMB: ram ? (ram.totalJSHeapSize / 1024 / 1024).toFixed(1) : "N/A",
          downloadedMB: (downloadedBytes / 1024 / 1024).toFixed(2),
          segments,
        });

        frames = 0;
        lastFrame = now;
      }
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);

    // override HLS global event listener
    window._fragLoaded = handleFragLoaded;

    return () => {
      window._fragLoaded = null;
    };
  }, []);

  return stats;
}
