"use client";
import { Tabs, Container } from "@mantine/core";
import { IconBubbleText, IconBook, IconSettings } from "@tabler/icons-react";
import { authClient } from "@/lib/auth-client";

import UserHistory from "@/components/userPanel/userHistory";
import FileInput from "../fileInput/fileinput";

export default function UserPanel() {
  const { data } = authClient.useSession();

  return (
    <Tabs variant="outline" radius="md" p="md" defaultValue="transcription">
      <Tabs.List>
        <Tabs.Tab
          value="transcription"
          leftSection={<IconBubbleText size={12} />}
        >
          Transkrypcja
        </Tabs.Tab>
        <Tabs.Tab value="history" leftSection={<IconBook size={12} />}>
          Historia
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings size={12} />}>
          Ustawienia
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel mt="xl" value="transcription">
        <Container>
          <FileInput />
        </Container>
      </Tabs.Panel>

      <Tabs.Panel value="history">
        {data ? (
          <UserHistory userId={data.user.id} />
        ) : (
          <Container>Ładowanie...</Container>
        )}
      </Tabs.Panel>

      <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
    </Tabs>
  );
}
