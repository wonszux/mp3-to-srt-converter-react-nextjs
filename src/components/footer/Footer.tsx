import { Anchor, Container, Group, Image } from "@mantine/core";
import classes from "./FooterSimple.module.css";

const links = [
  { link: "#", label: "Kontakt" },
  { link: "#", label: "Polityka prywatności" },
  { link: "#", label: "Kariera" },
];

export function FooterSimple() {
  const items = links.map((link) => (
    <Anchor<"a">
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Image h={30} w="auto" fit="contain" src="/logo.svg" alt="Logo" />
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
