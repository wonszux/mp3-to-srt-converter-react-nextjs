import {
  Card,
  Text,
  Button,
  Group,
  List,
  ListItem,
  Badge,
} from "@mantine/core";

interface PlanCardProps {
  name: string;
  price: string;
  time: string;
  features: string[];
  highlighted?: boolean;
}

export const PlanCard = ({
  name,
  price,
  features,
  time,
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

      <Text size="lg" ta="center" mb="md">
        {price}
      </Text>

      <List spacing="xs" mb="md">
        {features.map((feature, i) => (
          <ListItem key={i}>{feature}</ListItem>
        ))}
      </List>

      <Group justify="center">
        <Button variant="light" color="orange">
          Wybierz
        </Button>
      </Group>
    </Card>
  );
};
