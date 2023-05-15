"use client";
import Image from "next/image";
import Container from "../CommonUI/Container";
import useListClans from "@/hooks/useListClans";
import useClient from "@/hooks/useClient";
import Button from "../CommonUI/Button";
import Link from "next/link";

const ClanList = () => {
  const isClient = useClient();

  const { data } = useListClans();

  if (!isClient) {
    return null;
  }

  return (
    <Container className="mt-4 md:mt-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mg:gap-8 lg:gap-10">
        {(data || []).map((item, i) => (
          <Link href={`/dao/${item.id}`} key={i} className="bg-[#1A202C] rounded-[16px] shadow">
            <Image
              className="w-full aspect-square rounded-[16px]"
              src={item.image}
              width={317}
              height={317}
              quality={100}
              alt={item.name}
            />
            <div className="p-4 space-y-2.5">
              <h2 className="text-lg font-bold text-[#ffffff]">{item.name}</h2>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#718096]">Member</span>
                <span className="text-[#5c8aed]">1</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[#718096]">Treasury</span>
                <span className="text-[#5c8aed]">
                  <span className="text-white">0</span> ZK
                </span>
              </div>
              <Button className="!rounded-[15px] w-full">Join</Button>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  );
};

export default ClanList;
