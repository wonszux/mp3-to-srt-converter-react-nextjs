import { Container, Box, Progress, Text } from "@mantine/core";

// Trzeba to będzie zsychronizować z backendem
interface UsageProgressProps {
  usedMinutes: number;
  totalMinutes: number;
}

export default function UsageProgress({
  usedMinutes,
  totalMinutes,
}: UsageProgressProps) {
  const percentage = (usedMinutes / totalMinutes) * 100;
  const remainingMinutes = totalMinutes - usedMinutes;

  return (
    <Container mt="lg">
      <Box
        mt="md"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Progress value={percentage} w="30%" />
        <Text>
          Pozostało {remainingMinutes}/{totalMinutes} min
        </Text>
      </Box>
    </Container>
  );
}
