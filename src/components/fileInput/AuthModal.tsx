import { Modal, Group, Image } from "@mantine/core";
import RegisterForm from "../registerForm/registerForm";

interface AuthModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function AuthModal({ opened, onClose }: AuthModalProps) {
  return (
    <Modal
      withCloseButton={false}
      centered
      opened={opened}
      onClose={onClose}
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
        />
      </Group>
      <RegisterForm />
    </Modal>
  );
}
