import {
  Group,
  Title,
  Text,
  Button,
  ActionIcon,
  Loader,
  Box,
} from "@mantine/core";
import { IconArrowLeft, IconDeviceFloppy } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

interface EditorHeaderProps {
  originalName?: string;
  fileId: string;
  saving: boolean;
  onSave: () => void;
}

export function EditorHeader({
  originalName,
  fileId,
  saving,
  onSave,
}: EditorHeaderProps) {
  const router = useRouter();

  return (
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
          <Title order={3}>{originalName || "Edycja"}</Title>
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
        onClick={onSave}
        disabled={saving}
      >
        {saving ? "Zapisywanie..." : "Zapisz"}
      </Button>
    </Group>
  );
}
