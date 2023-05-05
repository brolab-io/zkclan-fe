import Container from "@/components/CommonUI/Container";
import DaoInfo from "@/components/DAO/DaoInfo";
import ListProposal from "@/components/Proposal/ListProposal";

const DaoPage = () => {
  return (
    <Container className="py-[85px] !max-w-[1200px] space-y-6">
      <DaoInfo />
      <div className="bg-[#1A202C] rounded-2xl p-10">
        <h2 className="font-semibold text-[22px] text-white">Proposal List</h2>
        <div className="mt-4">
          <ListProposal />
        </div>
      </div>
    </Container>
  );
};

export default DaoPage;
