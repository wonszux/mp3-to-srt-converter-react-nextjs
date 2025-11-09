import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
  createTheme,
  MantineColorsTuple,
} from "@mantine/core";
import ClientLayout from "@/components/appShell/ClientLayout";

export const metadata = {
  title: "ConvertSRT",
};

const myColor: MantineColorsTuple = [
  "#fff8e1",
  "#ffefcb",
  "#ffdd9a",
  "#ffca64",
  "#ffba38",
  "#ffb01b",
  "#ffa903",
  "#e39500",
  "#cb8400",
  "#b07100",
];

const theme = createTheme({
  colors: {
    dark: [
      "#C1C2C5",
      "#A6A7AB",
      "#909296",
      "#5C5F66",
      "#373A40",
      "#2C2E33",
      "#000000ff",
      "#000000ff",
      "#141517",
      "#101113",
    ],
    myColor,
  },
  primaryColor: "myColor",
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
        <MantineProvider forceColorScheme="dark" theme={theme}>
          <ClientLayout>{children}</ClientLayout>
        </MantineProvider>
      </body>
    </html>
  );
}
