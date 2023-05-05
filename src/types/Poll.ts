import { BigNumber } from "ethers";

export type Poll = {
  pollId: BigNumber;
  pollStatus: 0 | 1;
  createdAt: BigNumber;
  quorum: BigNumber;
  title: string;
  votes: [];
  creator: string;
};
