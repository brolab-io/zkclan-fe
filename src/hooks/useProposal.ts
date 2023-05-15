import getProposalById from "@/services/clans/getProposalById";
import { useQuery } from "wagmi";

const useProposal = (id: string | number) => {
  return useQuery(["proposals", id], getProposalById);
};

export default useProposal;
