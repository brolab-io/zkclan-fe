import { getContractAddress } from "@/configs/contract";
import { generateBroadcastParams } from "@/utils/zk/zk-witness";
import { toast } from "react-toastify";
import { useChainId, useContractWrite, useMutation } from "wagmi";

const useVerify = () => {
  const chainId = useChainId();
  const { writeAsync: verifyUsingGroth } = useContractWrite({
    abi: ["function verifyUsingGroth(uint256[8] _proof, uint256[2] _input)"],
    functionName: "verifyUsingGroth",
    address: getContractAddress(chainId, "ageCheck"),
    mode: "recklesslyUnprepared",
  });

  const { writeAsync: setVerficationStatus } = useContractWrite({
    abi: ["function setVerficationStatus(bool _status)"],
    functionName: "setVerficationStatus",
    address: getContractAddress(chainId, "ageCheck"),
    mode: "recklesslyUnprepared",
  });
  return useMutation(async () => {
    try {
      const [a, b, c, input] = await generateBroadcastParams(
        {
          ...{
            ageLimit: 16,
            age: 18,
          },
        },
        "circuit"
      );
      console.log(a, b, c, input);
      const proof = [...a, ...b[0], ...b[1], ...c];
      try {
        const tx = await verifyUsingGroth({
          recklesslySetUnpreparedArgs: [proof, input],
        });
        await tx.wait();
        const tx2 = await setVerficationStatus({
          recklesslySetUnpreparedArgs: [true],
        });
        await tx2.wait();
      } catch (e) {
        toast.error("Error while verifying proof: " + (e as Error).message);
      }
    } catch (e) {
      console.log(e);
      toast.error("Error while generating proof: " + (e as Error).message);
    }
  });
};

export default useVerify;
