import { TClan } from "@/types/TClan";
import firebase_app from "../firebase";
import { getFirestore, doc, DocumentReference, getDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);
const getClanById = async (queryContext: any): Promise<TClan> => {
  const collectionRef = doc(db, "clans", queryContext.queryKey[1]) as DocumentReference<TClan>;
  const querySnapshot = await getDoc<TClan>(collectionRef);
  if (!querySnapshot.exists()) {
    throw new Error("Clan not found");
  }
  return {
    ...querySnapshot.data(),
  } as TClan;
};
export default getClanById;
