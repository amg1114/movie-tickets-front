import "../globals.css";
import { Metadata } from "next";
import { AuthProvider } from "@/_context/AuthContext";
import { inter, bungee } from "@/_ui/components/fonts";

export const metadata: Metadata = {
  title: "Movie Tickets",
  description: "by Alejandro Moreno",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${bungee.variable} font-inter bg-[#010102] text-white antialiased`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
