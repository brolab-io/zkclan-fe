"use client";
import Button from "@/components/CommonUI/Button";
import Container from "@/components/CommonUI/Container";
import { useState } from "react";
import { useContractWrite } from "wagmi";

export default function CreateProposalPage() {
  const [title, setTitle] = useState<string>("");
  const [votingPeriod, setVotingPeriod] = useState<[Date, Date]>([new Date(), new Date()]); // [start, end]
  const [description, setDescription] = useState<string>("");
  const { writeAsync } = useContractWrite({
    mode: "recklesslyUnprepared",
    abi: ["function createPoll(uint256, string, uint256)"],
    functionName: "createPoll",
    address: "0xb1b24576a8f7719E953A7273Dd1a0105735E707d",
  });

  const handleCreateProposal = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    writeAsync({
      recklesslySetUnpreparedArgs: ["1", title, "1"],
    });
  };

  return (
    <Container className="py-16 !max-w-[900px]">
      <form onSubmit={handleCreateProposal} className="bg-[#0C121D] rounded-[16px] py-12 px-20">
        <h1 className="text-white text-[32px] font-bold">Create Proposal</h1>

        <div className="mt-[26px]">
          <label htmlFor="title" className="text-white font-semibold text-[15px]">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter the title of your proposal"
            className="w-full bg-[#FFFFFF] bg-opacity-[3%] text-white placeholder:text-[#808080] rounded-[10px] p-6 mt-2"
            required
          />
        </div>

        <div className="mt-[26px]">
          <label htmlFor="description" className="text-white font-semibold text-[15px]">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What’s your proposal all about and who is it for"
            className="w-full bg-[#FFFFFF] bg-opacity-[3%] text-white placeholder:text-[#808080] rounded-[10px] p-6 mt-2"
            required
          />
        </div>
        <div className="mt-[26px]">
          <label className="text-white font-semibold text-[15px]">Voting Period *</label>
          <div className="flex items-center w-full">
            <input
              type="date"
              onChange={(e) => setVotingPeriod([new Date(e.target.value), votingPeriod[1]])}
              className="w-full bg-[#FFFFFF] bg-opacity-[3%] text-white placeholder:text-[#808080] rounded-[10px] p-6 mt-2"
            />
            <span className="px-4 text-white">to</span>
            <input
              type="date"
              onChange={(e) => setVotingPeriod([votingPeriod[0], new Date(e.target.value)])}
              placeholder="Enter the title of your proposal"
              className="w-full bg-[#FFFFFF] bg-opacity-[3%] text-white placeholder:text-[#808080] rounded-[10px] p-6 mt-2"
            />
          </div>
        </div>
        <div className="flex items-center justify-between w-full mt-6">
          <div />
          <Button type="submit" className="rounded-md">
            Publish{" "}
            <svg
              width="19"
              height="19"
              viewBox="0 0 19 19"
              fill="none"
              className="inline-block"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_19_784)">
                <path
                  d="M11.6626 14.4449C11.5201 14.4449 11.3776 14.3924 11.2651 14.2799C11.0476 14.0624 11.0476 13.7024 11.2651 13.4849L15.4201 9.32992L11.2651 5.17492C11.0476 4.95742 11.0476 4.59742 11.2651 4.37992C11.4826 4.16242 11.8426 4.16242 12.0601 4.37992L16.6126 8.93242C16.8301 9.14992 16.8301 9.50992 16.6126 9.72742L12.0601 14.2799C11.9476 14.3924 11.8051 14.4449 11.6626 14.4449Z"
                  fill="white"
                />
                <path
                  d="M16.0876 9.89258H3.46509C3.15759 9.89258 2.90259 9.63758 2.90259 9.33008C2.90259 9.02258 3.15759 8.76758 3.46509 8.76758H16.0876C16.3951 8.76758 16.6501 9.02258 16.6501 9.33008C16.6501 9.63758 16.3951 9.89258 16.0876 9.89258Z"
                  fill="white"
                />
              </g>
              <defs>
                <clipPath id="clip0_19_784">
                  <rect
                    width="18"
                    height="18"
                    fill="white"
                    transform="translate(0.840088 0.330078)"
                  />
                </clipPath>
              </defs>
            </svg>
          </Button>
        </div>
      </form>
    </Container>
  );
}
