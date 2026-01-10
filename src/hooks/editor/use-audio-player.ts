import { useRef, useState, useEffect } from "react";
import { SrtSegment } from "@/lib/srt-utils";

export function useAudioPlayer(segments: SrtSegment[]) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      const currentTimeMs = audio.currentTime * 1000;
      const index = segments.findIndex(
        (seg) =>
          seg.startTimeMs !== undefined &&
          seg.endTimeMs !== undefined &&
          currentTimeMs >= seg.startTimeMs &&
          currentTimeMs <= seg.endTimeMs
      );
      setActiveIndex((prev) => (prev !== index ? index : prev));
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
    };
  }, [segments]);

  const playSegment = (segment: SrtSegment) => {
    if (!audioRef.current || segment.startTimeMs === undefined) return;

    const currentTimeMs = audioRef.current.currentTime * 1000;
    const isInsideSegment =
      segment.endTimeMs !== undefined &&
      currentTimeMs >= segment.startTimeMs &&
      currentTimeMs <= segment.endTimeMs;

    if (isInsideSegment) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    } else {
      audioRef.current.currentTime = segment.startTimeMs / 1000;
      audioRef.current.play();
    }
  };

  return {
    audioRef,
    isPlaying,
    activeIndex,
    playSegment,
  };
}
