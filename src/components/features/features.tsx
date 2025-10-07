"use client";

import { IconGauge, IconEarScan, IconShieldLock } from "@tabler/icons-react";
import {
  Badge,
  Card,
  Container,
  Group,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import classes from "./FeaturesCards.module.css";

const mockdata = [
  {
    title: "Inteligentne przetwarzanie",
    description:
      "Nasze narzędzie wykorzystuje najnowsze modele AI, aby przetwarzać pliki nawet 5× szybciej niż tradycyjne rozwiązania. Wystarczy kilka kliknięć, a Twoje napisy są gotowe.",
    icon: IconEarScan,
  },
  {
    title: "Pełna prywatność",
    description:
      "Twoje pliki są bezpieczne. Wszystkie dane są szyfrowane i automatycznie usuwane po zakończeniu transkrypcji. Tylko Ty masz dostęp do wyników.",
    icon: IconShieldLock,
  },
  {
    title: "Błyskawiczne wyniki",
    description:
      "Nie trać czasu na ręczne przepisywanie. W kilka minut otrzymasz gotowy plik .srt, który możesz od razu użyć w dowolnym edytorze wideo lub na platformach takich jak YouTube.",
    icon: IconGauge,
  },
];

export default function FeaturesCards() {
  const theme = useMantineTheme();
  const features = mockdata.map((feature) => (
    <Card
      key={feature.title}
      shadow="md"
      radius="md"
      className={classes.card}
      padding="xl"
    >
      <feature.icon size={50} stroke={1.5} color={theme.colors.orange[4]} />
      <Text fz="lg" fw={500} className={classes.cardTitle} mt="md">
        {feature.title}
      </Text>
      <Text fz="sm" c="dimmed" mt="sm">
        {feature.description}
      </Text>
    </Card>
  ));

  return (
    <Container size="lg" py="xl">
      <Group justify="center">
        <Badge
          variant="filled"
          size="lg"
          style={{ backgroundColor: theme.colors.orange[6] }}
        >
          Szybko i bezpiecznie
        </Badge>
      </Group>

      <Title order={2} className={classes.title} ta="center" mt="sm">
        Zaufało nam już ponad 30 000 użytkowników!
      </Title>

      <Text c="dimmed" className={classes.description} ta="center" mt="md">
        Dzięki naszemu programowi do przesyłania możesz zaimportować plik z
        dowolnego miejsca, niezależnie od tego, czy jest to laptop, Dysk Google,
        YouTube czy Dropbox. Pierwsze 10 minut jest bezpłatne.
      </Text>

      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="xl" mt={50}>
        {features}
      </SimpleGrid>
    </Container>
  );
}
