import { Button, Container, Text, Stack, Flex } from "@mantine/core";

export default function HeroContent() {
  return (
    <Container my={40}>
      <Stack>
        <Flex justify="center" align="center">
          <Text style={{ textAlign: "center", fontSize: 46, fontWeight: 700 }}>
            Twórz generatywne napisy przy pomocy <br />
            <span
              style={{
                background: "linear-gradient(90deg, orange, #e7a644ff)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textTransform: "uppercase",
                fontWeight: 900,
              }}
            >
              sztucznej inteligencji
            </span>
          </Text>
        </Flex>
        <Text style={{ textAlign: "center", maxWidth: 550, margin: "0 auto" }}>
          Transkrybuj audio na tekst za pomocą naszego narzędzia AI do
          transkrypcji. Ponad 120 języków i akcentów oraz ponad 60 formatów.
          Zacznij za darmo w kilku kliknięciach.
        </Text>
      </Stack>
    </Container>
  );
}
