import getProposalsByClanId from "@/services/clans/getProposalsByClanId";
import { useQuery } from "wagmi";

const useListProposal = (clanId: string) => {
  return useQuery(["proposals", clanId], getProposalsByClanId);
};

export default useListProposal;
