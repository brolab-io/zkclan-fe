"use client";
import Image from "next/image";
import Button from "../CommonUI/Button";
import Link from "next/link";
import { getContractAddress, useExplorerURL, useVotingAddress } from "@/configs/contract";
import { formatAddress } from "@/utils/string";
import { TClan } from "@/types/TClan";
import { useChainId } from "wagmi";

type Props = {
  item: TClan;
};

const DaoInfo: React.FC<Props> = ({ item }) => {
  const chainId = useChainId();
  const votingAddress = getContractAddress(chainId, "voting");
  const votingExplorerURL = useExplorerURL("address", votingAddress);
  return (
    <div className="grid md:grid-cols-3 gap-[30px]">
      <div className="flex p-8 md:col-span-2 gap-14 bg-[#1A202C] rounded-[32px]">
        <Image
          className="aspect-square w-[317px] h-[317px]"
          src={item.image}
          width={317}
          height={317}
          quality={100}
          alt={item.name}
        />
        <div className="space-y-[18px]">
          <h1 className="text-[32px] font-semibold text-white">{item.name}</h1>
          <Button className="px-4 py-1.5 text-[14px]" disabled>
            Status: Openned
          </Button>
          <p className="text-[#FFFFFF]/60">{item.description}</p>
          <div />
          <Button className="disabled:bg-[#2D3748] rounded-[15px] w-full" disabled>
            Joined
          </Button>
        </div>
      </div>
      <div className="p-8 gap-14 bg-[#1A202C] rounded-[32px] space-y-5">
        <h2 className="font-semibold text-[white] text-[20px]">On-Chain Data</h2>
        <div className="flex justify-between">
          <span className="text-[#718096] text-[14px]">Creator Address</span>
          <Link target="_blank" href={votingExplorerURL}>
            <span className="text-[#4299E1] text-[14px]">
              {votingAddress && formatAddress(votingAddress)}
            </span>
          </Link>
        </div>
        <div className="flex justify-between">
          <span className="text-[#718096] text-[14px]">Contract Address</span>
          <Link target="_blank" href={votingExplorerURL}>
            <span className="text-[#4299E1] text-[14px]">
              {votingAddress && formatAddress(votingAddress)}
            </span>
          </Link>
        </div>
        <div className="flex justify-between">
          <span className="text-[#718096] text-[14px]">Member</span>
          <span className="text-white text-[14px]">1</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#718096] text-[14px]">Treasury</span>
          <span className="text-white text-[14px]">0 ZK</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#718096] text-[14px]">Proposal</span>
          <span className="text-white text-[14px]">0</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[#718096] text-[14px]">Governance</span>
          <span className="text-white text-[14px]">Members-based</span>
        </div>
      </div>
    </div>
  );
};

export default DaoInfo;
