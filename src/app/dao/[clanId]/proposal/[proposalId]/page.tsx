"use client";
import Button from "@/components/CommonUI/Button";
import Container from "@/components/CommonUI/Container";
import useClient from "@/hooks/useClient";
import { Poll } from "@/types/Poll";
import { getIdFromStore, posiedonHash } from "@/utils/voting/helpers";
import { generateZkProof } from "@/utils/zk/merkleproof";
import { generateBroadcastParams } from "@/utils/zk/zk-witness";
import { ethers } from "ethers";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useContractRead, useContractWrite, useNetwork } from "wagmi";
const { ZkIdentity } = require("@libsem/identity");

type PageProps = {
  params: {
    proposalId: string;
  };
};

const ProposalPage: React.FC<PageProps> = ({ params: { proposalId } }) => {
  const isClient = useClient();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: proposal } = useContractRead<any, any, Poll>({
    abi: [
      "function getPollDetailsById(uint256 _pollId) view returns (tuple(uint256 pollId, uint8 pollStatus, string title, address creator, uint256 quorum, uint256[] votes, uint256 createdAt))",
    ],
    address: "0xb1b24576a8f7719E953A7273Dd1a0105735E707d",
    functionName: "getPollDetailsById",
    args: [proposalId],
    enabled: !!proposalId && isClient,
  });

  const [isVoting, setIsVoting] = useState(false);

  const { data: registeredCommitments } = useContractRead<any, any, Poll>({
    abi: ["function getRegisteredCommitments() view returns (uint256[])"],
    address: "0xb1b24576a8f7719E953A7273Dd1a0105735E707d",
    functionName: "getRegisteredCommitments",
    args: [],
    enabled: !!proposalId && isClient,
  });

  console.log(`registeredCommitments`, registeredCommitments);

  const { writeAsync: castVote } = useContractWrite({
    abi: [
      "function castVote(uint256 _vote, uint256 _nullifierHash, uint256 _pollId, uint256[8] _proof, uint256[4] _input)",
    ],
    functionName: "castVote",
    address: "0xb1b24576a8f7719E953A7273Dd1a0105735E707d",
    mode: "recklesslyUnprepared",
  });

  const vote = useCallback(
    async (userVote: 0 | 1) => {
      if (!address) {
        return toast.error("Please connect your wallet");
      }

      if (!chain || !!chain?.unsupported) {
        return toast.error("Unsupported chain");
      }

      if (!registeredCommitments) {
        return toast.error("No registered commitments");
      }

      const identity: typeof ZkIdentity | undefined = getIdFromStore(address, chain.id);

      if (identity == null) {
        toast.error("No identity found");
        return;
      }
      const { identityNullifier, identityTrapdoor } = identity.getIdentity();

      setIsVoting(true);
      try {
        const hash = await posiedonHash([BigInt(identityTrapdoor), BigInt(identityNullifier)]);

        const leaves = registeredCommitments;

        const { pathElements, indices } = await generateZkProof(leaves, hash);

        const nullifierHash = await posiedonHash([
          BigInt(identityNullifier),
          ethers.BigNumber.from(userVote).toBigInt(),
        ]);

        const circuitInputs = {
          identityNullifier: BigInt(identityNullifier),
          identityTrapdoor: BigInt(identityTrapdoor),
          treePathIndices: indices,
          treeSiblings: pathElements,
          signalHash: ethers.BigNumber.from(userVote).toBigInt(),
          externalNullifier: ethers.BigNumber.from(proposalId).toBigInt(),
        };

        const fullProof = await generateBroadcastParams(circuitInputs, "voting");

        const [a, b, c, input] = fullProof;
        const tx = await castVote({
          recklesslySetUnpreparedArgs: [
            userVote,
            nullifierHash,
            proposalId,
            [...a, ...b[0], ...b[1], ...c],
            input,
          ],
        });
        if (tx) {
          toast.success("Vote casted");
        }
      } catch (e) {
        console.log(e);
        toast.error("Error while casting vote: " + (e as Error).message);
      } finally {
        setIsVoting(false);
      }
    },
    [address, chain, registeredCommitments, proposalId, castVote]
  );

  const yesVote = useCallback(() => vote(1), [vote]);
  const noVote = useCallback(() => vote(0), [vote]);

  if (!proposal) {
    return null;
  }
  return (
    <Container className="py-[85px] !max-w-[1200px] space-y-6">
      <h1 className="text-[32px] text-white font-semibold">{proposal.title}</h1>
      <div className="bg-[#1A202C] rounded-[32px] px-[82px] py-[55px]">
        <div className="flex justify-between">
          <h2 className="text-white text-[26px] font-medium">List Of Votes</h2>
          <div className="flex gap-[13px]">
            <Button
              disabled={isVoting}
              onClick={yesVote}
              className="bg-[#1AC486] hover:bg-[#1AC486] !rounded-[16px]"
            >
              Vote For
            </Button>
            <Button
              disabled={isVoting}
              onClick={noVote}
              className="bg-[#F56565] hover:bg-[#F56565] !rounded-[16px]"
            >
              Vote Against
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ProposalPage;
