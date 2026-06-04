import type { Metadata } from "next";
import { Orbitron, Rajdhani, Fira_Code, Inter } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const firaCode = Fira_Code({
  variable: "--font-fira-code",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kishan S | AI Operating System",
  description:
    "Cinematic futuristic portfolio of Kishan S — AI Engineer, Machine Learning Developer, and Cybersecurity Enthusiast.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${rajdhani.variable} ${firaCode.variable} ${inter.variable} h-full scroll-smooth dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-[#050505] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
