import { SimpleGrid, Container, Title } from "@mantine/core";
import { PlanCard } from "./planCard";

const plans = [
  {
    name: "Free",
    price: "0",
    time: "3",
  },
  {
    name: "Lite",
    price: "29",
    time: "60",
    highlighted: true,
  },
  {
    name: "Pro",
    price: "49",
    time: "600",
  },
];

export default function ProductSection() {
  return (
    <Container my={40}>
      <Title ta="center" order={2} mb="xl" style={{ fontSize: 34 }}>
        Najczęściej zadawane pytania
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        {plans.map((plan) => (
          <PlanCard key={plan.name} {...plan} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
