import "@mantine/core/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
  createTheme,
} from "@mantine/core";
import ClientLayout from "@/components/appShell/ClientLayout";

export const metadata = {
  title: "My Mantine app",
  description: "I have followed setup instructions carefully",
};

const theme = createTheme({
  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#25262B",
      "#16191d",
      "#141517",
      "#101113",
    ],
  },
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" {...mantineHtmlProps} data-mantine-color-scheme="dark">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body>
        <MantineProvider
          defaultColorScheme="dark"
          forceColorScheme="dark"
          theme={theme}
        >
          <ClientLayout>{children}</ClientLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
