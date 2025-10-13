🧩 Wykorzystane technologie, narzędzia i języki programowania

🌐Języki Programowania

TypeScript
➡️ Języki używane w aplikacji React. TypeScript dodaje typowanie i zmniejsza liczbę błędów.

Python
➡️ Używany na serwerze Linux (AWS) do obsługi modelu Whisper, który przetwarza dźwięk na tekst.

📖 Frontend - biblioteki

React
➡️ Biblioteka do tworzenia interfejsów użytkownika w sposób komponentowy.

Mantine
➡️ Zestaw gotowych komponentów Reacta (przyciski, formularze, tabele) ułatwiający budowę nowoczesnego interfejsu.

Tabler
➡️ Zestaw gotowych Ikon.

🐍 Python – biblioteki

torch
➡️ Biblioteka PyTorch do obliczeń tensorowych i uruchamiania modeli AI na CPU/GPU.
➡️ W projekcie potrzebna do działania Whispera i WhisperX, przyspiesza przetwarzanie dźwięku.

whisperx
➡️ Rozszerzenie modelu OpenAI Whisper do dokładniejszej transkrypcji i wyrównywania napisów.
➡️ Służy do konwersji nagrań audio na tekst z zachowaniem synchronizacji czasowej.

pysrt
➡️ Biblioteka do pracy z plikami napisów .srt.
➡️ Umożliwia tworzenie, edycję i zapis transkrypcji w formacie kompatybilnym z odtwarzaczami wideo.

os
➡️ Pozwala na interakcję z systemem plików i środowiskiem operacyjnym.
➡️ Używana do zarządzania plikami audio, katalogami i ścieżkami.

🔐 Autoryzacja logowanie

Better Auth
➡️ Lekka biblioteka do obsługi logowania, sesji i integracji z Supabase.
➡️ Zapewnia bezpieczny dostęp użytkowników.

🗄️ Baza danych

Supabase
➡️ Open-source’owa platforma bazodanowa zbudowana na PostgreSQL.
➡️ Zapewnia API, autoryzację, storage i integrację z Drizzle ORM.
➡️ Służy do przechowywania danych użytkowników, zakładów i konfiguracji aplikacji.

Drizzle ORM
➡️ Lekki i typowany ORM dla TypeScript, używany do komunikacji z bazą danych Supabase (PostgreSQL).
➡️ Pozwala na bezpieczne i czytelne zapytania SQL bez potrzeby pisania ich ręcznie.
➡️ Zapewnia łatwe migracje i integrację z Supabase.

💰Obsługa Płatności

Stripe
➡️ Platforma płatnicza umożliwiająca obsługę subskrypcji, płatności jednorazowych i integrację z systemem autoryzacji.
➡️ W projekcie służy do zarządzania planami dostępu (lite, pro), obsługi faktur oraz integracji z panelem klienta (Stripe Customer Portal).

☁️ Hosting i infrastruktura

Vercel
➡️ Platforma do hostingu frontendu i automatycznego wdrażania aplikacji z GitHuba.

Amazon Web Services EC2 (Linux)
➡️ Serwer w chmurze uruchamiający środowisko z Pythonem i Whisperem do przetwarzania dźwięku.
🔊 AI i przetwarzanie audio

OpenAI Whisper
➡️ model uczenia maszynowego do rozpoznawania i transkrypcji mowy.
➡️ Działa lokalnie na serwerze Linux (AWS).

⚙️ Oprogramowanie i zależności systemowe

CUDA / cuDNN (opcjonalnie)
➡️ Sterowniki i biblioteki NVIDII przyspieszające obliczenia AI na GPU.

FFmpeg
➡️ Narzędzie do konwersji i przetwarzania plików audio/wideo dla Whispera.

Git / GitHub
➡️ System kontroli wersji i platforma do hostowania kodu źródłowego.

📦 Inne narzędzia

Node.js + npm
➡️ Środowisko do uruchamiania projektów JavaScript i instalacji paczek frontendowych.

Next.js (jeśli używany)
➡️ Framework oparty na React z obsługą server-side rendering i API Routes.
