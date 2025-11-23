import { Dropzone } from "@mantine/dropzone";
import { Group, Text } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";

interface FileUploadZoneProps {
  onFileUpload: (files: File[]) => void;
  loading: boolean;
}

const ACCEPTED_AUDIO_MIME_TYPES = [
  "audio/mpeg",
  "audio/wav",
  "video/mp4",
  "video/x-msvideo",
  "video/quicktime",
];

export default function FileUploadZone({
  onFileUpload,
  loading,
}: FileUploadZoneProps) {
  return (
    <Dropzone
      onDrop={onFileUpload}
      onReject={(files) => console.log("rejected files", files)}
      maxSize={50 * 1024 ** 2}
      accept={ACCEPTED_AUDIO_MIME_TYPES}
      loading={loading}
      w="100%"
      mih={300}
      radius={35}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        border: "dashed 1px gray",
      }}
    >
      <Group
        justify="center"
        gap="xl"
        mih={220}
        style={{ pointerEvents: "none" }}
      >
        <Dropzone.Accept>
          <IconUpload
            size={52}
            color="var(--mantine-color-blue-6)"
            stroke={1.5}
          />
        </Dropzone.Accept>
        <Dropzone.Reject>
          <IconX size={52} color="var(--mantine-color-red-6)" stroke={1.5} />
        </Dropzone.Reject>
        <Dropzone.Idle>
          <IconPhoto
            size={52}
            color="var(--mantine-color-dimmed)"
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            Kliknij lub przeciągnij, aby przesłać plik
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Dozwolone formaty to: MP3, MP4, WAV, AVI, MOV
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}
