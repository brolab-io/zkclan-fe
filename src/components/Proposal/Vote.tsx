import { getContractAddress } from "@/configs/contract";
import { Poll } from "@/types/Poll";
import { getIdFromStore, posiedonHash } from "@/utils/voting/helpers";
import { generateZkProof } from "@/utils/zk/merkleproof";
import { generateBroadcastParams } from "@/utils/zk/zk-witness";
import { ethers } from "ethers";
import { useCallback, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAccount, useChainId, useContractRead, useContractWrite } from "wagmi";
import Button from "../CommonUI/Button";
import updateProposalVote from "@/services/clans/addVote";
import { getTxErrorMessage } from "@/utils/string";
import { useCommitmentContext } from "@/providers/CommitmentProvider";
const { ZkIdentity } = require("@libsem/identity");

type Props = {
  proposalId: string;
  refresh: () => void;
};

const Vote: React.FC<Props> = ({ proposalId, refresh }) => {
  const chainId = useChainId();
  const { address } = useAccount();
  let votingType = useRef(0);
  const {
    data: registeredCommitments,
    refetch: refetchRegisteredCommitments,
    isLoading: isFetchingRegisteredCommitments,
  } = useContractRead<any, any, Poll>({
    abi: ["function getRegisteredCommitments() view returns (uint256[])"],
    address: getContractAddress(chainId, "voting"),
    functionName: "getRegisteredCommitments",
    args: [],
  });

  const [isVoting, setIsVoting] = useState(false);
  const { writeAsync: castVote } = useContractWrite({
    abi: [
      "function castVote(uint256 _vote, uint256 _nullifierHash, uint256 _pollId, uint256[8] _proof, uint256[4] _input)",
    ],
    functionName: "castVote",
    address: getContractAddress(chainId, "voting"),
    mode: "recklesslyUnprepared",
  });

  const { open, isRegistered } = useCommitmentContext();

  const vote = useCallback(
    async (userVote: 0 | 1) => {
      votingType.current = userVote;
      if (!address) {
        return toast.error("Please connect your wallet");
      }

      if (!registeredCommitments) {
        return toast.error("No registered commitments");
      }

      const identity: typeof ZkIdentity | undefined = getIdFromStore(address, chainId);

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
          await updateProposalVote(proposalId, address, userVote);
          await tx.wait();
          toast.success("Vote casted");
          refresh();
        }
      } catch (e) {
        toast.error(getTxErrorMessage(e));
      } finally {
        setIsVoting(false);
      }
    },
    [address, registeredCommitments, chainId, proposalId, castVote, refresh]
  );

  const yesVote = useCallback(() => vote(1), [vote]);
  const noVote = useCallback(() => vote(0), [vote]);

  const registerCommitment = useCallback(async () => {
    open(refetchRegisteredCommitments);
  }, [open, refetchRegisteredCommitments]);

  if (isFetchingRegisteredCommitments) {
    return (
      <Button disabled className="bg-[#1AC486] hover:bg-[#1AC486] !rounded-[16px]">
        Verifying...
      </Button>
    );
  }
  if (!isRegistered) {
    return (
      <Button
        onClick={registerCommitment}
        className="bg-[#1AC486] hover:bg-[#1AC486] !rounded-[16px]"
      >
        Register to Vote
      </Button>
    );
  }
  return (
    <div className="flex gap-[13px]">
      <Button
        isLoading={votingType.current === 1 && isVoting}
        onClick={yesVote}
        className="bg-[#1AC486] hover:bg-[#1AC486] !rounded-[16px]"
      >
        Vote For
      </Button>
      <Button
        isLoading={votingType.current === 0 && isVoting}
        onClick={noVote}
        className="bg-[#F56565] hover:bg-[#F56565] !rounded-[16px]"
      >
        Vote Against
      </Button>
    </div>
  );
};

export default Vote;
