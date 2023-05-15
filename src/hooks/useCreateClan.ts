import addClan from "@/services/clans/addClan";
import uploadFile from "@/services/files/uploadFile";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useChainId, useMutation } from "wagmi";

type Payload = {
  file: File;
  name: string;
  email: string;
  description: string;
  applicationStatus: boolean;
};

export default function useCreateClan() {
  const chainId = useChainId();
  const router = useRouter();
  // const { writeAsync } = useContractWrite({
  //   mode: "recklesslyUnprepared",
  //   abi: ["function regsiterCommitment(uint256)"],
  //   functionName: "regsiterCommitment",
  //   address: getContractAddress(chainId, "voting"),
  // });
  return useMutation(async (payload: Payload) => {
    let toastId = toast.loading("Uploading file...");
    try {
      const url = await uploadFile(payload.file);
      const id = Date.now();
      toast.update(toastId, {
        render: "Creating clan...",
        type: "info",
      });
      toast.update(toastId, {
        render: "Transaction sent, waiting for confirmation...",
        type: "info",
      });
      await addClan({
        id,
        image: url,
        name: payload.name,
        email: payload.email,
        description: payload.description,
        applicationStatus: payload.applicationStatus,
      });
      toast.update(toastId, {
        render: "Clan created!",
        type: "success",
        autoClose: 3000,
        isLoading: false,
      });
      router.push("/");
    } catch (e) {
      let message = "Something went wrong";
      if (e instanceof Error) {
        message = e.message;
      }
      toast.update(toastId, {
        render: message,
        type: "error",
        autoClose: 3000,
        isLoading: false,
      });
    }
  });
}
