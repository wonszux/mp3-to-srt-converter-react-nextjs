'use client'
import { Tabs, Container } from '@mantine/core'
import { IconPhoto, IconMessageCircle, IconSettings } from '@tabler/icons-react'

import UserHistory from '@/components/userPanel/userHistory'
import FileInput from '../fileInput/fileinput'

export default function userPanel() {
  return (
    <Tabs variant="outline" radius="md" p="md" defaultValue="transcription">
      <Tabs.List>
        <Tabs.Tab value="transcription" leftSection={<IconPhoto size={12} />}>
          Transkrypcja
        </Tabs.Tab>
        <Tabs.Tab value="history" leftSection={<IconMessageCircle size={12} />}>
          Historia
        </Tabs.Tab>
        <Tabs.Tab value="settings" leftSection={<IconSettings size={12} />}>
          Ustaiwenia
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel mt="xl" value="transcription">
        <Container>
          <FileInput />
        </Container>
      </Tabs.Panel>
      <Tabs.Panel value="history">
        <UserHistory />
      </Tabs.Panel>
      <Tabs.Panel value="settings">Settings tab content</Tabs.Panel>
    </Tabs>
  )
}
