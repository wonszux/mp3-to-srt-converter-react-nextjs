"use client";

import { useState } from "react";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Container,
  Stack,
  Group,
  Text,
} from "@mantine/core";
import { authClient } from "@/lib/auth-client";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { updateEmail } from "@/app/actions/user-actions";

export default function SettingsTab() {
  const { data: session } = authClient.useSession();

  // Email state
  const [newEmail, setNewEmail] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);

  const handleChangeEmail = async () => {
    if (!newEmail) return;
    setLoadingEmail(true);
    try {
      const result = await updateEmail(newEmail);

      if (result.success) {
        notifications.show({
          title: "Sukces",
          message: result.message,
          color: "green",
          icon: <IconCheck size={16} />,
        });
        setNewEmail("");
        // Reload to update session with new email
        window.location.reload();
      } else {
        notifications.show({
          title: "Błąd",
          message: result.message,
          color: "red",
          icon: <IconX size={16} />,
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Błąd",
        message: "Wystąpił błąd podczas zmiany adresu email.",
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      notifications.show({
        title: "Błąd",
        message: "Wypełnij wszystkie pola.",
        color: "red",
        icon: <IconX size={16} />,
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      notifications.show({
        title: "Błąd",
        message: "Hasła nie są identyczne.",
        color: "red",
        icon: <IconX size={16} />,
      });
      return;
    }

    setLoadingPassword(true);
    try {
      await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });
      notifications.show({
        title: "Sukces",
        message: "Hasło zostało zmienione.",
        color: "green",
        icon: <IconCheck size={16} />,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Błąd",
        message: "Nie udało się zmienić hasła. Sprawdź obecne hasło.",
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        {/* Email Section */}
        <Paper withBorder shadow="md" p="xl" radius="lg">
          <Title order={3} mb="md">
            Zmiana adresu email
          </Title>
          <Text c="dimmed" size="sm" mb="lg">
            Obecny email: {session?.user?.email}
          </Text>
          <Stack gap="md">
            <TextInput
              label="Nowy email"
              placeholder="twoj@nowy.email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.currentTarget.value)}
            />
            <Group justify="flex-end">
              <Button
                loading={loadingEmail}
                onClick={handleChangeEmail}
                radius="md"
              >
                Zmień email
              </Button>
            </Group>
          </Stack>
        </Paper>

        {/* Password Section */}
        <Paper withBorder shadow="md" p="xl" radius="lg">
          <Title order={3} mb="md">
            Zmiana hasła
          </Title>
          <Stack gap="md">
            <PasswordInput
              label="Obecne hasło"
              placeholder="Obecne hasło"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(event.currentTarget.value)
              }
            />
            <PasswordInput
              label="Nowe hasło"
              placeholder="Nowe hasło"
              value={newPassword}
              onChange={(event) => setNewPassword(event.currentTarget.value)}
            />
            <PasswordInput
              label="Potwierdź nowe hasło"
              placeholder="Potwierdź nowe hasło"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.currentTarget.value)
              }
            />
            <Group justify="flex-end">
              <Button
                loading={loadingPassword}
                onClick={handleChangePassword}
                radius="md"
              >
                Zmień hasło
              </Button>
            </Group>
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
