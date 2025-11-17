Klasa Uzytkownik: Do modelowania użytkownika z bazy Supabase.

Właściwości: userid, email, planSubskrypcji (np. 'Lite', 'Pro' domyślnie: 'Free'), limitacje związane z planem, pozostale minuty, historia transkrypcji

Metody: pobierzHistorie(), sprawdzLimitMinut(), zmienHaslo(), zmienNazweUzytkownika()




Klasa Transkrypcja: Do reprezentowania pojedynczego zadania transkrypcji.

Właściwości: idZadania, idUzytkownika, status (np. 'oczekujące', 'w toku', 'zakończone', 'błąd'), plikWejsciowy, wynikowyPlikSrt, dataUtworzenia, czasTrwania, rozmiar.

Metody: assignTranscription(), SaveToDB(), getStatus(), generateDownloadLink(), EditTranscription().



Klasa Transkrybator: wrapper dla modelu Whisper.

Właściwości: idZadania, idUzytkownika, 

Metody: Transcribe(sciezkaPlikuAudio) (zwraca tekst i znaczniki czasu)