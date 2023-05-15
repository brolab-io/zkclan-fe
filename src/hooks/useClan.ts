import getClanById from "@/services/clans/getClanById";
import { useQuery } from "wagmi";

const useClan = (id: string | number) => {
  return useQuery(["clans", id], getClanById);
};

export default useClan;
