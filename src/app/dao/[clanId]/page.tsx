import Container from "@/components/CommonUI/Container";
import DaoInfo from "@/components/DAO/DaoInfo";
import ListProposal from "@/components/Proposal/ListProposal";

type PageProps = {
  params: {
    clanId: string;
  };
};

const DaoPage: React.FC<PageProps> = ({ params: { clanId } }) => {
  return (
    <Container className="py-[85px] !max-w-[1200px] space-y-6">
      <DaoInfo />
      <div className="bg-[#1A202C] rounded-2xl py-10">
        <h2 className="font-semibold text-[22px] text-white px-10">Proposal List</h2>
        <div className="mt-4">
          <ListProposal clanId={clanId} />
        </div>
      </div>
    </Container>
  );
};

export default DaoPage;
