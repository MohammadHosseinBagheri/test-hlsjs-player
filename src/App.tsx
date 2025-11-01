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
  const bufListenerRef = useRef<() => void>(null);

  const shouldInit = index === activeIndex || index === activeIndex + 1;
  const shouldFullyPlay = index === activeIndex;

  useEffect(() => {
    hlsRef.current?.on(Hls.Events.BUFFER_APPENDED, () => {
      const buffered = refs.current[index]?.buffered;
      console.log("Buffer ranges:", buffered);
    });
    const videoEl = refs.current?.[index];
    if (!videoEl) return;

    if (shouldInit && hlsRef.current === null) {
      // console.log("render", hlsRef.current);

      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoEl);
        hlsRef.current = hls;

        if (index === activeIndex + 1) {
          bufListenerRef.current = () => {
            const buf = videoEl.buffered;
            console.log({ buf, index });

            if (buf.length > 0 && buf.end(0) >= 2) {
              videoEl.pause();
              hls.stopLoad();
            }
          };
          hls.on(Hls.Events.BUFFER_APPENDED, bufListenerRef.current);
        }

        if (shouldFullyPlay) {
          videoEl.play().catch(() => {});
        }
      }
    } else if (hlsRef.current) {
      console.log("reedner", index);

      if (shouldFullyPlay) {
        console.log({ index, activeIndex });
        hlsRef.current.off(Hls.Events.BUFFER_APPENDED, bufListenerRef.current);

        hlsRef.current.startLoad();
        hlsRef.current.resumeBuffering();
        videoEl.play().catch(() => {});
      }
      if (index === activeIndex - 1) {
        videoEl.pause();
        hlsRef.current.stopLoad();
      }
    }

    return () => {
      // if (bufListenerRef.current && hlsRef.current) {
      //   hlsRef.current.off(Hls.Events.BUFFER_APPENDED, bufListenerRef.current);
      //   bufListenerRef.current = null;
      // }

      if (Math.abs(activeIndex - index) > 1 && hlsRef.current) {
        console.log({ activeIndex });

        hlsRef.current.stopLoad();
        hlsRef.current.detachMedia();
        hlsRef.current.destroy();
        hlsRef.current = null;
        videoEl.src = "";
      }
    };
  }, [index, activeIndex, refs, src, shouldInit, shouldFullyPlay]);

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
        // pointerEvents: "none",
      }}
      muted
      loop
      playsInline
      preload={shouldPreload ? "metadata" : "none"}
      controls
    />
  );
}
