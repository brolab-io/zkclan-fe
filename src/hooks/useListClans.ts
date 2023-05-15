import getClans from "@/services/clans/getClans";
import { useQuery } from "wagmi";

const useListClans = () => {
  return useQuery(["clans"], getClans);
};

export default useListClans;
