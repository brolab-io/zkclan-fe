"use client";

import Container from "@/components/CommonUI/Container";
import ListVotes from "@/components/Proposal/ListVotes";
import Vote from "@/components/Proposal/Vote";
import { getContractAddress } from "@/configs/contract";
import useClient from "@/hooks/useClient";
import useProposal from "@/hooks/useProposal";
import { Poll } from "@/types/Poll";
import { useChainId, useContractRead } from "wagmi";

type PageProps = {
  params: {
    proposalId: string;
  };
};

const ProposalPage: React.FC<PageProps> = ({ params: { proposalId } }) => {
  const isClient = useClient();
  const chainId = useChainId();
  const { data: proposal, isLoading } = useProposal(proposalId);
  const { data: onChainData } = useContractRead<any, any, Poll>({
    abi: [
      "function getPollDetailsById(uint256 _pollId) view returns (tuple(uint256 pollId, uint8 pollStatus, string title, address creator, uint256 quorum, uint256[] votes, uint256 createdAt))",
    ],
    address: getContractAddress(chainId, "voting"),
    functionName: "getPollDetailsById",
    args: [proposalId],
    enabled: !!proposalId && isClient,
  });

  if (!onChainData || !proposal) {
    return null;
  }
  const totalVotes = proposal.voteFors.length + proposal.voteAgainsts.length;

  console.log(proposal);

  return (
    <Container className="py-[85px] !max-w-[1200px] space-y-6">
      <h1 className="text-[32px] text-white font-semibold">{onChainData.title}</h1>
      <div className="bg-[#1A202C] rounded-[32px] px-[82px] py-[55px]">
        <div className="flex justify-between">
          <h2 className="text-white text-[26px] font-medium">List Of Votes</h2>
          <Vote proposalId={proposalId} />
        </div>
        <div className="grid md:grid-cols-2 mt-10 gap-[30px]">
          <ListVotes totalVotes={totalVotes} votes={proposal.voteFors} isVoteFor />
          <ListVotes totalVotes={totalVotes} votes={proposal.voteAgainsts} />
        </div>
      </div>
    </Container>
  );
};

export default ProposalPage;
