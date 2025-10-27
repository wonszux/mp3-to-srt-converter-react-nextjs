import { signInGoogle } from "@/lib/auth-client";
import { Button } from "@mantine/core";
import { IconBrandGoogleFilled } from "@tabler/icons-react";

export default function GoogleButton() {
  return (
    <Button
      fullWidth
      mt="sm"
      radius="md"
      leftSection={<IconBrandGoogleFilled size={20} />}
      variant="default"
      // onClick={() => signInGoogle()}
    >
      Zaloguj się przez Google
    </Button>
  );
}
