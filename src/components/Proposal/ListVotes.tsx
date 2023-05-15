import clsx from "clsx";
import { useMemo } from "react";
import Button from "../CommonUI/Button";
import { formatAddress } from "@/utils/string";
import Link from "next/link";
import { useNetwork } from "wagmi";

type Props = {
  votes: string[];
  isVoteFor?: boolean;
  totalVotes: number;
};

const ListVotes: React.FC<Props> = ({ votes, isVoteFor, totalVotes }) => {
  const style = useMemo(() => {
    let percent = 0;
    if (totalVotes > 0 && votes.length > 0) {
      percent = Math.floor((votes.length / totalVotes) * 100);
    }
    return {
      width: `${percent}%`,
    };
  }, [totalVotes, votes.length]);
  const { chain } = useNetwork();
  const blockExplorer = chain?.blockExplorers?.default.url || "";
  return (
    <div className="rounded-[24px] border border-[#2D3748] py-7 px-11">
      <div className="flex justify-between text-sm font-medium text-[#ffffff]">
        <span className="">{isVoteFor ? "Vote For" : "Vote Against"}</span>
        <span>{votes.length}</span>
      </div>
      <div className="mt-3.5 h-2 w-full rounded-[4px] bg-[#4A5568] relative overflow-hidden">
        <div
          style={style}
          className={clsx(
            "absolute top-0 bottom-0 rounded-[4px]",
            isVoteFor ? "bg-[#1AC486]" : "bg-[#F56565]"
          )}
        ></div>
      </div>
      <div className="mt-4 divide-y divide-[#2D3748]">
        <div className="flex py-[18px]">
          <div className="flex flex-1 text-sm text-[#718096] justify-start">Address</div>
          <div className="flex flex-1 text-sm text-[#718096] justify-center">Hash</div>
          <div className="flex flex-1 text-sm text-[#718096] justify-end">Vote</div>
        </div>
        {votes.map((item) => (
          <div key={item} className="flex py-[18px]">
            <div className="flex flex-1 text-sm font-medium text-[#ffffff] justify-start">
              Address
            </div>
            <Link target="_blank" href={`${blockExplorer}/address/${item}`}>
              <div className="flex flex-1 text-sm text-[#4299e1] justify-center">
                {formatAddress(item)}
              </div>
            </Link>
            <div className="flex flex-1 text-sm font-medium text-[#ffffff] justify-end">Vote</div>
          </div>
        ))}

        {votes.length === 0 && (
          <div className="flex py-[18px] justify-center">
            <span className="text-slate-300">No votes yet</span>
          </div>
        )}
        <div />
        {votes.length > 0 ? <Button className="!bg-[#2D3748] w-full mt-5">View All</Button> : null}
      </div>
    </div>
  );
};

export default ListVotes;
