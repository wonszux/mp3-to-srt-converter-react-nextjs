"use client";

import { useState, useEffect } from "react";
import {
  Group,
  Text,
  Accordion,
  Box,
  Pagination,
  ActionIcon,
  Tooltip,
  Loader,
  Alert,
} from "@mantine/core";
import {
  IconDownload,
  IconEdit,
  IconTrash,
  IconAlertCircle,
} from "@tabler/icons-react";

interface TranscribedFile {
  id: string;
  originalName: string;
  srtUrl: string;
  transcriptionPreview: string;
  fullContent: string;
  createdAt: string;
}

interface AccordionLabelProps {
  label: string;
  description: string;
}

function AccordionLabel({ label, description }: AccordionLabelProps) {
  return (
    <Group wrap="nowrap">
      <Text fw={500}>{label}</Text>
      <Text size="sm" c="dimmed" fw={400}>
        {description}
      </Text>
    </Group>
  );
}

interface UserHistoryProps {
  userId: string;
}

function UserHistory({ userId }: UserHistoryProps) {
  const [files, setFiles] = useState<TranscribedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    if (userId) {
      fetchTranscribedFiles();
    }
  }, [userId]);

  const fetchTranscribedFiles = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/transcribed-files?userId=${userId}`);

      if (!response.ok) {
        throw new Error("Nie udało się pobrać plików");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Błąd podczas pobierania plików");
      }

      setFiles(data.files || []);
    } catch (err) {
      console.error("Błąd podczas pobierania plików:", err);
      setError(err instanceof Error ? err.message : "Nieznany błąd");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const response = await fetch(`/api/download-srt?fileId=${fileId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Nie udało się pobrać pliku");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Usuń rozszerzenie z nazwy i dodaj .srt
      const nameWithoutExt = fileName.replace(/\.[^/.]+$/, "");
      a.download = `${nameWithoutExt}.srt`;

      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Błąd podczas pobierania:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Nie udało się pobrać pliku SRT"
      );
    }
  };

  const handleEdit = (fileId: string) => {
    // TODO: Implementacja edycji - np. przekierowanie do edytora
    console.log("Edytuj plik:", fileId);
    alert(`Edycja pliku ${fileId} - funkcja do implementacji`);
  };

  const handleDelete = async (fileId: string) => {
    if (
      !confirm(
        "Czy na pewno chcesz usunąć ten plik? Ta operacja jest nieodwracalna."
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/delete-file?fileId=${fileId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Nie udało się usunąć pliku");
      }

      // Usuń plik z lokalnego stanu
      setFiles(files.filter((f) => f.id !== fileId));

      // Jeśli usunęliśmy ostatni element na stronie, cofnij stronę
      const newFilesCount = files.length - 1;
      const newTotalPages = Math.ceil(newFilesCount / itemsPerPage);
      if (activePage > newTotalPages && newTotalPages > 0) {
        setActivePage(newTotalPages);
      }
    } catch (error) {
      console.error("Błąd podczas usuwania:", error);
      alert(
        error instanceof Error ? error.message : "Nie udało się usunąć pliku"
      );
    }
  };

  // Paginacja
  const totalPages = Math.ceil(files.length / itemsPerPage);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFiles = files.slice(startIndex, endIndex);

  if (loading) {
    return (
      <Box p="md" m="md" mx="120px">
        <Group justify="center" py="xl">
          <Loader size="lg" />
          <Text>Ładowanie przetranskrybowanych plików...</Text>
        </Group>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p="md" m="md" mx="120px">
        <Alert icon={<IconAlertCircle size={16} />} title="Błąd" color="red">
          {error}
        </Alert>
      </Box>
    );
  }

  if (files.length === 0) {
    return (
      <Box p="md" m="md" mx="120px">
        <Alert
          icon={<IconAlertCircle size={16} />}
          title="Brak plików"
          color="blue"
        >
          Nie masz jeszcze żadnych przetranskrybowanych plików. Prześlij i
          przetranskrybuj swój pierwszy plik audio!
        </Alert>
      </Box>
    );
  }

  const items = currentFiles.map((item) => (
    <Box key={item.id} mb="md">
      <Accordion chevronPosition="right" variant="contained" radius="md">
        <Accordion.Item value={item.id}>
          <Accordion.Control aria-label={item.originalName}>
            <AccordionLabel
              label={item.originalName}
              description={item.transcriptionPreview}
            />
          </Accordion.Control>
          <Accordion.Panel>
            <Box>
              <Text size="sm" mb="md" style={{ whiteSpace: "pre-wrap" }}>
                {item.fullContent}
              </Text>

              <Group gap="xs" mt="md">
                <Tooltip label="Pobierz plik SRT">
                  <ActionIcon
                    variant="light"
                    color="blue"
                    size="lg"
                    onClick={() => handleDownload(item.id, item.originalName)}
                  >
                    <IconDownload size={18} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Edytuj transkrypcję">
                  <ActionIcon
                    variant="light"
                    color="yellow"
                    size="lg"
                    onClick={() => handleEdit(item.id)}
                  >
                    <IconEdit size={18} />
                  </ActionIcon>
                </Tooltip>

                <Tooltip label="Usuń plik">
                  <ActionIcon
                    variant="light"
                    color="red"
                    size="lg"
                    onClick={() => handleDelete(item.id)}
                  >
                    <IconTrash size={18} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Box>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Box>
  ));

  return (
    <Box p="md" m="md" mx="120px">
      <Text size="xl" fw={700} mb="lg">
        Historia transkrypcji ({files.length})
      </Text>

      {items}

      {totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            value={activePage}
            onChange={setActivePage}
            total={totalPages}
            size="md"
            withEdges
          />
        </Group>
      )}
    </Box>
  );
}

export default UserHistory;
