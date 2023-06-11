"use client";

import { useActiveProfile } from "@lens-protocol/react-web";
import { getAccount } from "@tokenbound/sdk-ethers";
import { waitForTransaction, writeContract } from "@wagmi/core";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useProvider } from "wagmi";

import { mosaicAbi } from "@/lib/contracts/mosaic-abi";

export default function Home() {
  const [secret, setSecret] = useState("");
  const [linkedAccount, setLinkedAccount] = useState("");
  const [joiningOrg, setJoiningOrg] = useState(false);
  const { data: activeProfile } = useActiveProfile();
  const provider = useProvider();

  const joinOrganization = async () => {
    if (activeProfile) {
      setJoiningOrg(true);

      writeContract({
        mode: "recklesslyUnprepared",
        address: process.env
          .NEXT_PUBLIC_MOSAIC_CONTRACT_ADDRESS as `0x${string}`,
        abi: mosaicAbi,
        functionName: "joinOrganization",
        args: [linkedAccount, activeProfile.handle, secret],
      })
        .then((hash) => {
          return waitForTransaction(hash);
        })
        .then(() => {
          setJoiningOrg(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  useEffect(() => {
    if (activeProfile) {
      getAccount(
        "0x60ae865ee4c725cd04353b5aab364553f56cef82", // ERC-712 contract address
        process.env.NEXT_PUBLIC_DEFAULT_ORG_ID as string, // ERC-721 token ID
        provider
      ).then((address) => {
        setLinkedAccount(address);
        return address;
      });
    }
  }, [activeProfile, provider]);

  return (
    <div className="space-y-3 rounded-2xl bg-white p-10 text-center">
      <h1 className="text-xl font-bold text-green-800">Join organization</h1>
      <h2 className="font-bold">@lensprotocol.lens</h2>
      <Image
        src={"/avatar.png"}
        alt="avatar"
        width={100}
        height={100}
        className="mx-auto"
      />
      <div className="space-y-3">
        <div>
          <div>ERC-4337 address:</div>
          <a
            href={`https://mumbai.polygonscan.com/address/${linkedAccount}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {linkedAccount}
          </a>
        </div>
        <input
          type="password"
          placeholder="Secret"
          value={secret}
          onChange={(event_) => setSecret(event_.target.value)}
          className="input-bordered input w-full max-w-xs"
        />
        <div>
          <button
            disabled={joiningOrg}
            onClick={joinOrganization}
            className="btn-primary btn"
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
}
