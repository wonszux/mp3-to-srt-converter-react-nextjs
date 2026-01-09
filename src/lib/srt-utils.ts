export interface SrtSegment {
  id: string;
  startTime: string;
  endTime: string;
  text: string;
  startTimeMs?: number;
  endTimeMs?: number;
}

/**
 * konwertuje srt na tablice
 */
export function parseSrt(srtContent: string): SrtSegment[] {
  const normalized = srtContent.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const blocks = normalized.split("\n\n");
  const segments: SrtSegment[] = [];

  for (const block of blocks) {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l);
    if (lines.length < 3) continue;

    const id = lines[0];
    const timeLine = lines[1];

    const textLines = lines.slice(2);
    const text = textLines.join("\n");

    const timeMatch = timeLine.match(
      /(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/
    );
    if (timeMatch) {
      segments.push({
        id,
        startTime: timeMatch[1],
        endTime: timeMatch[2],
        text,
        startTimeMs: parseResToMs(timeMatch[1]),
        endTimeMs: parseResToMs(timeMatch[2]),
      });
    }
  }

  return segments;
}

/**
 * Konwertuje tablicę na SRT.
 */
export function stringifySrt(segments: SrtSegment[]): string {
  return segments
    .map((seg, index) => {
      return `${index + 1}\n${seg.startTime} --> ${seg.endTime}\n${seg.text}`;
    })
    .join("\n\n");
}

export function parseResToMs(timestamp: string): number {
  const parts = timestamp.split(/[:,]/);
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const seconds = parseInt(parts[2], 10);
  const ms = parseInt(parts[3], 10);
  return hours * 3600000 + minutes * 60000 + seconds * 1000 + ms;
}

export function msToTimestamp(ms: number): string {
  const date = new Date(ms);
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = ms % 1000;

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")},${milliseconds
    .toString()
    .padStart(3, "0")}`;
}
