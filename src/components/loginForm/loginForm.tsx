"use client";

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
import { useState } from "react";

import classes from "./AuthenticationTitle.module.css";
import GoogleButton from "../googleButton/googleButton";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
      });

      if (error) {
        throw error;
      }

      router.push("/user-panel");
      router.refresh();
    } catch (error: any) {
      console.error("Błąd podczas logowania: ", error);
      const message = error.message || "Wystąpił nieznany błąd.";
      if (
        message.includes("Invalid email") ||
        message.includes("Invalid password") ||
        message.includes("Invalid credentials")
      ) {
        setError("Nieprawidłowy e-mail lub hasło.");
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Stack align="center" justify="center">
        <Title ta="center" className={classes.title}>
          Witaj Ponownie!
        </Title>

        <Text className={classes.subtitle}>
          Nie masz jeszcze konta?{" "}
          <Anchor c="orange" onClick={() => router.push("/create-account")}>
            Utwórz konto
          </Anchor>
        </Text>
      </Stack>

      <Paper withBorder shadow="sm" p={27} mt={30} radius="lg">
        {error && (
          <Text c="red" size="sm" ta="center" mt="md">
            {error}
          </Text>
        )}
        <TextInput
          placeholder="jacek@ocieracz.com"
          required
          radius="md"
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
        />
        <PasswordInput
          placeholder="Twoje hasło"
          required
          mt="md"
          radius="md"
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
        <Group justify="space-between" mt="lg">
          <Checkbox
            label="Zapamiętaj mnie"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.currentTarget.checked)}
          />
          <Anchor component="button" size="sm" color="orange">
            Zapomniałeś hasła?
          </Anchor>
        </Group>
        <Button
          size="md"
          fullWidth
          mt="xl"
          radius="xl"
          onClick={handleSignIn}
          loading={loading}
        >
          Zaloguj się
        </Button>
        <GoogleButton />
      </Paper>
    </Container>
  );
}
