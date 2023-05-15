import { getContractAddress } from "@/configs/contract";
import { posiedonHash } from "@/utils/voting/helpers";
import { hasZkId, storeZkId } from "@/utils/voting/storage";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAccount, useChainId, useContractWrite } from "wagmi";
const { ZkIdentity } = require("@libsem/identity");

type OnSuccess = () => void;

const useRegisterCommitment = (onSuccess: OnSuccess) => {
  const { address } = useAccount();
  const chainId = useChainId();
  const [isRegistered, setIsRegistered] = useState(() => {
    if (address == null || !chainId || !hasZkId(address, chainId)) {
      return false;
    }
    return true;
  });
  const { writeAsync, isLoading } = useContractWrite({
    mode: "recklesslyUnprepared",
    abi: ["function regsiterCommitment(uint256)"],
    functionName: "regsiterCommitment",
    address: getContractAddress(chainId, "voting"),
  });

  const registerCommitment = useCallback(async () => {
    if (isRegistered) {
      return;
    }
    if (address == null || !chainId) {
      return;
    }
    const identity: typeof ZkIdentity = new ZkIdentity();
    const { identityNullifier, identityTrapdoor } = identity.getIdentity();
    console.log(`identity.serializeIdentity()`, identity.serializeIdentity());
    const hash = await posiedonHash([BigInt(identityTrapdoor), BigInt(identityNullifier)]);
    console.log("hash", hash);
    const tx = await writeAsync({
      recklesslySetUnpreparedArgs: [hash],
    });
    await tx.wait();
    storeZkId(identity.serializeIdentity(), address, chainId);
    setIsRegistered(true);
    onSuccess();
  }, [address, chainId, isRegistered, onSuccess, writeAsync]);

  return { isRegistered, registerCommitment, isLoading };
};

export default useRegisterCommitment;
