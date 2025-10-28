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
import { signIn } from "@/server/users";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email] = useState("");
  const [password] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await signIn(email, password, rememberMe);
    } catch (error) {
      console.error("Błąd podczas logowania: ", error);
    } finally {
      setLoading(false);
      router.push("/user-panel");
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
          <Anchor onClick={() => router.push("/create-account")}>
            Utwórz konto
          </Anchor>
        </Text>
      </Stack>

      <Paper withBorder shadow="sm" p={27} mt={30} radius="lg">
        <TextInput placeholder="jacek@ocieracz.com" required radius="md" />
        <PasswordInput placeholder="Twoje hasło" required mt="md" radius="md" />
        <Group justify="space-between" mt="lg">
          <Checkbox
            label="Zapamiętaj mnie"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.currentTarget.checked)}
          />
          <Anchor component="button" size="sm">
            Zapomniałeś hasła?
          </Anchor>
        </Group>
        <Button
          fullWidth
          mt="xl"
          radius="md"
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
