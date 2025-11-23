import { Card, Group, Flex, Text, ActionIcon } from "@mantine/core";
import { IconFileMusic, IconTrash } from "@tabler/icons-react";

interface UploadedFileCardProps {
  file: File;
  onRemove: () => void;
}

export default function UploadedFileCard({
  file,
  onRemove,
}: UploadedFileCardProps) {
  return (
    <Card padding="md" radius="lg" withBorder w="100%">
      <Group justify="space-between" wrap="nowrap">
        <Flex align="center" gap="md">
          <IconFileMusic size={40} />
          <div>
            <Text fw={600} lineClamp={1}>
              {file.name}
            </Text>
            <Text size="xs" c="dimmed">
              {(file.size / 1024).toFixed(1)} KB
            </Text>
          </div>
        </Flex>
        <ActionIcon variant="subtle" color="red" radius="lg" onClick={onRemove}>
          <IconTrash size={22} />
        </ActionIcon>
      </Group>
    </Card>
  );
}
