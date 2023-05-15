import { TClan } from "@/types/TClan";
import firebase_app from "../firebase";
import { getFirestore, collection, getDocs, CollectionReference } from "firebase/firestore";

const db = getFirestore(firebase_app);
const getClans = async (): Promise<TClan[]> => {
  const collectionRef = collection(db, "clans") as CollectionReference<TClan>;
  const querySnapshot = await getDocs<TClan>(collectionRef);
  return querySnapshot.docs.map((doc) => ({
    ...doc.data(),
  }));
};
export default getClans;
