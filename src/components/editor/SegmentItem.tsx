import {
  Paper,
  Group,
  TextInput,
  ActionIcon,
  Textarea,
  Stack,
  Text,
  Tooltip,
  Badge,
  CloseButton,
  Divider,
} from "@mantine/core";
import {
  IconPlayerPlayFilled,
  IconPlayerPauseFilled,
  IconClock,
} from "@tabler/icons-react";
import { SrtSegment } from "@/lib/srt-utils";
import { RefObject, memo } from "react";

interface SegmentItemProps {
  segment: SrtSegment;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  activeRef: RefObject<HTMLDivElement | null>;
  onPlay: (segment: SrtSegment) => void;
  onChange: (index: number, field: keyof SrtSegment, value: string) => void;
  onDelete?: (index: number) => void;
}

const TimeInput = ({
  value,
  onChange,
  active,
}: {
  value: string;
  onChange: (val: string) => void;
  active: boolean;
}) => (
  <TextInput
    variant="unstyled"
    value={value}
    onChange={(e) => onChange(e.currentTarget.value)}
    size="xs"
    w={82}
    styles={{
      input: {
        textAlign: "center",
        fontWeight: 500,
        color: active
          ? "var(--mantine-color-myColor-4)"
          : "var(--mantine-color-dimmed)",
        padding: 0,
        transition: "color 0.2s",
      },
    }}
  />
);

export const SegmentItem = memo(function SegmentItem({
  segment,
  index,
  isActive,
  isPlaying,
  activeRef,
  onPlay,
  onChange,
  onDelete,
}: SegmentItemProps) {
  return (
    <Paper
      ref={isActive ? activeRef : null}
      withBorder
      p="xl"
      radius="md"
      bg="black"
      shadow={isActive ? "md" : "none"}
    >
      <Stack gap="sm">
        <Group justify="space-between" align="center" gap="xs">
          <Group gap="xs">
            <Badge
              size="md"
              variant={isActive ? "light" : "light"}
              color={isActive ? "myColor" : "gray"}
              radius="md"
            >
              #{index + 1}
            </Badge>

            <Tooltip
              label={isPlaying && isActive ? "Pause" : "Play Segment"}
              withArrow
              position="right"
              openDelay={500}
            >
              <ActionIcon
                variant={isActive ? "light" : "subtle"}
                color={isActive ? "myColor" : "gray"}
                size="md"
                radius="xl"
                onClick={() => onPlay(segment)}
              >
                {isActive && isPlaying ? (
                  <IconPlayerPauseFilled size={14} />
                ) : (
                  <IconPlayerPlayFilled size={14} />
                )}
              </ActionIcon>
            </Tooltip>
          </Group>

          <Group gap={6} px="xs" py={2}>
            <TimeInput
              value={segment.startTime}
              onChange={(val) => onChange(index, "startTime", val)}
              active={isActive}
            />
            <Text c="dimmed" size="xs">
              -{">"}
            </Text>
            <TimeInput
              value={segment.endTime}
              onChange={(val) => onChange(index, "endTime", val)}
              active={isActive}
            />
          </Group>
        </Group>
        <Divider />
        <Textarea
          variant="light"
          autosize
          minRows={2}
          radius="md"
          value={segment.text}
          onChange={(e) => onChange(index, "text", e.currentTarget.value)}
        />

        {onDelete && (
          <CloseButton
            style={{ position: "absolute", top: 5, right: 5, opacity: 0.5 }}
            onClick={() => onDelete(index)}
            size="sm"
          />
        )}
      </Stack>
    </Paper>
  );
});
