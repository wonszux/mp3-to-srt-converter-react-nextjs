"use client";

import { Container, Stack, Flex } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { transcriptionService } from "@/lib/transcription-service";

import AuthModal from "./AuthModal";
import TabSelector from "./TabSelector";
import FileUploadZone from "./FileUploadZone";
import UrlInputSection from "./UrlInputSection";
import UploadedFileCard from "./UploadedFileCard";
import TranscriptionControls from "./TranscriptionControls";
import UsageProgress from "./UsageProgress";

export default function FileInput() {
  const [active, setActive] = useState<"file" | "link">("file");
  const [loading, setLoading] = useState(false);
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

  const handleUrlSubmit = (url: string) => {
    setLoading(true);
    console.log("Link do przetworzenia:", url);
    setTimeout(() => {
      setLoading(false);
      open();
    }, 2000);
  };

  const handleGenerateTranscription = async () => {
    if (!fileId) {
      alert("Brak ID pliku. Prześlij plik ponownie.");
      return;
    }

    setTranscribing(true);
    setTranscriptionResult(null);

    try {
      const result = await transcriptionService.startTranscription(
        fileId,
        language
      );

      setTranscriptionResult(result);
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

  const handleDownloadSrt = async () => {
    if (!fileId) {
      alert("Brak ID pliku");
      return;
    }

    try {
      const res = await fetch(`/api/download-srt?fileId=${fileId}`);

      if (!res.ok) {
        alert("Nie można pobrać pliku.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileId}.srt`;
      a.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Błąd pobierania SRT:", err);
      alert("Wystąpił błąd podczas pobierania pliku.");
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setFileId(null);
    setTranscriptionResult(null);
  };

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
          <TabSelector active={active} onTabChange={setActive} />

          {active === "file" ? (
            !uploadedFile ? (
              <FileUploadZone
                onFileUpload={handleFileUpload}
                loading={loading}
              />
            ) : (
              <Flex direction="column" w="100%" gap="lg">
                <UploadedFileCard
                  file={uploadedFile}
                  onRemove={handleRemoveFile}
                />
                <TranscriptionControls
                  language={language}
                  onLanguageChange={setLanguage}
                  transcribing={transcribing}
                  transcriptionResult={transcriptionResult}
                  onGenerateTranscription={handleGenerateTranscription}
                  onDownloadSrt={handleDownloadSrt}
                />
              </Flex>
            )
          ) : (
            <UrlInputSection onSubmit={handleUrlSubmit} />
          )}
        </Stack>

        {data && <UsageProgress usedMinutes={2.5} totalMinutes={5} />}
      </Container>

      <AuthModal opened={opened} onClose={close} />
    </>
  );
}
