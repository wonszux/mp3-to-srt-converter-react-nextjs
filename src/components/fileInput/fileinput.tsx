"use client";

import {
  Button,
  Container,
  Stack,
  Text,
  TextInput,
  Group,
  Modal,
  Image,
  Progress,
  Box,
  Card,
  Flex,
  Select,
  ActionIcon,
  Alert,
} from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { useDisclosure } from "@mantine/hooks";
import {
  IconFileMusic,
  IconLink,
  IconTrash,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { useState } from "react";
import RegisterForm from "../registerForm/registerForm";
import { authClient } from "@/lib/auth-client";

export default function FileInput() {
  const [active, setActive] = useState("file");
  const [loading, setLoading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [opened, { open, close }] = useDisclosure(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);
  const [language, setLanguage] = useState("auto");
  const [transcribing, setTranscribing] = useState(false);
  const [transcriptionResult, setTranscriptionResult] = useState<{
    success: boolean;
    srtUrl?: string;
    error?: string;
  } | null>(null);

  const { data } = authClient.useSession();

  const ACCEPTED_AUDIO_MIME_TYPES = [
    "audio/mpeg",
    "audio/wav",
    "video/mp4",
    "video/x-msvideo",
    "video/quicktime",
  ];

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setLoading(true);
    const fileToUpload = files[0];

    if (!data?.user?.id) {
      console.warn(
        "Użytkownik nie jest zalogowany. Otwieram modal rejestracji."
      );
      setTimeout(() => {
        setLoading(false);
        open();
      }, 1000);
      return;
    }

    const userId = data.user.id;
    const formData = new FormData();
    formData.append("file", fileToUpload);
    formData.append("userId", userId);

    // const { data, error } = await supabase.storage
    // .from("uploads")
    // .download(uploadedFile.name);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Błąd przesyłania: ${response.statusText}`);
      }

      const result = await response.json();
      console.log("Przesyłanie zakończone sukcesem:", result);
      setUploadedFile(fileToUpload);
      setFileId(result.id);
      setTranscriptionResult(null);
    } catch (error) {
      console.error("Wystąpił błąd podczas wysyłania pliku:", error);
      alert("Wystąpił błąd podczas przesyłania pliku.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTranscription = async () => {
    if (!fileId) {
      alert("Brak ID pliku. Prześlij plik ponownie.");
      return;
    }

    setTranscribing(true);
    setTranscriptionResult(null);

    try {
      const response = await fetch("/api/transcribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
          language: language === "auto" ? undefined : language,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Błąd transkrypcji");
      }

      setTranscriptionResult({
        success: true,
        srtUrl: result.srtUrl,
      });

      console.log("Transkrypcja zakończona:", result);
    } catch (error) {
      console.error("Błąd podczas generowania transkrypcji:", error);
      setTranscriptionResult({
        success: false,
        error: error instanceof Error ? error.message : "Nieznany błąd",
      });
    } finally {
      setTranscribing(false);
    }
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      setLoading(true);
      console.log("Link do przetworzenia:", urlInput);
      setTimeout(() => {
        setLoading(false);
        open();
      }, 2000);
    }
  };

  const fileInfo = uploadedFile ? (
    <Flex direction="column" w="100%" gap="lg">
      <Card padding="md" radius="lg" withBorder w="100%">
        <Group justify="space-between" wrap="nowrap">
          <Flex align="center" gap="md">
            <IconFileMusic size={40} />
            <div>
              <Text fw={600} lineClamp={1}>
                {uploadedFile.name}
              </Text>
              <Text size="xs" c="dimmed">
                {(uploadedFile.size / 1024).toFixed(1)} KB
              </Text>
            </div>
          </Flex>
          <ActionIcon
            variant="subtle"
            color="red"
            radius="lg"
            onClick={() => {
              setUploadedFile(null);
              setFileId(null);
              setTranscriptionResult(null);
            }}
          >
            <IconTrash size={22} />
          </ActionIcon>
        </Group>
      </Card>

      <Flex direction="column" w="100%">
        <Text fw={600} mb={8}>
          Wybierz język napisów
        </Text>

        <Select
          radius="lg"
          size="md"
          w="100%"
          value={language}
          onChange={(val) => setLanguage(val || "auto")}
          data={[
            { value: "auto", label: "Wykrywanie automatyczne" },
            { value: "pl", label: "Polski" },
            { value: "en", label: "Angielski" },
            { value: "de", label: "Niemiecki" },
          ]}
          disabled={transcribing}
        />
      </Flex>

      {transcriptionResult && (
        <Alert
          icon={
            transcriptionResult.success ? (
              <IconCheck size={16} />
            ) : (
              <IconAlertCircle size={16} />
            )
          }
          title={transcriptionResult.success ? "Sukces!" : "Błąd"}
          color={transcriptionResult.success ? "green" : "red"}
          radius="md"
        >
          {transcriptionResult.success ? (
            <>
              <Text size="sm">Transkrypcja została ukończona pomyślnie!</Text>
              {transcriptionResult.srtUrl && (
                <Button
                  component="a"
                  href={transcriptionResult.srtUrl}
                  target="_blank"
                  size="xs"
                  mt="sm"
                  variant="light"
                  // onClick={}
                >
                  Pobierz plik SRT
                </Button>
              )}
            </>
          ) : (
            <Text size="sm">{transcriptionResult.error}</Text>
          )}
        </Alert>
      )}

      <Button
        w="100%"
        size="md"
        radius="md"
        onClick={handleGenerateTranscription}
        loading={transcribing}
        disabled={transcribing}
      >
        {transcribing ? "Generowanie..." : "Generuj"}
      </Button>
    </Flex>
  ) : null;

  return (
    <>
      <Container
        p={20}
        bdrs={50}
        style={{
          border: "solid 1px #444",
        }}
      >
        <Stack align="center">
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
            !uploadedFile ? (
              <Dropzone
                onDrop={handleFileUpload}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={50 * 1024 ** 2}
                accept={ACCEPTED_AUDIO_MIME_TYPES}
                loading={loading}
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
              <Stack w="100%">{fileInfo}</Stack>
            )
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
                <Text>Wklej link, a następnie kliknij &quot;Generuj&quot;</Text>
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
        {data ? (
          <Container mt="lg">
            <Box
              mt="md"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Progress value={50} w="30%" />
              <Text>Pozostało 2.5/5 min</Text>
            </Box>
          </Container>
        ) : null}
      </Container>
      <Modal
        withCloseButton={false}
        centered
        opened={opened}
        onClose={close}
        radius="lg"
        lockScroll={false}
        styles={{
          content: {
            border: "1px solid var(--mantine-color-gray-8)",
          },
        }}
      >
        <Group pt={30} justify="center" mb="md">
          <Image
            h={40}
            w="auto"
            fit="contain"
            src="/logo.svg"
            alt="Logo"
            opacity={0.8}
          ></Image>
        </Group>
        <RegisterForm />
      </Modal>
    </>
  );
}
