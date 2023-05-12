"use client";
import React, { useEffect, memo, useState } from "react";

import { formatAddress } from "@/utils/string";
import { generateBroadcastParams } from "@/utils/zk/zk-witness";
import { useAccount, useChainId, useContractRead, useContractWrite } from "wagmi";
import Button from "../CommonUI/Button";
import useClient from "@/hooks/useClient";
import { getContractAddress } from "@/configs/contract";

const AgeCheck = () => {
  const isClient = useClient();
  const [age, setAge] = React.useState<number>(19);
  const [error, setError] = React.useState<string | undefined>();
  const [statusMsg, setStatusMsg] = React.useState<string | undefined>();
  const [isLoading, setLoading] = useState<boolean>(false);
  const [alert, setAlert] = React.useState<{ open: boolean; message: string }>({
    open: false,
    message: "",
  });
  const chainId = useChainId();
  const { address: account } = useAccount();

  const { writeAsync: verifyUsingGroth } = useContractWrite({
    abi: ["function verifyUsingGroth(uint256[8] _proof, uint256[2] _input)"],
    functionName: "verifyUsingGroth",
    address: getContractAddress(chainId, "ageCheck"),
    mode: "recklesslyUnprepared",
  });

  const { writeAsync: setVerficationStatus } = useContractWrite({
    abi: ["function setVerficationStatus(bool _status)"],
    functionName: "setVerficationStatus",
    address: getContractAddress(chainId, "ageCheck"),
    mode: "recklesslyUnprepared",
  });

  const { data: ageVerified } = useContractRead({
    abi: ["function getVerficationStatus(address _user) public view returns (bool)"],
    functionName: "getVerficationStatus",
    address: getContractAddress(chainId, "ageCheck"),
    args: [account],
    enabled: !!account,
  });

  useEffect(() => {
    if (chainId == null || account == null) {
      return;
    }

    // ageCheckContract.on("AgeVerfied", (address, isVerified) => {
    //   if (isVerified && address === account) {
    //     setAlert({
    //       open: true,
    //       message: `Age Verified for ${formatAddress(address)}`,
    //     });
    //     setAgeVerified(true);
    //     setStatusMsg(undefined);
    //     setLoading(false);
    //     return;
    //   }
    //   if (!isVerified && address === account) {
    //     setAlert({
    //       open: true,
    //       message: `Age flag reset for ${formatAddress(address)}`,
    //     });
    //     setAgeVerified(false);
    //     return;
    //   }
    // });
  }, [chainId, account]);

  const handleVerify = async () => {
    setLoading(true);
    setStatusMsg("Generating Proof");
    try {
      const [a, b, c, input] = await generateBroadcastParams(
        {
          ...{
            ageLimit: 18,
            age,
          },
        },
        "circuit"
      );
      setError(undefined);
      setStatusMsg("Proof Generated..");
      const proof = [...a, ...b[0], ...b[1], ...c];

      setStatusMsg("Verifying Proof..");
      try {
        const tx = await verifyUsingGroth({
          recklesslySetUnpreparedArgs: [proof, input],
        });
        if (tx?.hash) {
          setAlert({
            open: true,
            message: `Transaction broadcasted with hash ${tx.hash}`,
          });
        }
      } catch (e) {
        setAlert({
          open: true,
          message: `Error sending transaction. Please try again!`,
        });
        console.log(`Errror: ${e}`);
        setStatusMsg(undefined);
        setLoading(false);
      }
    } catch (e) {
      setError("Failed to generate proof, possibly age not valid.");
      setStatusMsg("Invalid proof");
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      const tx = await setVerficationStatus({
        recklesslySetUnpreparedArgs: [false],
      });

      if (tx?.hash) {
        setAlert({
          open: true,
          message: `Transaction broadcasted with hash ${tx.hash}`,
        });
      }
    } catch (e) {
      setAlert({
        open: true,
        message: `Error sending transaction. Please try again!`,
      });
    }
  };
  const AgeVerfiedText = memo(function a() {
    if (account == null) {
      return null;
    }
    return (
      <div className="mb-8">
        Age for<b> {formatAddress(account) ?? ""} </b>{" "}
        {ageVerified ? "is above 18." : "not verified."}
      </div>
    );
  });

  if (!isClient) {
    return null;
  }
  return (
    <div>
      <div className="flex justify-center">
        {/* <Collapse in={alert.open} style={{ margin: 0, padding: 0, width: "300px" }}>
          <Alert variant="subtle" status="success" sx={{ mb: 2 }}>
            <Text flexWrap={"wrap"} sx={{ wordBreak: "break-word" }}>
              {alert.message}
            </Text>
          </Alert>
        </Collapse> */}
      </div>
      <div className="flex items-center justify-center mb-4">
        <h2>Age verification using Zero Knowledge Proofs.</h2>
      </div>
      <div className="flex items-center justify-center mb-4">
        <div className="flex items-center justify-center h-[140px] w-[300px] bg-[#D0CDD7] rounded-[16px] p-[8px]">
          {account ? (
            <div className="flex flex-col justify-center">
              <AgeVerfiedText />
              <Button onClick={handleReset}>Reset</Button>
            </div>
          ) : (
            <b> Please connect your wallet.</b>
          )}
        </div>
      </div>
      <div className="flex justify-center">
        <input
          id="outlined-basic"
          value={age}
          type="number"
          disabled={!account}
          onChange={(e) => setAge(Number(e.target.value ?? 0))}
          className="w-[140px]"
          style={{ marginRight: "8px" }}
        />

        <Button onClick={handleVerify} disabled={!account}>
          Verify Age
        </Button>
      </div>
      <div className="justify-center mt-2">
        <span className="text-lg">{statusMsg}</span>
        {isLoading && "Loading..."}
      </div>
    </div>
  );
};

export default AgeCheck;
