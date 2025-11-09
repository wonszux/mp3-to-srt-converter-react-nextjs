import {
  IconChevronDown,
  IconFileMusic,
  IconBrandZoom,
} from "@tabler/icons-react";
import {
  Box,
  Burger,
  Button,
  Center,
  Collapse,
  Divider,
  Drawer,
  Group,
  HoverCard,
  ScrollArea,
  SimpleGrid,
  Text,
  ThemeIcon,
  UnstyledButton,
  useMantineTheme,
  Image,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter } from "next/navigation";
import classes from "./HeaderMegaMenu.module.css";
import { authClient } from "@/lib/auth-client";

const mockdata = [
  {
    icon: IconFileMusic,
    title: "Transkrypcja plików dzwiękowych",
    description: "Transkrybuj pliki dzwiękowe.",
  },
  {
    icon: IconBrandZoom,
    title: "Transkrypcja rozmów na żywo",
    description: "Transkrybuj rozmowy na żywo.",
  },
];

export default function HeaderMegaMenu() {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);
  const [linksOpened, { toggle: toggleLinks }] = useDisclosure(false);
  const theme = useMantineTheme();
  const router = useRouter();
  const { data } = authClient.useSession();

  const signOut = async () => {
    await authClient.signOut();
    router.push("/");
    router.refresh();
  };

  const authButtons = data ? (
    <>
      <Button
        style={{ backgroundColor: "#c47f25ff" }}
        onClick={() => router.push("/user-panel")}
      >
        Panel Użytkownika
      </Button>
      <Button variant="default" onClick={signOut}>
        Wyloguj
      </Button>
    </>
  ) : (
    <>
      <Button
        variant="default"
        onClick={() => router.push("/log-in")}
        radius="md"
      >
        Logowanie
      </Button>
      <Button
        style={{ backgroundColor: "#c47f25ff" }}
        onClick={() => router.push("/create-account")}
        radius="md"
      >
        Rejestracja
      </Button>
    </>
  );

  const links = mockdata.map((item) => (
    <UnstyledButton className={classes.subLink} key={item.title}>
      <Group wrap="nowrap" align="flex-start">
        <ThemeIcon size={34} variant="default" radius="md">
          <item.icon size={22} color={theme.colors.orange[5]} />
        </ThemeIcon>
        <div>
          <Text size="sm" fw={500}>
            {item.title}
          </Text>
          <Text size="xs" c="dimmed">
            {item.description}
          </Text>
        </div>
      </Group>
    </UnstyledButton>
  ));

  return (
    <Box h={80}>
      <header className={classes.header}>
        <Group justify="space-between" h="100%" px="lg">
          <Image
            h={30}
            w="auto"
            fit="contain"
            src="/logo.svg"
            alt="Logo"
            onClick={() => router.push("/")}
          />
          <Group align="center" ml={25} visibleFrom="xl">
            <a href="#" className={classes.link}>
              Strona główna
            </a>
            <HoverCard
              width={600}
              position="bottom"
              radius="md"
              shadow="md"
              withinPortal
            >
              <HoverCard.Target>
                <a href="#" className={classes.link}>
                  <Center inline>
                    <Box component="span" mr={5}>
                      Aplikacje
                    </Box>
                    <IconChevronDown size={16} color={theme.colors.orange[4]} />
                  </Center>
                </a>
              </HoverCard.Target>
              <HoverCard.Dropdown
                style={{
                  overflow: "hidden",
                  width: "800px",
                  marginTop: "20px",
                }}
              >
                <Group justify="space-between" px="md">
                  <Text fw={500}>Aplikacje</Text>
                </Group>
                <Divider my="sm" />
                <SimpleGrid cols={2} spacing={0}>
                  {links}
                </SimpleGrid>
                <div className={classes.dropdownFooter}>
                  <Group justify="space-between">
                    <div>
                      <Text fw={500} fz="md">
                        Zacznij teraz
                      </Text>
                      <Text size="xs" c="dimmed">
                        Zacznij teraz transkrybować swoje pliki dzwiękowe lub
                        rozmowy na żywo.
                      </Text>
                    </div>
                    <Button
                      variant="default"
                      onClick={() => router.push("/create-account")}
                    >
                      Rejestracja
                    </Button>
                  </Group>
                </div>
              </HoverCard.Dropdown>
            </HoverCard>
            <a href="#" className={classes.link}>
              O nas
            </a>
            <a href="#" className={classes.link}>
              Szkolenia
            </a>
          </Group>
          <Group align="center" gap="md" visibleFrom="xl">
            {authButtons}
          </Group>

          <Group align="center" gap="md" visibleFrom="md" hiddenFrom="xl">
            {authButtons}
            <Burger opened={drawerOpened} onClick={toggleDrawer} />
          </Group>

          <Burger
            opened={drawerOpened}
            onClick={toggleDrawer}
            hiddenFrom="md"
          />
        </Group>
      </header>
      <Drawer
        opened={drawerOpened}
        onClose={closeDrawer}
        size="100%"
        padding="md"
        zIndex={1000000}
        hiddenFrom="lg"
      >
        <ScrollArea h="calc(100vh - 80px)" mx="-md">
          <Group px="md" py="sm">
            <Image
              h={30}
              w="auto"
              fit="contain"
              src="/logo.svg"
              alt="Logo"
              onClick={() => {
                router.push("/");
                closeDrawer();
              }}
            />
          </Group>
          <Divider my="sm" />
          <a href="#" className={classes.link}>
            Strona główna
          </a>
          <UnstyledButton className={classes.link} onClick={toggleLinks}>
            <Center inline>
              <Box component="span" mr={5}>
                Aplikacje
              </Box>
              <IconChevronDown size={16} />
            </Center>
          </UnstyledButton>
          <Collapse in={linksOpened}>{links}</Collapse>
          <a href="#" className={classes.link}>
            O nas
          </a>
          <a href="#" className={classes.link}>
            Szkolenia
          </a>
          <Divider my="sm" />
          {data ? (
            <Group justify="center" grow pb="xl" px="md">
              <Button
                style={{ backgroundColor: "#c47f25ff" }}
                onClick={() => {
                  router.push("/user-panel");
                  closeDrawer();
                }}
              >
                Panel Użytkownika
              </Button>
              <Button variant="default" onClick={signOut}>
                Wyloguj
              </Button>
            </Group>
          ) : (
            <Group justify="center" grow pb="xl" px="md">
              <Button
                variant="default"
                onClick={() => {
                  router.push("/log-in");
                  closeDrawer();
                }}
              >
                Logowanie
              </Button>
              <Button
                style={{ backgroundColor: "#c47f25ff" }}
                onClick={() => {
                  router.push("/create-account");
                  closeDrawer();
                }}
              >
                Rejestracja
              </Button>
            </Group>
          )}
        </ScrollArea>
      </Drawer>
    </Box>
  );
}
