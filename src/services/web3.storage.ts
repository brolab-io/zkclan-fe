import { Web3Storage } from "web3.storage";

// Construct with token and endpoint
const web3Storage = new Web3Storage({ token: process.env.NEXT_PUBLIC_WEB3_STORAGE_API_KEY! });

export default web3Storage;
