import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  parseSrt,
  stringifySrt,
  SrtSegment,
  parseResToMs,
} from "@/lib/srt-utils";
import { notifications } from "@mantine/notifications";

export function useSrtEditor(fileId: string) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<any>(null);
  const [segments, setSegments] = useState<SrtSegment[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!fileId) return;

    const loadFile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/file/${fileId}`);
        if (!res.ok) throw new Error("Failed to load file");

        const data = await res.json();
        if (data.error) throw new Error(data.error);

        setFile(data.file);

        const parsed = parseSrt(data.content);
        setSegments(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading file");
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [fileId]);

  // Save file
  const saveFile = useCallback(async () => {
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

      notifications.show({
        title: "Zapisano",
        message: "Plik został pomyślnie zapisany.",
        color: "green",
      });
    } catch (err) {
      notifications.show({
        title: "Błąd",
        message: "Nie udało się zapisać pliku.",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  }, [segments, fileId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        saveFile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [saveFile]);

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

  return {
    loading,
    error,
    file,
    segments,
    saving,
    saveFile,
    updateSegmentField,
  };
}
