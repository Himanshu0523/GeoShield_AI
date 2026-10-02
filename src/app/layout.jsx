import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/context/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GeoShield AI",
  description: "Disaster Risk & Road Intelligence Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}