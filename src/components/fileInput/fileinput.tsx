"use client";

import {
  Button,
  Container,
  Stack,
  Text,
  TextInput,
  Group,
} from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconFileDownload, IconLink } from "@tabler/icons-react";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
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
        {active === "file" ? (
          <Dropzone
            onDrop={(files) => console.log("accepted files", files)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            accept={IMAGE_MIME_TYPE}
            //bg = asdasd
            w="100%"
            mih={300}
            radius={35}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              border: "dashed 1px gray",
            }}
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload
                  size={52}
                  color="var(--mantine-color-blue-6)"
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  size={52}
                  color="var(--mantine-color-red-6)"
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  size={52}
                  color="var(--mantine-color-dimmed)"
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Drag images here or click to select files
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Attach as many files as you like, each file should not exceed
                  5mb
                </Text>
              </div>
            </Group>
          </Dropzone>
        ) : (
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
          </Container>
        )}
      </Stack>
    </Container>
  );
}
