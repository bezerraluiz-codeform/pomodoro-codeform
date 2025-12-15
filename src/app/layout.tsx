import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { RuntimeEnvValidator } from "@/core/config/runtime-env-validator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pomodoro CodeForm",
  description: "Pomodoro CodeForm",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const envScriptSrc =
    process.env.NODE_ENV === "production"
      ? "/pomodoro-codeform/env.js"
      : "/env.js";

  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Script src={envScriptSrc} strategy="beforeInteractive" />
        <RuntimeEnvValidator />
        {children}
      </body>
    </html>
  );
}
