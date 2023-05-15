"use client";
import Button from "@/components/CommonUI/Button";
import Container from "@/components/CommonUI/Container";
import DaoInfo from "@/components/DAO/DaoInfo";
import ListProposal from "@/components/Proposal/ListProposal";
import useClan from "@/hooks/useClan";
import useListProposal from "@/hooks/useListProposal";
import { useRouter } from "next/navigation";

type PageProps = {
  params: {
    clanId: string;
  };
};

const DaoPage: React.FC<PageProps> = ({ params: { clanId } }) => {
  const { data, isLoading, error } = useClan(clanId);
  const router = useRouter();
  const { data: proposals, isLoading: isFetchingProposals } = useListProposal(clanId);

  const navigateToCreateProposal = () => {
    router.push(`/dao/${clanId}/create-proposal`);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    if (error instanceof Error) {
      return <div>Error: {error.message}</div>;
    }
    return <div>Error: {JSON.stringify(error)}</div>;
  }
  if (!data) {
    return <div>Not found</div>;
  }
  console.log("proposals", proposals);
  return (
    <Container className="py-[85px] !max-w-[1200px] space-y-6">
      <DaoInfo item={data} />
      <div className="bg-[#1A202C] rounded-2xl py-10">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-[22px] text-white px-10">Proposal List</h2>
          <Button onClick={navigateToCreateProposal} className="!rounded-lg mr-6 lg:mr-8 !py-2.5">
            Create proposal
          </Button>
        </div>
        <div className="mt-4">
          <ListProposal isLoading={isFetchingProposals} proposals={proposals} clanId={clanId} />
        </div>
      </div>
    </Container>
  );
};

export default DaoPage;
