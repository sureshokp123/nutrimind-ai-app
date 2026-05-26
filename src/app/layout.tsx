import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriMeal Analyzer AI",
  description:
    "AI-powered nutrition tracking app with meal analysis, macro tracking, and meal history.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
