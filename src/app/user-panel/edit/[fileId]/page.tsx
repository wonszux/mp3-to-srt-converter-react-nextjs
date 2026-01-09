"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Title,
  Button,
  Group,
  Textarea,
  TextInput,
  Paper,
  Alert,
  Loader,
  Stack,
  ActionIcon,
  Text,
  Box,
  rem,
  Grid,
} from "@mantine/core";
import {
  IconDeviceFloppy,
  IconPlayerPlay,
  IconPlayerPause,
  IconArrowLeft,
  IconClock,
} from "@tabler/icons-react";
import {
  parseSrt,
  stringifySrt,
  SrtSegment,
  parseResToMs,
} from "@/lib/srt-utils";

export default function EditSrtPage() {
  const params = useParams();
  const router = useRouter();
  const fileId = params?.fileId as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<any>(null);
  const [segments, setSegments] = useState<SrtSegment[]>([]);
  const [saving, setSaving] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fileId) {
      loadFile();
    }
  }, [fileId]);

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
      setActiveIndex(index);
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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [segments]);

  useEffect(() => {
    if (activeIndex >= 0 && activeRef.current) {
    }
  }, [activeIndex]);

  const loadFile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/file/${fileId}`);
      if (!res.ok) throw new Error("Failed to load file");

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setFile(data.file);
      setAudioUrl(data.file.url);

      const parsed = parseSrt(data.content);
      setSegments(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading file");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      const content = stringifySrt(segments);

      const res = await fetch("/api/update-srt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileId, content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save");
      }

      const prevTitle = document.title;
      document.title = "Zapisano!";
      setTimeout(() => (document.title = prevTitle), 2000);
    } catch (err) {
      setError(
        "Błąd zapisu: " + (err instanceof Error ? err.message : "Unknown error")
      );
    } finally {
      setSaving(false);
    }
  };

  const updateSegmentField = (
    index: number,
    field: keyof SrtSegment,
    value: string
  ) => {
    const newSegments = [...segments];
    const segment = { ...newSegments[index], [field]: value };

    if (field === "startTime") {
      segment.startTimeMs = parseResToMs(value);

      if (index > 0) {
        const prev = newSegments[index - 1];
        if (
          prev.endTimeMs !== undefined &&
          segment.startTimeMs < prev.endTimeMs
        ) {
          prev.endTime = value;
          prev.endTimeMs = segment.startTimeMs;
          newSegments[index - 1] = prev;
        }
      }
    } else if (field === "endTime") {
      segment.endTimeMs = parseResToMs(value);

      if (index < newSegments.length - 1) {
        const next = newSegments[index + 1];
        if (
          next.startTimeMs !== undefined &&
          segment.endTimeMs > next.startTimeMs
        ) {
          next.startTime = value;
          next.startTimeMs = segment.endTimeMs;
          newSegments[index + 1] = next;
        }
      }
    }

    newSegments[index] = segment;
    setSegments(newSegments);
  };

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
      <Group mb="xl" justify="space-between" align="center">
        <Group gap="xs">
          <ActionIcon
            variant="transparent"
            color="gray"
            onClick={() => router.back()}
          >
            <IconArrowLeft />
          </ActionIcon>
          <Box>
            <Title order={3}>{file?.originalName || "Edycja"}</Title>
            <Text size="xs" c="dimmed">
              ID: {fileId?.slice(0, 8)}...
            </Text>
          </Box>
        </Group>

        <Button
          variant="light"
          color="orange"
          radius="md"
          leftSection={
            saving ? (
              <Loader size={12} color="orange" />
            ) : (
              <IconDeviceFloppy size={18} />
            )
          }
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Zapisywanie..." : "Zapisz"}
        </Button>
      </Group>

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
          src={audioUrl || ""}
          controls
          style={{ width: "100%", height: 36, display: "block" }}
          className="custom-audio-player"
        />
      </Paper>

      <Stack gap={0}>
        {segments.map((segment, index) => {
          const isActive = activeIndex === index;
          return (
            <Box
              key={index}
              ref={isActive ? activeRef : null}
              py="lg"
              style={{
                borderBottom: "1px solid var(--mantine-color-dark-6)",
                transition: "all 0.3s ease",
                backgroundColor: isActive
                  ? "rgba(255, 169, 3, 0.05)"
                  : "transparent", // Subtle orange tint
                borderLeft: isActive
                  ? "3px solid var(--mantine-color-orange-6)"
                  : "3px solid transparent",
                paddingLeft: isActive ? rem(16) : rem(8),
                paddingRight: rem(8),
              }}
            >
              <Grid align="start" gutter="md">
                <Grid.Col span={3}>
                  <Stack gap={4}>
                    <TextInput
                      variant="unstyled"
                      size="xs"
                      value={segment.startTime}
                      onChange={(e) =>
                        updateSegmentField(index, "startTime", e.target.value)
                      }
                      styles={{
                        input: {
                          fontFamily: "monospace",
                          color: isActive
                            ? "var(--mantine-color-orange-4)"
                            : "var(--mantine-color-dimmed)",
                        },
                      }}
                      leftSection={
                        <IconClock
                          size={12}
                          color={
                            isActive ? "var(--mantine-color-orange-4)" : "gray"
                          }
                        />
                      }
                    />
                    <TextInput
                      variant="unstyled"
                      size="xs"
                      value={segment.endTime}
                      onChange={(e) =>
                        updateSegmentField(index, "endTime", e.target.value)
                      }
                      styles={{
                        input: {
                          fontFamily: "monospace",
                          color: isActive
                            ? "var(--mantine-color-orange-4)"
                            : "var(--mantine-color-dimmed)",
                        },
                      }}
                      leftSection={
                        <IconClock
                          size={12}
                          color={
                            isActive ? "var(--mantine-color-orange-4)" : "gray"
                          }
                        />
                      }
                    />

                    <ActionIcon
                      variant="subtle"
                      color={isActive ? "orange" : "gray"}
                      size="sm"
                      onClick={() => playSegment(segment)}
                      style={{ opacity: isActive ? 1 : 0.5 }}
                    >
                      {isActive && isPlaying ? (
                        <IconPlayerPause size={14} />
                      ) : (
                        <IconPlayerPlay size={14} />
                      )}
                    </ActionIcon>
                  </Stack>
                </Grid.Col>

                {/* Text Column */}
                <Grid.Col span={9}>
                  <Textarea
                    variant="unstyled"
                    autosize
                    minRows={1}
                    value={segment.text}
                    onChange={(e) =>
                      updateSegmentField(index, "text", e.target.value)
                    }
                    styles={{
                      input: {
                        fontSize: rem(16),
                        lineHeight: 1.6,
                        padding: 0,
                        color: "var(--mantine-color-text)",
                      },
                    }}
                  />
                </Grid.Col>
              </Grid>
            </Box>
          );
        })}
      </Stack>
    </Container>
  );
}
