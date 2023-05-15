import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import firebase_app from "../firebase";

const db = getFirestore(firebase_app);

const updateProposalVote = async (proposalId: string, address: string, userVote: 0 | 1) => {
  const proposalRef = doc(db, "proposals", proposalId);
  const updateData =
    userVote === 0 ? { voteAgainsts: arrayUnion(address) } : { voteFors: arrayUnion(address) };

  // @ts-ignore
  await updateDoc(proposalRef, updateData, {
    merge: true,
  });
};

export default updateProposalVote;
