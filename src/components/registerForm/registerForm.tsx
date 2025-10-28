"use client";

import { useState } from "react";
import {
  Anchor,
  Button,
  Checkbox,
  Container,
  Group,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
  Stack,
} from "@mantine/core";

import classes from "./AuthenticationTitle.module.css";
import GoogleButton from "../googleButton/googleButton";
import { signUp } from "@/server/users";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUp(email, password, name);
      console.log("Rejestracja pomyślna!");
    } catch (error) {
      console.error("Błąd rejestracji:", error);
    } finally {
      setLoading(false);
      router.push("/user-panel");
    }
  };

  return (
    <Container size={420} my={40}>
      <Stack align="center" justify="center">
        <Title ta="center" className={classes.title}>
          Utwórz nowe konto!
        </Title>

        <Text className={classes.subtitle}>
          Masz już konto?{" "}
          <Anchor onClick={() => router.push("/log-in")}>Zaloguj się</Anchor>
        </Text>
      </Stack>

      <Paper withBorder shadow="sm" p={27} mt={30} radius="lg">
        <TextInput
          placeholder="Nazwa użytkownika"
          required
          radius="md"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          mb="md"
        />

        <TextInput
          placeholder="E-mail"
          required
          radius="md"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />

        <PasswordInput
          placeholder="Hasło"
          required
          mt="md"
          radius="md"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />

        <Group justify="space-between" mt="lg">
          <Checkbox label="Akceptuję warunki i zasady" />
          <Anchor component="button" size="sm">
            Więcej o RODO
          </Anchor>
        </Group>

        <Button
          fullWidth
          mt="xl"
          radius="md"
          onClick={handleSignUp}
          loading={loading}
        >
          Utwórz konto
        </Button>
        <GoogleButton />
      </Paper>
    </Container>
  );
}
