import { Container, Stack, Text, TextInput, Button } from "@mantine/core";
import { IconLink } from "@tabler/icons-react";
import { useState } from "react";

interface UrlInputSectionProps {
  onSubmit: (url: string) => void;
}

export default function UrlInputSection({ onSubmit }: UrlInputSectionProps) {
  const [urlInput, setUrlInput] = useState("");

  const handleSubmit = () => {
    if (urlInput.trim()) {
      onSubmit(urlInput);
    }
  };

  return (
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
          value={urlInput}
          onChange={(event) => setUrlInput(event.currentTarget.value)}
          style={{ width: "80%", minWidth: 250, maxWidth: 600 }}
        />
        <Button
          variant="outline"
          color="gray"
          radius={6}
          onClick={handleSubmit}
        >
          Generuj
        </Button>
      </Stack>
    </Container>
  );
}
