import { useEffect, useRef, useState, type RefObject } from "react";
import Hls from "hls.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Virtual } from "swiper/modules";

const videos = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/test_001/stream.m3u8",
  "https://test-streams.mux.dev/dai-discontinuity-deltatre/manifest.m3u8",
  "https://test-streams.mux.dev/tos_ismc/main.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
];

export default function Reels() {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  console.log(
    "Active HLS instances:",
    refs.current.filter((v) => v && !v.paused).length
  );

  return (
    <Swiper
      direction="vertical"
      modules={[Virtual]}
      slidesPerView={1}
      virtual={{
        addSlidesBefore: 5,
        addSlidesAfter: 5,
      }}
      mousewheel
      onSlideChange={(swiper) => {
        setActiveIndex(swiper.activeIndex);
      }}
      style={{ width: "100%", height: "100vh" }}
      resistanceRatio={0}
    >
      {videos.map((src, index) => (
        <SwiperSlide key={index} virtualIndex={index}>
          <Reel activeIndex={activeIndex} src={src} index={index} refs={refs} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

interface ReelProps {
  src: string;
  index: number;
  activeIndex: number;
  refs: RefObject<(HTMLVideoElement | null)[]>;
}

function Reel({ index, src, refs, activeIndex }: ReelProps) {
  const hlsRef = useRef<Hls | null>(null);

  useEffect(() => {
    const videoEl = refs.current?.[index];
    if (!videoEl) return;

    if (!hlsRef.current && index === activeIndex) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoEl);
        hlsRef.current = hls;
      }
    }

    if (index === activeIndex) {
      videoEl.play().catch(() => {});
    } else {
      videoEl.pause();
      hlsRef.current?.stopLoad();
    }

    return () => {
      if (Math.abs(activeIndex - index) > 1 && hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [index, activeIndex, refs, src]);

  const shouldPreload = Math.abs(activeIndex - index) <= 1;

  return (
    <video
      ref={(el) => {
        refs.current[index] = el;
      }}
      style={{
        width: "50%",
        height: "50%",
        objectFit: "contain",
        background: "#000",
      }}
      muted
      loop
      playsInline
      preload={shouldPreload ? "preload" : "none"}
      controls
    />
  );
}
