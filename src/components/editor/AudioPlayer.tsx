import { Paper } from "@mantine/core";
import { RefObject } from "react";

interface AudioPlayerProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  src: string | null;
}

export function AudioPlayer({ audioRef, src }: AudioPlayerProps) {
  return (
    <Paper
      shadow="lg"
      p="xs"
      radius="xl"
      pos="sticky"
      top={20}
      mb="xl"
      style={{
        zIndex: 99,
        background: "rgba(20, 21, 23, 0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <audio
        ref={audioRef}
        src={src || ""}
        controls
        style={{ width: "100%", height: 36, display: "block" }}
        className="custom-audio-player"
      />
    </Paper>
  );
}
