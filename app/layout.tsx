import { ReduxProvider } from "@/store/provider";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "./query.provider";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

const inter = Inter({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
});

export const metadata = {
  title: "Insights Nepal",
  description: "Twitter Data Visualization App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <html lang="en">
        <link rel="icon" href="logo.svg" sizes="any" />
        <body className={inter.className}>
          <ReduxProvider>{children}</ReduxProvider>
        </body>
        <ReactQueryDevtools initialIsOpen={false} />
      </html>
    </QueryProvider>
  );
}
