"use client";
import Container from "@/components/CommonUI/Container";
import { Poll } from "@/types/Poll";
import { useContractRead } from "wagmi";

type PageProps = {
  params: {
    proposalId: string;
  };
};

const ProposalPage: React.FC<PageProps> = ({ params: { proposalId } }) => {
  const { data } = useContractRead<any, any, Poll>({
    abi: [
      "function getAllPolls(uint256) view returns (tuple(uint256 pollId, uint8 pollStatus, string title, address creator, uint256 quorum, uint256[] votes, uint256 createdAt))",
    ],
    address: "0xb1b24576a8f7719E953A7273Dd1a0105735E707d",
    functionName: "getAllPolls",
    args: [proposalId],
  });
  console.log(data);
  return (
    <Container className="py-[85px] !max-w-[1200px] space-y-6">
      <h1></h1>
    </Container>
  );
};

export default ProposalPage;
