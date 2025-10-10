import { SimpleGrid, Container, Title } from "@mantine/core";
import { PlanCard } from "./planCard";

const plans = [
  {
    name: "Free",
    price: "0 zł / mies.",
    time: "20",
    features: ["20 minut transkrypcji mesięcznie"],
  },
  {
    name: "Lite",
    price: "49 zł / mies.",
    time: "60",
    features: ["60 minut transkrypcji mesięcznie"],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "99 zł / mies.",
    time: "600",
    features: ["60 minut transkrypcji mesięcznie"],
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
