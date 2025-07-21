import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Calendr API",
  description: "Calendar scheduling API backend for React Native app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, padding: '2rem', backgroundColor: '#f5f5f5' }}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}