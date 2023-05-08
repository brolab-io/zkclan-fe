import "./globals.css";
import "react-toastify/dist/ReactToastify.css";
import Provider from "@/providers";
import { Inter } from "next/font/google";
import Navbar from "@/components/CommonUI/Navbar";
import WrongNetworkModal from "@/components/CommonUI/WrongNetwork";
import AgeCheck from "@/components/DAO/AgeCheck";

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
          <WrongNetworkModal />
          <AgeCheck />
        </Provider>
      </body>
    </html>
  );
}
