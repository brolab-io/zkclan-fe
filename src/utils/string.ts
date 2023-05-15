export const formatAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const getTxErrorMessage = (error: any) => {
  if ("reason" in error) {
    return error.reason;
  }
  if (error.data && error.data.message) {
    return error.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An error occurred while sending transaction";
};
