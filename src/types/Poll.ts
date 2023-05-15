import { BigNumber } from "ethers";
import { Timestamp } from "firebase/firestore";

export type Poll = {
  pollId: BigNumber;
  pollStatus: 0 | 1;
  createdAt: BigNumber;
  quorum: BigNumber;
  title: string;
  votes: [];
  creator: string;
};

export type TProposal = {
  id: string;
  clanId: string;
  title: string;
  description: string;
  startDate: Timestamp;
  endDate: Timestamp;
  voteFors: string[];
  voteAgainsts: string[];
};
