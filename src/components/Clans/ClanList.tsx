import Image from "next/image";
import Container from "../CommonUI/Container";

const ClanList = () => {
  return (
    <Container>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mg:gap-8 lg:gap-10">
        {Array(10)
          .fill(0)
          .map((_, i) => (
            <div key={i} className="bg-[#1A202C]/25 rounded-[16px] shadow">
              <Image
                className="w-full aspect-square rounded-[16px]"
                src="/assets/images/dao.png"
                width={317}
                height={317}
                quality={100}
                alt="Hatsuki DAO"
              />
              <div className="p-4">
                <h2 className="text-[18px]"></h2>
              </div>
            </div>
          ))}
      </div>
    </Container>
  );
};

export default ClanList;
