import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Policy Generator for Developers - Create Legal Policies Instantly",
  description:
    "Answer a few simple questions to generate essential legal policies like Privacy Policy and Terms of Service for your website/application.",
  keywords: [
    "policy generator",
    "privacy policy",
    "terms of service",
    "legal documents",
    "developers",
    "saas",
    "startup",
  ],
  authors: [{ name: "Mutlaq N. Aldhubaib", url: "https://mutlaq.dev" }],
  openGraph: {
    title: "Policy Generator for Developers",
    description:
      "Answer a few simple questions to generate essential legal policies for your website/application.",
    url: "https://policy-generator.com",
    siteName: "Policy Generator for Developers",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Policy Generator for Developers",
    description:
      "Answer a few simple questions to generate essential legal policies for your website/application.",
    creator: "@55i5",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <Header />
        <div className="flex-grow">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
