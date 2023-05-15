import web3Storage from "../web3.storage";

export default async function uploadFile(file: File) {
  const rootCid = await web3Storage.put([file], {
    wrapWithDirectory: false,
  });
  console.log(rootCid);
  return `https://ipfs.w3s.link/ipfs/${rootCid}`;
}
