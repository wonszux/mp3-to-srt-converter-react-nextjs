import { Stack } from "@mantine/core";
import { SrtSegment } from "@/lib/srt-utils";
import { SegmentItem } from "./SegmentItem";
import { RefObject } from "react";

interface SegmentListProps {
  segments: SrtSegment[];
  activeIndex: number;
  isPlaying: boolean;
  activeRef: RefObject<HTMLDivElement | null>;
  onPlay: (segment: SrtSegment) => void;
  onChange: (index: number, field: keyof SrtSegment, value: string) => void;
}

export function SegmentList({
  segments,
  activeIndex,
  isPlaying,
  activeRef,
  onPlay,
  onChange,
}: SegmentListProps) {
  return (
    <Stack gap={14}>
      {segments.map((segment, index) => (
        <SegmentItem
          key={index}
          index={index}
          segment={segment}
          isActive={activeIndex === index}
          isPlaying={isPlaying}
          activeRef={activeRef}
          onPlay={onPlay}
          onChange={onChange}
        />
      ))}
    </Stack>
  );
}
