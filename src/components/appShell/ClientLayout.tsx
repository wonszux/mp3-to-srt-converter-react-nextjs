"use client";

import { ReactNode } from "react";
import { AppShell, Container } from "@mantine/core";
import Header from "../header/Header";

interface ClientLayoutProps {
  children: ReactNode;
}

export default function BasicAppShell({ children }: ClientLayoutProps) {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main>
        <Container size={"xl"}>{children}</Container>
      </AppShell.Main>
    </AppShell>
  );
}
