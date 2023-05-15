import { TClan } from "@/types/TClan";
import firebase_app from "../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);

type Payload = TClan;

export default async function addClan(payload: Payload) {
  const newClanRef = doc(db, "clans", payload.id.toString());
  return setDoc(newClanRef, payload, {
    merge: true,
  });
}
