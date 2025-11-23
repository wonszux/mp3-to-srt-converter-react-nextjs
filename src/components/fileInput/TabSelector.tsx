import { Button, Container } from "@mantine/core";

interface TabSelectorProps {
  active: "file" | "link";
  onTabChange: (tab: "file" | "link") => void;
}

export default function TabSelector({ active, onTabChange }: TabSelectorProps) {
  return (
    <Container
      style={{
        display: "flex",
        gap: "10px",
      }}
    >
      <Button
        variant="light"
        color={active === "file" ? "orange" : "gray"}
        onClick={() => onTabChange("file")}
        radius={6}
      >
        Prześlij plik
      </Button>
      <Button
        variant="light"
        color={active === "link" ? "orange" : "gray"}
        onClick={() => onTabChange("link")}
        radius={6}
      >
        Wklej link
      </Button>
    </Container>
  );
}
