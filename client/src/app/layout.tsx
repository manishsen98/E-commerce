import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { getServerSession } from "next-auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "My Store",
  description: "Explore the Fastion Here",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className + " dark"}>
        <header>Header is here</header>
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
