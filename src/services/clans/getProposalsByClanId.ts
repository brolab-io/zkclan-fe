import { TClan } from "@/types/TClan";
import firebase_app from "../firebase";
import {
  getFirestore,
  doc,
  DocumentReference,
  getDoc,
  collection,
  getDocs,
  CollectionReference,
  where,
  query,
} from "firebase/firestore";
import { TProposal } from "@/types/Poll";

const db = getFirestore(firebase_app);
const getProposalsByClanId = async (queryContext: any): Promise<TProposal[]> => {
  const clanId = queryContext.queryKey[1];
  const collectionRef = collection(db, "proposals") as CollectionReference<TProposal>;
  const q = query(collectionRef, where("clanId", "==", clanId));
  const querySnapshot = await getDocs<TProposal>(q);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
  }));
};
export default getProposalsByClanId;
