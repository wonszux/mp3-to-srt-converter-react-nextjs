import { Card, Text, Button, Group, Badge, Title, Stack } from "@mantine/core";

interface PlanCardProps {
  name: string;
  price: string;
  time: string;
  highlighted?: boolean;
}

export const PlanCard = ({ name, price, time, highlighted }: PlanCardProps) => {
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

      <Stack h={200} align="center" mb="xs" mt="xs" gap="xs">
        <Title order={2} fz="40" mt="md" ta="center">
          {time} min
        </Title>

        <Text size="md" ta="center">
          Transkrypcji miesięcznie
        </Text>

        <Title order={2} fz="40" mt="md" ta="center">
          {price} PLN
        </Title>
      </Stack>

      <Group justify="center">
        <Button variant="light" color="orange" fullWidth radius="xl">
          Wybierz
        </Button>
      </Group>
    </Card>
  );
};
