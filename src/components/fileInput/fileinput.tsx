import { Button, Container, Stack } from "@mantine/core";
import { IconFileDownload } from "@tabler/icons-react";

export default function FileInput() {
  return (
    <Container
      style={{
        maxWidth: 700,
        paddingTop: 20,
        paddingBottom: 20,
        justifyContent: "center",
        border: "solid 1px gray",
        alignItems: "center",
        borderRadius: 8,
      }}
    >
      <Stack>
        <Container>
          <Button variant="filled" color="dark">
            Learn more
          </Button>
          <Button variant="filled" color="gray">
            Learn more
          </Button>
        </Container>
        <Container
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            border: "dashed 1px gray",
            minWidth: 600,
            minHeight: 300,
            background: "#303030ff",
          }}
        >
          <IconFileDownload size={50} />
        </Container>
      </Stack>
    </Container>
  );
}
