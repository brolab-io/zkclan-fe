import "./globals.css";
import Provider from "@/providers";
import { Inter } from "next/font/google";
import Navbar from "@/components/CommonUI/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "zkClan",
  description: "ZkClan - Satisfy all Nouns DAO private voting requirements.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <Navbar />
          <main className="pt-[100px]">{children}</main>
        </Provider>
      </body>
    </html>
  );
}
