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
