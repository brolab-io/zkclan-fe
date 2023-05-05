"use client";
import Image from "next/image";
import Button from "./Button";
import Link from "next/link";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import useClient from "@/hooks/useClient";

const Navbar = () => {
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const isClient = useClient();

  const handleConnect = () => {
    if (isConnected) {
      return disconnect();
    }
    connect({
      connector: new InjectedConnector(),
      chainId: polygonMumbai.id,
    });
  };

  return (
    <nav className="h-[100px] fixed inset-x-0 bg-[#1A202C]">
      <div className="flex items-center justify-between flex-1 h-full px-[26px]">
        <Link href="/" className="flex items-center gap-[11px]">
          <Image src="/logo.png" alt="logo" className="w-[52px] h-[45px]" width={104} height={90} />
          <span className="font-semibold text-[24px] text-white">
            zk<span className="text-[#5C8AED]">Clan</span>
          </span>
        </Link>
        {isClient && (
          <Button onClick={handleConnect}>
            {address ? address.slice(0, 6) + "..." + address.slice(-4) : "Connect your wallet"}
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
