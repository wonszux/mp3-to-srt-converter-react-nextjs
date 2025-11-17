Klasa Uzytkownik (User): Do modelowania użytkownika z bazy Supabase.

Właściwości: userid, email, planSubskrypcji (np. 'Lite', 'Pro' domyślnie: 'Free'), limitacje związane z planem, pozostale minuty, historia transkrypcji

Metody: pobierzHistorie(), sprawdzLimitMinut(),




Klasa Transkrypcja (lub ZadanieTranskrypcji): Do reprezentowania pojedynczego zadania transkrypcji.

Właściwości: idZadania, idUzytkownika, status (np. 'oczekujące', 'w toku', 'zakończone', 'błąd'), plikWejsciowy, wynikowyPlikSrt, dataUtworzenia, czasTrwania, rozmiar.

Metody: uruchomTranskrypcje(), zapiszDoBazy(), pobierzStatus(), generujLinkDoPobrania().



Klasa Transkrybator: wrapper dla modelu Whisper.

Metody: Transcribe(sciezkaPlikuAudio) (zwraca tekst i znaczniki czasu)