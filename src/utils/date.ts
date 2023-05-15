import { BigNumber } from "ethers";
import { Timestamp } from "firebase/firestore";

export const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export function formatDateTime(date: BigNumber): string;
export function formatDateTime(date: number): string;
export function formatDateTime(date: Date): string;
export function formatDateTime(date: Timestamp): string;
export function formatDateTime(date: BigNumber | Date | number | Timestamp) {
  if (date instanceof Timestamp) {
    return new Date(date.seconds * 1000).toLocaleString();
  }
  if (typeof date === "number") {
    return new Date(date * 1000).toLocaleString();
  }
  if (date instanceof BigNumber) {
    return new Date(date.toNumber() * 1000).toLocaleString();
  } else {
    return date.toLocaleString();
  }
}
