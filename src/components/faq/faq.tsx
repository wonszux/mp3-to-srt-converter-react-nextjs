"use client";

import { Accordion, Container, Title } from "@mantine/core";
import classes from "./FaqSimple.module.css";

export default function Faq() {
  return (
    <Container size="sm" className={classes.wrapper} py="sm">
      <Title ta="center" className={classes.title}>
        Frequently Asked Questions
      </Title>

      <Accordion variant="separated">
        <Accordion.Item className={classes.item} value="supported-formats">
          <Accordion.Control>
            Jakie formaty plików audio są obsługiwane?
          </Accordion.Control>
          <Accordion.Panel>
            Obsługujemy większość popularnych formatów, takich jak MP3, WAV,
            M4A, AAC, OGG i FLAC. Możesz też wkleić link z YouTube lub przesłać
            nagranie z Dysku Google, Dropboxa czy komputera.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="languages">
          <Accordion.Control>
            Czy mogę transkrybować nagrania w różnych językach?
          </Accordion.Control>
          <Accordion.Panel>
            Tak! Nasze narzędzie rozpoznaje ponad 120 języków i akcentów, w tym
            polski, angielski, niemiecki, hiszpański, francuski i wiele innych.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="accuracy">
          <Accordion.Control>
            Jak dokładna jest transkrypcja AI?
          </Accordion.Control>
          <Accordion.Panel>
            Dokładność zależy od jakości nagrania, ale w większości przypadków
            sięga 95–99%. System automatycznie rozpoznaje pauzy i interpunkcję,
            dzięki czemu napisy wyglądają naturalnie.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="privacy">
          <Accordion.Control>
            Czy moje nagrania są bezpieczne?
          </Accordion.Control>
          <Accordion.Panel>
            Tak. Wszystkie pliki są szyfrowane, a po zakończeniu transkrypcji
            automatycznie usuwane z serwera. Nie udostępniamy żadnych danych
            stronom trzecim.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="pricing">
          <Accordion.Control>
            Czy mogę skorzystać z darmowej wersji?
          </Accordion.Control>
          <Accordion.Panel>
            Tak! Pierwsze 10 minut transkrypcji jest całkowicie darmowe. Potem
            możesz wybrać plan, który najlepiej odpowiada Twoim potrzebom.
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item className={classes.item} value="export">
          <Accordion.Control>
            W jakich formatach mogę pobrać napisy?
          </Accordion.Control>
          <Accordion.Panel>
            Możesz eksportować napisy w formacie <code>.srt</code>,{" "}
            <code>.vtt</code> lub <code>.txt</code>. Wystarczy jedno kliknięcie,
            by pobrać gotowy plik.
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
