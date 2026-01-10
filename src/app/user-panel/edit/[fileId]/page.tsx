"use client";

import { useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Container, Button, Alert, Loader } from "@mantine/core";
import { useSrtEditor } from "@/hooks/editor/use-srt-editor";
import { useAudioPlayer } from "@/hooks/editor/use-audio-player";
import { EditorHeader } from "@/components/editor/EditorHeader";
import { AudioPlayer } from "@/components/editor/AudioPlayer";
import { SegmentList } from "@/components/editor/SegmentList";

export default function EditSrtPage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params?.fileId as string;

  const {
    loading,
    error,
    file,
    segments,
    saving,
    saveFile,
    updateSegmentField,
  } = useSrtEditor(fileId);

  const { audioRef, isPlaying, activeIndex, playSegment } =
    useAudioPlayer(segments);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex >= 0 && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [activeIndex]);

  if (loading)
    return (
      <Container py="xl">
        <Loader color="orange" />
      </Container>
    );

  if (error)
    return (
      <Container py="xl">
        <Alert color="red" title="Błąd">
          {error}
        </Alert>
        <Button
          mt="md"
          onClick={() => router.back()}
          color="orange"
          variant="outline"
        >
          Wróć
        </Button>
      </Container>
    );

  return (
    <Container size="lg" py="xl" pb={100}>
      <EditorHeader
        originalName={file?.originalName}
        fileId={fileId}
        saving={saving}
        onSave={saveFile}
      />

      <AudioPlayer audioRef={audioRef} src={file?.url} />

      <SegmentList
        segments={segments}
        activeIndex={activeIndex}
        isPlaying={isPlaying}
        activeRef={activeRef}
        onPlay={playSegment}
        onChange={updateSegmentField}
      />
    </Container>
  );
}
