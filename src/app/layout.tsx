import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "@/app/app-provider";
import SlideSession from "@/components/slide-session";
import { baseOpenGraph } from "@/app/shared-metadata";
import { ChakraProvider } from "@chakra-ui/react";

import Header from "@/components/header";
import Footer from "@/components/footer";

const inter = Inter({ subsets: ["vietnamese"] });

export const metadata = {
  title: {
    template: "%s | Pickleballvn",
    default: "Pickleballvn",
  },
  description: "Pickleballvietnam.io",
  openGraph: baseOpenGraph,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <Toaster />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AppProvider>
            <ChakraProvider
              toastOptions={{ defaultOptions: { position: "top-right" } }}
            >
              {/* <Header/> */}
              <main>{children}</main>
              {/* <SlideSession /> */}
              {/* <Footer/> */}
            </ChakraProvider>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
