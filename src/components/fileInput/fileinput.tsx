"use client";

import { Button, Container, Stack, Text, TextInput } from "@mantine/core";
import { IconFileDownload, IconLink } from "@tabler/icons-react";
import { useState } from "react";

export default function FileInput() {
  const [active, setActive] = useState("file");

  return (
    <Container
      p={20}
      bdrs={50}
      style={{
        border: "solid 1px #444",
      }}
    >
      <Stack align="center">
        {" "}
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
          w="100%"
          mih={300}
          bdrs={35}
          bg="#181818ff"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "dashed 1px gray",
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
            <Stack align="center" justify="center" w="100%" p="md">
              <IconLink size={50} />
              <Text>Wklej link, a następnie kliknij "Generuj"</Text>
              <TextInput
                placeholder="np. https://www.youtube.com/watch?v=wCVwD..."
                radius={30}
                size="md"
                style={{ width: "80%", minWidth: 250, maxWidth: 600 }}
              />
              <Button variant="outline" color="gray" radius={6}>
                Generuj
              </Button>
            </Stack>
          )}
        </Container>
      </Stack>
    </Container>
  );
}
