import { useEffect, useRef, useState, type RefObject } from "react";
import Hls from "hls.js";

const videos = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
  // "https://www.w3schools.com/tags/movie.mp4",
  // "https://www.pexels.com/download/video/3209663/",
  // "https://filesamples.com/samples/video/mp4/sample_640x360.mp4",
  // "https://www.pexels.com/download/video/3195443/",
];

export default function Reels() {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      style={{
        height: "100vh",
        overflowY: "scroll",
        scrollSnapType: "y mandatory",
      }}
    >
      {videos.map((src, i) => (
        <Reel
          key={i}
          src={src}
          index={i}
          setActiveIndex={setActiveIndex}
          refs={refs}
          activeIndex={activeIndex}
        />
      ))}
    </div>
  );
}

interface ReelProps {
  src: string;
  index: number;
  setActiveIndex: (index: number) => void;
  activeIndex: number;
  refs: RefObject<(HTMLVideoElement | null)[]>;
}

function Reel({ index, src, refs, activeIndex, setActiveIndex }: ReelProps) {
  const [isVisible, setIsVisible] = useState(false);

  const shouldRender = Math.abs(activeIndex - index) <= 1;
  console.log({ activeIndex, index });

  useEffect(() => {
    const video = refs.current?.[index];
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        console.log({ index, visible });

        setIsVisible(visible);

        if (isVisible) {
          setActiveIndex(index);
          video.play().catch((e) => {
            console.log({ e });
          });
        } else {
          video.pause();
        }
      },
      { threshold: 1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [index, refs, setActiveIndex, isVisible]);

  useEffect(() => {
    const videoSrc = src;
    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(refs.current?.[index]);
    }
  }, [index, refs, src]);
  // if (!shouldRender) {
  //   return (
  //     <div
  //       style={{
  //         height: "100vh",
  //         scrollSnapAlign: "start",
  //         background: "#000",
  //       }}
  //     />
  //   );
  // }

  return (
    <div
      style={{
        height: "100vh",
        scrollSnapAlign: "start",
        position: "relative",
      }}
    >
      <video
        ref={(el) => {
          refs.current[index] = el;
        }}
        src={shouldRender ? src : "none"}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          background: "#000",
        }}
        muted
        loop
        playsInline
        preload={shouldRender ? "auto" : "none"}
        controls
      />
    </div>
  );
}
