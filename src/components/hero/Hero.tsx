import {
  Button,
  Container,
  Box,
  Text,
  Title,
  SimpleGrid,
  Stack,
} from "@mantine/core";

export default function HeroContentLeft() {
  return (
    <Container my={40}>
      <Stack>
        <Title order={2}>Generator plików SRT</Title>
        <Text>Description for title 1</Text>
        <Button variant="outline">Learn more</Button>
      </Stack>
    </Container>
  );
}
