"use client";

import { Button, Container, Stack, Text, TextInput } from "@mantine/core";
import { IconFileDownload, IconLink } from "@tabler/icons-react";
import { useState } from "react";

export default function FileInput() {
  const [active, setActive] = useState("file");

  return (
    <Container
      style={{
        display: "flex",
        justifyContent: "center",
        border: "solid 1px gray",
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        alignItems: "center",
        borderRadius: 35,
      }}
    >
      <Stack>
        <Container
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Button
            variant="light"
            color={active === "file" ? "orange" : "gray"}
            onClick={() => setActive("file")}
            radius={6}
          >
            Prześlij plik
          </Button>
          <Button
            variant="light"
            color={active === "link" ? "orange" : "gray"}
            onClick={() => setActive("link")}
            radius={6}
          >
            Wklej link
          </Button>
        </Container>
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            border: "dashed 1px gray",
            minWidth: 913,
            minHeight: 300,
            borderRadius: 15,
            background: "#25262b",
          }}
        >
          {active === "file" ? (
            <Stack align="center" justify="center">
              <IconFileDownload size={50} />
              <Text>Kliknij lub przeciągnij plik, aby go przesłać</Text>
              <Button variant="outline" color="gray" radius={6}>
                Wybierz plik
              </Button>
            </Stack>
          ) : (
            <Stack align="center" justify="center">
              <IconLink size={50} />
              <TextInput placeholder="Wklej link" />
              <Button variant="outline" color="gray" radius={6}>
                Wklej link
              </Button>
            </Stack>
          )}
        </Container>
      </Stack>
    </Container>
  );
}
