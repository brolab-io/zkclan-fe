import firebase_app from "../firebase";
import { getFirestore, doc, DocumentReference, getDoc } from "firebase/firestore";
import { TProposal } from "@/types/Poll";

const db = getFirestore(firebase_app);
const getProposalById = async (queryContext: any): Promise<TProposal> => {
  const collectionRef = doc(
    db,
    "proposals",
    queryContext.queryKey[1]
  ) as DocumentReference<TProposal>;
  const querySnapshot = await getDoc<TProposal>(collectionRef);
  if (!querySnapshot.exists()) {
    throw new Error("Clan not found");
  }
  return {
    ...querySnapshot.data(),
  } as TProposal;
};
export default getProposalById;
