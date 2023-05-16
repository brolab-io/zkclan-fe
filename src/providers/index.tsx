"use client";
import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum";
import { Web3Modal } from "@web3modal/react";
import { PropsWithChildren } from "react";
import { ToastContainer } from "react-toastify";
import { configureChains, createClient, WagmiConfig } from "wagmi";
import { polygonMumbai, evmosTestnet } from "wagmi/chains";
import CommitmentProvider from "./CommitmentProvider";

const chains = [polygonMumbai, evmosTestnet];
const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!;

const { provider } = configureChains(chains, [w3mProvider({ projectId })]);
const wagmiClient = createClient({
  autoConnect: true,
  connectors: w3mConnectors({ projectId, version: 1, chains }),
  provider,
});
const ethereumClient = new EthereumClient(wagmiClient, chains);

const Provider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <CommitmentProvider>{children}</CommitmentProvider>
      </WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      <ToastContainer />
    </>
  );
};

export default Provider;
