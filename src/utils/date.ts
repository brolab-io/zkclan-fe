import { BigNumber } from "ethers";

export const formatDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export function formatDateTime(date: BigNumber): string;
export function formatDateTime(date: Date): string;
export function formatDateTime(date: BigNumber | Date) {
  if (date instanceof BigNumber) {
    return new Date(date.toNumber() * 1000).toLocaleString();
  } else {
    return date.toLocaleString();
  }
}
