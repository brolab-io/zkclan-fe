import { TClan } from "@/types/TClan";
import firebase_app from "../firebase";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const db = getFirestore(firebase_app);

type Payload = {
  id: string;
  clanId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
};

export default async function addProposal(payload: Payload) {
  const newClanRef = doc(db, "proposals", payload.id.toString());
  return setDoc(
    newClanRef,
    {
      ...payload,
      voteFors: [],
      voteAgainsts: [],
    },
    {
      merge: true,
    }
  );
}
