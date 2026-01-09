export class TranscriptionService {
  private readonly baseUrl: string;

  constructor(baseUrl: string = "/api") {
    this.baseUrl = baseUrl;
  }

  // Rozpoczyna proces transkrypcji dla pliku
  async startTranscription(
    fileId: string,
    language?: string
  ): Promise<TranscriptionResult> {
    try {
      const response = await fetch(`${this.baseUrl}/transcribe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
          language: language === "auto" ? undefined : language,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Błąd transkrypcji");
      }

      return {
        success: true,
        fileId: result.fileId,
        srtUrl: result.srtUrl,
        language: result.language,
      };
    } catch (error) {
      console.error("Błąd podczas generowania transkrypcji:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Nieznany błąd",
      };
    }
  }

  // Zwraca URL do pobrania pliku SRT
  getDownloadUrl(fileId: string): string {
    return `${this.baseUrl}/download-srt?fileId=${fileId}`;
  }

  // Pobiera plik SRT jako Blob
  async downloadSrtFile(fileId: string): Promise<Blob> {
    const response = await fetch(this.getDownloadUrl(fileId));

    if (!response.ok) {
      throw new Error("Nie udało się pobrać pliku SRT");
    }

    return await response.blob();
  }

  // Inicjuje pobieranie pliku w przeglądarce
  async triggerDownload(fileId: string, filename?: string): Promise<void> {
    const blob = await this.downloadSrtFile(fileId);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || `${fileId}.srt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
  // Sprawdza status generowania srt
  async checkStatus(fileId: string): Promise<TranscriptionStatus> {
    try {
      const response = await fetch(
        `${this.baseUrl}/get-srt-url?fileId=${fileId}`
      );
      const result = await response.json();

      if (!response.ok) {
        return {
          status: "error",
          error: result.error || "Nie udało się sprawdzić statusu",
        };
      }

      return {
        status: result.status,
        srtUrl: result.srtUrl,
      };
    } catch (error) {
      return {
        status: "error",
        error: error instanceof Error ? error.message : "Błąd",
      };
    }
  }
}

export interface TranscriptionResult {
  success: boolean;
  fileId?: string;
  srtUrl?: string;
  language?: string;
  error?: string;
}

export interface TranscriptionStatus {
  status: string;
  srtUrl?: string;
  error?: string;
}

export const transcriptionService = new TranscriptionService();
