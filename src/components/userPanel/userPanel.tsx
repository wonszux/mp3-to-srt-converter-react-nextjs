'use client'
import { useState } from 'react'
import cx from 'clsx'
import { Checkbox, Group, ScrollArea, Table, Text } from '@mantine/core'
import classes from './TableSelection.module.css'

const data = [
  {
    id: '1',
    name: 'SRT nr1',
    job: '14.02.2025',
    email: 'Kiedyś byłem...',
  },
  {
    id: '2',
    name: 'SRT nr2',
    job: '13.02.2025',
    email: 'Bla bla bla....',
  },
  {
    id: '3',
    name: 'SRT nr3',
    job: '12.02.2025',
    email: 'henry@silkeater.io',
  },
  {
    id: '4',
    name: 'SRT nr4',
    job: '11.02.2025',
    email: 'bhorsefighter@gmail.com',
  },
  {
    id: '5',
    name: 'SRT nr5',
    job: '10.02.2025',
    email: 'jeremy@foot.dev',
  },
]

export default function UserPanel() {
  const [selection, setSelection] = useState(['1'])
  const toggleRow = (id: string) =>
    setSelection((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )

  const rows = data.map((item) => {
    const selected = selection.includes(item.id)
    return (
      <Table.Tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <Table.Td>
          <Checkbox checked={selection.includes(item.id)} onChange={() => toggleRow(item.id)} />
        </Table.Td>
        <Table.Td>
          <Group gap="sm">
            <Text size="sm" fw={500}>
              {item.name}
            </Text>
          </Group>
        </Table.Td>
        <Table.Td>{item.email}</Table.Td>
        <Table.Td>{item.job}</Table.Td>
      </Table.Tr>
    )
  })

  return (
    <ScrollArea>
      <Table miw={800} verticalSpacing="sm">
        <Table.Thead>
          <Table.Tr>
            <Table.Th w={40}></Table.Th>
            <Table.Th>Nazwa</Table.Th>
            <Table.Th>Wgląd</Table.Th>
            <Table.Th>Zarządzanie</Table.Th>
            <Table.Th>Opcje</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
    </ScrollArea>
  )
}
