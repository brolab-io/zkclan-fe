"use client";
import { getContractAddress } from "@/configs/contract";
import useClient from "@/hooks/useClient";
import { Poll, TProposal } from "@/types/Poll";
import { formatDateTime } from "@/utils/date";
import clsx from "clsx";
import Link from "next/link";
import { useMemo } from "react";
import { useAccount, useChainId, useContractRead, useContractWrite } from "wagmi";
import Loading from "../CommonUI/Loading";
import Button from "../CommonUI/Button";
import { toast } from "react-toastify";
import { getTxErrorMessage } from "@/utils/string";

type ProposalStatusProps = {
  status: number;
  className?: string;
  withIcon?: boolean;
};

const ProposalState: React.FC<ProposalStatusProps> = ({ status, className, withIcon }) => {
  if (status === 1) {
    return (
      <div className={clsx(className, "text-[#805AD5] border-[#805AD5]")}>
        {withIcon && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="inline-block mr-3 -mt-1 fill-transparent"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M6 10H6.01M10 10H10.01M14 10H14.01M19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C8.8181 19 7.64778 18.7672 6.55585 18.3149C5.46392 17.8626 4.47177 17.1997 3.63604 16.364C2.80031 15.5282 2.13738 14.5361 1.68508 13.4442C1.23279 12.3522 1 11.1819 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1C12.3869 1 14.6761 1.94821 16.364 3.63604C18.0518 5.32387 19 7.61305 19 10Z"
              stroke="#805AD5"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        )}
        {withIcon ? "Queue" : "Running"}
      </div>
    );
  }
  if (status === 2) {
    return (
      <div className={clsx(className, "text-[#1AC486] border-[#1AC486]")}>
        {withIcon && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="inline-block mr-3 -mt-1 fill-transparent"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 10L9 12L13 8M19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C8.8181 19 7.64778 18.7672 6.55585 18.3149C5.46392 17.8626 4.47177 17.1997 3.63604 16.364C2.80031 15.5282 2.13738 14.5361 1.68508 13.4442C1.23279 12.3522 1 11.1819 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1C12.3869 1 14.6761 1.94821 16.364 3.63604C18.0518 5.32387 19 7.61305 19 10Z"
              stroke="#1AC486"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        )}
        {withIcon ? "Passed" : "Executed"}
      </div>
    );
  }
  if (status === 3) {
    return (
      <div className={clsx(className, "text-[#F56565] border-[#F56565]")}>
        {withIcon && (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            className="inline-block mr-3 -mt-1 fill-transparent"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 12L10 10M10 10L12 8M10 10L8 8M10 10L12 12M19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C8.8181 19 7.64778 18.7672 6.55585 18.3149C5.46392 17.8626 4.47177 17.1997 3.63604 16.364C2.80031 15.5282 2.13738 14.5361 1.68508 13.4442C1.23279 12.3522 1 11.1819 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1C12.3869 1 14.6761 1.94821 16.364 3.63604C18.0518 5.32387 19 7.61305 19 10Z"
              stroke="#F56565"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        )}
        Failed
      </div>
    );
  }
  return (
    <div className={clsx(className, "text-[#3b8eea] border-[#3b8eea]")}>
      {withIcon && (
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          className="inline-block mr-3 -mt-1 fill-transparent"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6 10H6.01M10 10H10.01M14 10H14.01M19 10C19 11.1819 18.7672 12.3522 18.3149 13.4442C17.8626 14.5361 17.1997 15.5282 16.364 16.364C15.5282 17.1997 14.5361 17.8626 13.4442 18.3149C12.3522 18.7672 11.1819 19 10 19C8.8181 19 7.64778 18.7672 6.55585 18.3149C5.46392 17.8626 4.47177 17.1997 3.63604 16.364C2.80031 15.5282 2.13738 14.5361 1.68508 13.4442C1.23279 12.3522 1 11.1819 1 10C1 7.61305 1.94821 5.32387 3.63604 3.63604C5.32387 1.94821 7.61305 1 10 1C12.3869 1 14.6761 1.94821 16.364 3.63604C18.0518 5.32387 19 7.61305 19 10Z"
            stroke="#3b8eea"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      )}
      {withIcon ? "Queue" : "Created"}
    </div>
  );
};

type Props = {
  clanId: string;
  proposals: TProposal[] | undefined;
  isLoading?: boolean;
};
const ListProposal: React.FC<Props> = ({ clanId, proposals, isLoading }) => {
  const chainId = useChainId();
  const { data: onChainData } = useContractRead<any, any, Poll[]>({
    abi: [
      "function getAllPolls() view returns (tuple(uint256 pollId, uint8 pollStatus, string title, address creator, uint256 quorum, uint256[] votes, uint256 createdAt)[])",
    ],
    address: getContractAddress(chainId, "voting"),
    functionName: "getAllPolls",
  });
  const isClient = useClient();

  if (!isClient) return null;

  if (!proposals) return null;

  if (!proposals.length) {
    return (
      <div className="flex justify-center items-center h-[120px]">
        {isLoading ? (
          <Loading className="w-5 h-5"></Loading>
        ) : (
          <div className="text-slate-300">No proposals yet</div>
        )}
      </div>
    );
  }

  return (
    <>
      {(proposals || []).map((item) => (
        <ListProposalItem item={item} clanId={clanId} key={item.id.toString()} />
      ))}
    </>
  );
};

const ListProposalItem: React.FC<{ item: TProposal; clanId: string }> = ({ item, clanId }) => {
  const chainId = useChainId();
  const { address } = useAccount();
  const {
    data: onChainData,
    isLoading,
    refetch,
  } = useContractRead<any, any, Poll>({
    abi: [
      "function getPollDetailsById(uint256 _pollId) view returns (tuple(uint256 pollId, uint8 pollStatus, string title, address creator, uint256 quorum, uint256[] votes, uint256 createdAt))",
    ],
    address: getContractAddress(chainId, "voting"),
    functionName: "getPollDetailsById",
    args: [item.id],
  });

  const { writeAsync, isLoading: isStarting } = useContractWrite({
    abi: ["function startPoll(uint256 _pollId)"],
    address: getContractAddress(chainId, "voting"),
    functionName: "startPoll",
    args: [item.id],
    mode: "recklesslyUnprepared",
  });

  const pollStatus = onChainData?.pollStatus || 0;
  const isCreator = onChainData?.creator.toLowerCase() === address?.toLowerCase();
  // const isCreator = true;
  console.log(onChainData?.creator.toLowerCase(), address?.toLowerCase());

  console.log("onChainData", onChainData);

  const startPoll = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const toastId = toast.loading("Starting poll...");
    try {
      e.preventDefault();
      e.stopPropagation();
      const tx = await writeAsync();
      toast.update(toastId, {
        render: "Transaction submitted, waiting for confirmation...",
      });
      await tx.wait();
      toast.update(toastId, {
        render: "Poll started",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
      return refetch();
    } catch (e) {
      toast.update(toastId, {
        render: getTxErrorMessage(e),
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  };
  return (
    <Link
      href={`/dao/${clanId}/proposal/${item.id}`}
      key={item.id.toString()}
      className="flex justify-between items-center border-b border-b-[#2D3748] py-6 hover:bg-[#2D3748] transition-colors px-10"
    >
      <div className="space-y-2.5">
        <h3 className="font-medium text-white">{item.title}</h3>
        <div className="flex items-center gap-4">
          <ProposalState className="px-5 py-1 text-sm border rounded-lg" status={pollStatus} />
          <div className="bg-[#4A5568] rounded-lg py-1 px-3.5 font-bold text-[14px] text-white">
            {(item.voteFors.length + item.voteAgainsts.length).toString().padStart(3, "0")}
          </div>
          <div className="h-5 w-px bg-[#4A5568]"></div>
          <div className="text-[#718096] font-medium">{formatDateTime(item.startDate)}</div>
        </div>
      </div>
      {!isLoading ? (
        pollStatus === 0 && isCreator ? (
          <Button
            isLoading={isLoading || isStarting}
            onClick={startPoll}
            className="!py-2.5 rounded-lg"
          >
            Start
          </Button>
        ) : (
          <ProposalState withIcon className="px-5 py-1 font-medium text-md" status={pollStatus} />
        )
      ) : null}
    </Link>
  );
};

export default ListProposal;
