"use client";

import Breadcrumb from "@/components/CommonUI/Breadcrumb";
import Container from "@/components/CommonUI/Container";
import ListVotes from "@/components/Proposal/ListVotes";
import Vote from "@/components/Proposal/Vote";
import { getContractAddress } from "@/configs/contract";
import useClan from "@/hooks/useClan";
import useClient from "@/hooks/useClient";
import useProposal from "@/hooks/useProposal";
import { Poll } from "@/types/Poll";
import { useMemo } from "react";
import { useChainId, useContractRead } from "wagmi";

type PageProps = {
  params: {
    proposalId: string;
    clanId: string;
  };
};
const breadcrumbItems = [
  {
    label: "DAO",
    href: "/",
  },
];
const ProposalPage: React.FC<PageProps> = ({ params: { proposalId, clanId } }) => {
  const isClient = useClient();
  const chainId = useChainId();
  const { data: clan } = useClan(clanId);
  const { data: proposal, refetch: refetchProposal } = useProposal(proposalId);
  const { data: onChainData } = useContractRead<any, any, Poll>({
    abi: [
      "function getPollDetailsById(uint256 _pollId) view returns (tuple(uint256 pollId, uint8 pollStatus, string title, address creator, uint256 quorum, uint256[] votes, uint256 createdAt))",
    ],
    address: getContractAddress(chainId, "voting"),
    functionName: "getPollDetailsById",
    args: [proposalId],
    enabled: !!proposalId && isClient,
  });

  const _breadcrumbItems = useMemo(() => {
    const __breadcrumbItems = [...breadcrumbItems];
    if (clan) {
      __breadcrumbItems.push({
        label: clan.name,
        href: `/dao/${clanId}`,
      });
    }
    if (proposal) {
      __breadcrumbItems.push({
        label: proposal.title,
        href: `/dao/${clanId}/proposal/${proposalId}`,
      });
    }
    return __breadcrumbItems;
  }, [clan, proposal, clanId, proposalId]);

  if (!onChainData || !proposal) {
    return null;
  }
  const totalVotes = proposal.voteFors.length + proposal.voteAgainsts.length;

  return (
    <Container className="!max-w-[1200px]">
      <Breadcrumb items={_breadcrumbItems} />
      <div className="pb-[85px] space-y-6">
        <h1 className="text-[32px] text-white font-semibold">{onChainData.title}</h1>
        <div className="bg-[#1A202C] rounded-[32px] px-[82px] py-[55px]">
          <div className="flex justify-between">
            <h2 className="text-white text-[26px] font-medium">List Of Votes</h2>
            <Vote refresh={refetchProposal} proposalId={proposalId} />
          </div>
          <div className="grid md:grid-cols-2 mt-10 gap-[30px]">
            <ListVotes
              proposalId={proposalId}
              totalVotes={totalVotes}
              votes={proposal.voteFors}
              isVoteFor
            />
            <ListVotes
              proposalId={proposalId}
              totalVotes={totalVotes}
              votes={proposal.voteAgainsts}
            />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProposalPage;
