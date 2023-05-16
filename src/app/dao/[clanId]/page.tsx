"use client";
import Breadcrumb from "@/components/CommonUI/Breadcrumb";
import Button from "@/components/CommonUI/Button";
import Container from "@/components/CommonUI/Container";
import DaoInfo from "@/components/DAO/DaoInfo";
import ListProposal from "@/components/Proposal/ListProposal";
import useClan from "@/hooks/useClan";
import useListProposal from "@/hooks/useListProposal";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

type PageProps = {
  params: {
    clanId: string;
  };
};

const breadcrumbItems = [
  {
    label: "DAO",
    href: "/",
  },
];

const DaoPage: React.FC<PageProps> = ({ params: { clanId } }) => {
  const { data, isLoading, error } = useClan(clanId);
  const router = useRouter();
  const { data: proposals, isLoading: isFetchingProposals } = useListProposal(clanId);

  const navigateToCreateProposal = () => {
    router.push(`/dao/${clanId}/create-proposal`);
  };

  const _breadcrumbItems = useMemo(() => {
    if (!data) {
      return breadcrumbItems;
    }
    return [
      ...breadcrumbItems,
      {
        label: data.name,
        href: `/dao/${clanId}`,
      },
    ];
  }, [clanId, data]);

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
  return (
    <Container className="!max-w-[1200px]">
      <Breadcrumb items={_breadcrumbItems} />
      <div className="pb-20 space-y-6">
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
      </div>
    </Container>
  );
};

export default DaoPage;
