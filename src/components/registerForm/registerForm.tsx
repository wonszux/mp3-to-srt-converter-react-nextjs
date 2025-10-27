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

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      await signUp(email, password, name);
      console.log("Rejestracja pomyślna!");
    } catch (error) {
      console.error("Błąd rejestracji:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Stack align="center" justify="center">
        <Title ta="center" className={classes.title}>
          Utwórz nowe konto!
        </Title>

        <Text className={classes.subtitle}>
          Masz już konto? <Anchor>Zaloguj się</Anchor>
        </Text>
      </Stack>

      <Paper withBorder shadow="sm" p={27} mt={30} radius="lg">
        <TextInput
          label="Imię"
          placeholder="Twoje imię"
          required
          radius="md"
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          mb="md"
        />

        <TextInput
          label="Email"
          placeholder="jacek@ocieracz.com"
          required
          radius="md"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />

        <PasswordInput
          label="Hasło"
          placeholder="Wybierz bezpieczne hasło"
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
