import {
  Card,
  Text,
  ThemeIcon,
  Button,
  Group,
  Badge,
  Title,
  Stack,
  Divider,
  Container,
} from "@mantine/core";
import { IconProps } from "@tabler/icons-react";

interface PlanCardProps {
  name: string;
  price: string;
  time: string;
  features: { title: string; description: string; icon: React.FC<IconProps> }[];
  highlighted?: boolean;
}

export const PlanCard = ({
  name,
  price,
  time,
  features,
  highlighted,
}: PlanCardProps) => {
  return (
    <Card
      shadow={highlighted ? "lg" : "sm"}
      radius="xl"
      withBorder
      style={{
        borderColor: highlighted ? "#e2a93eff" : undefined,
        transform: highlighted ? "scale(1.05)" : undefined,
        transition: "all 0.2s ease",
      }}
    >
      <Badge size="md" color="orange">
        {name}
      </Badge>

      <Stack h={200} align="center" gap="sm">
        <Title order={2} fz="48" mt="sm" ta="center">
          {time} min
        </Title>

        <Text size="md" ta="center">
          Transkrypcji miesięcznie
        </Text>

        <Title order={2} fz="38" ta="center">
          {price} PLN
        </Title>
      </Stack>

      <Group justify="center">
        <Button variant="light" color="orange" fullWidth radius="xl" size="md">
          Wybierz
        </Button>
      </Group>

      <Group justify="center" align="center">
        <Divider size="xs" color="grey" w="80%" mt="xl" mx="auto" />
      </Group>

      <Stack mt="xl" gap="lg">
        {features.map((feature, index) => (
          <Group key={index}>
            <ThemeIcon variant="light" size="xl" radius="xl">
              <feature.icon color="orange" style={{ width: "70%", height: "70%" }} />
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={600} size="md">
                {feature.title}
              </Text>
              <Text size="md" c="dimmed">
                {feature.description}
              </Text>
            </Stack>
          </Group>
        ))}
      </Stack>
    </Card>
  );
};
