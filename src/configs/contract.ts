import { useChainId, useNetwork } from "wagmi";
import { polygonMumbai } from "wagmi/chains";

const CONTRACT = {
  [polygonMumbai.id]: {
    VOTING_CONTRACT: "0xb1b24576a8f7719E953A7273Dd1a0105735E707d",
  },
};

export const useVotingAddress = () => {
  const id = useChainId();
  if (!id) return null;
  if (!CONTRACT.hasOwnProperty(id)) return null;
  return CONTRACT[id as keyof typeof CONTRACT].VOTING_CONTRACT;
};

export const useExplorerURL = (type: string, address: string | null) => {
  const network = useNetwork();

  if (network.chain?.blockExplorers?.default.url && address) {
    return `${network.chain.blockExplorers.default.url}/${type}/${address}`;
  }
  return "#";
};

const contractAddresses = {
  ageCheck: {
    // Harmony
    "1666700000": "0x190C816f1D91E5D0f231bF9cF750066783bD8C43", // testnet
    // Polygon
    "80001": "0x841a8095c99762Ac3cdBFda59a31af5ae8C2101D", // testnet
  },
  voting: {
    // Polygon
    "80001": "0x7F4fB1448D3d8a72e312Bab54368Ad1D4FF10a52",
    // Harmony Devnet
    "1666900000": "0xC0fD6B7D04858b6C1B90Bac369b18c4B5424A0d0",
  },
} as const;

export const getContractAddress = (id: number, type: keyof typeof contractAddresses) => {
  if (!contractAddresses[type]) {
    throw new Error(`Contract type ${type} not found`);
  }
  const chainId = id.toString() as keyof (typeof contractAddresses)[typeof type];
  if (!contractAddresses[type][chainId]) {
    throw new Error(`Contract address not found for chain ${chainId}`);
  }
  return contractAddresses[type][chainId];
};
