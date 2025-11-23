import { Flex, Text, Select, Alert, Button } from "@mantine/core";
import { IconCheck, IconAlertCircle } from "@tabler/icons-react";

interface TranscriptionControlsProps {
  language: string;
  onLanguageChange: (language: string) => void;
  transcribing: boolean;
  transcriptionResult: {
    success: boolean;
    srtUrl?: string;
    error?: string;
  } | null;
  onGenerateTranscription: () => void;
  onDownloadSrt: () => void;
}

export default function TranscriptionControls({
  language,
  onLanguageChange,
  transcribing,
  transcriptionResult,
  onGenerateTranscription,
  onDownloadSrt,
}: TranscriptionControlsProps) {
  return (
    <Flex direction="column" w="100%" gap="lg">
      <Flex direction="column" w="100%">
        <Text fw={600} mb={8}>
          Wybierz język napisów
        </Text>

        <Select
          radius="lg"
          size="md"
          w="100%"
          value={language}
          onChange={(val) => onLanguageChange(val || "auto")}
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
            <Text size="sm">Transkrypcja została ukończona pomyślnie!</Text>
          ) : (
            <Text size="sm">{transcriptionResult.error}</Text>
          )}
        </Alert>
      )}

      {transcriptionResult?.success ? (
        <Button w="100%" size="md" radius="md" onClick={onDownloadSrt}>
          Pobierz plik SRT
        </Button>
      ) : (
        <Button
          w="100%"
          size="md"
          radius="md"
          onClick={onGenerateTranscription}
          loading={transcribing}
          disabled={transcribing}
        >
          {transcribing ? "Generowanie..." : "Generuj"}
        </Button>
      )}
    </Flex>
  );
}
