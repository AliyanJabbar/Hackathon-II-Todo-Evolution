import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ClientLayout from "./clientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TaskGenie",
  description:
    "todo application to manage your tasks by drag and drop",
  keywords: [
    "Todo App",
    "Drag & Drop todo",
    "Tasks",
    "Kanbanboard",
  ],
  authors: [{ name: "Aliyan Jabbar" }],
  creator: "Aliyan Jabbar",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-slate-950 text-slate-50 antialiased selection:bg-indigo-500/30`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
