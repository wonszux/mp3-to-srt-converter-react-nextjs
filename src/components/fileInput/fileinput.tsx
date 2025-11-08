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
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const ACCEPTED_AUDIO_MIME_TYPES = [
    "audio/mpeg",
    "audio/wav",
    "video/mp4",
    "video/x-msvideo",
    "video/quicktime",
  ];

  const handleFileUpload = (files: File[]) => {
    if (files.length > 0) {
      setLoading(true);
      console.log("Przyjęte pliki:", files);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setLoading(true);
      console.log("Link do przetworzenia:", urlInput);
    }
  };

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
            onDrop={handleFileUpload}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={50 * 1024 ** 2}
            accept={ACCEPTED_AUDIO_MIME_TYPES}
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
                  Kliknij lub przeciągnij, aby przesłać plik
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Dozwolone formaty to: MP3, MP4, WAV, AVI, MOV
                </Text>
              </div>
            </Group>
          </Dropzone>
        ) : (
          <Container
            w="100%"
            mih={300}
            bdrs={35}
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
                onChange={(event) => setUrlInput(event.currentTarget.value)}
                style={{ width: "80%", minWidth: 250, maxWidth: 600 }}
              />
              <Button
                variant="outline"
                color="gray"
                radius={6}
                onClick={handleUrlSubmit}
              >
                Generuj
              </Button>
            </Stack>
          </Container>
        )}
      </Stack>
    </Container>
  );
}
