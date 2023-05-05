"use client";
import Button from "@/components/CommonUI/Button";
import Container from "@/components/CommonUI/Container";
import useClient from "@/hooks/useClient";
import { Poll } from "@/types/Poll";
import { useContractRead } from "wagmi";

type PageProps = {
  params: {
    proposalId: string;
  };
};

const ProposalPage: React.FC<PageProps> = ({ params: { proposalId } }) => {
  const isClient = useClient();
  const { data } = useContractRead<any, any, Poll>({
    abi: [
      "function getPollDetailsById(uint256 _pollId) view returns (tuple(uint256 pollId, uint8 pollStatus, string title, address creator, uint256 quorum, uint256[] votes, uint256 createdAt))",
    ],
    address: "0xb1b24576a8f7719E953A7273Dd1a0105735E707d",
    functionName: "getPollDetailsById",
    args: [proposalId],
    enabled: !!proposalId && isClient,
  });
  if (!data) {
    return null;
  }
  return (
    <Container className="py-[85px] !max-w-[1200px] space-y-6">
      <h1 className="text-[32px] text-white font-semibold">{data.title}</h1>
      <div className="bg-[#1A202C] rounded-[32px] px-[82px] py-[55px]">
        <div className="flex justify-between">
          <h2 className="text-white text-[26px] font-medium">List Of Votes</h2>
          <div className="flex gap-[13px]">
            <Button className="bg-[#1AC486] hover:bg-[#1AC486] !rounded-[16px]">Vote For</Button>
            <Button className="bg-[#F56565] hover:bg-[#F56565] !rounded-[16px]">
              Vote Against
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProposalPage;
