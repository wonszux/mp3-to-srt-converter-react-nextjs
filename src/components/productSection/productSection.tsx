import { SimpleGrid, Container, Title } from "@mantine/core";
import { IconCheck, IconRocket, IconMail } from "@tabler/icons-react";
import { PlanCard } from "./planCard";

const plans = [
  {
    name: "Free",
    price: "0",
    time: "5",
    features: [
      {
        title: "Priorytet",
        description: "Brak priorytetu dostępu",
        icon: IconCheck,
      },
      {
        title: "Prędkość",
        description: "Powolna transkrypcja",
        icon: IconRocket,
      },
      { title: "Wsparcie", description: "Brak wsparcia", icon: IconMail },
    ],
  },
  {
    name: "Lite",
    price: "29",
    time: "60",
    features: [
      {
        title: "Priorytet",
        description: "Wyższy priorytet dostępu",
        icon: IconCheck,
      },
      {
        title: "Prędkość",
        description: "Szybka transkrypcja",
        icon: IconRocket,
      },
      {
        title: "Wsparcie",
        description: "Wsparcie niepriorytetowe",
        icon: IconMail,
      },
    ],
    highlighted: true,
  },
  {
    name: "Pro",
    price: "49",
    time: "600",
    features: [
      {
        title: "Priorytet",
        description: "Najwyższy priorytet dostępu",
        icon: IconCheck,
      },
      {
        title: "Prędkość",
        description: "Najszybsza transkrypcja",
        icon: IconRocket,
      },
      {
        title: "Wsparcie",
        description: "Wsparcie priorytetowe",
        icon: IconMail,
      },
    ],
  },
];

export default function ProductSection() {
  return (
    <Container my={40}>
      <Title ta="center" order={2} mb="xl" fz="34">
        Poznaj naszą ofertę!
      </Title>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="lg">
        {plans.map((plan) => (
          <PlanCard key={plan.name} {...plan} />
        ))}
      </SimpleGrid>
    </Container>
  );
}
