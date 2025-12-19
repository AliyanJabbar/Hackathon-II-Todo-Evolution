import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import SmoothScroll from "@/components/providers/smooth-scroll";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hackathon Entry 2025",
  description: "Built with Next.js, Motion, and Lenis.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-slate-50 antialiased selection:bg-indigo-500/30`}>
        <SmoothScroll>
          <Navbar />
          <main className="flex min-h-screen flex-col overflow-hidden">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}