"use client";

import { useActiveProfile } from "@lens-protocol/react-web";
import { createAccount, getAccount } from "@tokenbound/sdk-ethers";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useProvider } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { mosaicAbi } from "@/lib/contracts/mosaic-abi";

import { Members } from "./members";

export default function Tba() {
  const [secret, setSecret] = useState("");
  const [linkedAccount, setLinkedAccount] = useState("");
  const [tbaEnabled, setTbaenabled] = useState(true);
  const [enablingTBA, setEnablingTBA] = useState(false);
  const { data: activeProfile } = useActiveProfile();
  const provider = useProvider();
  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (activeProfile) {
      getAccount(
        "0x60ae865ee4c725cd04353b5aab364553f56cef82", // ERC-712 contract address
        Number.parseInt(activeProfile.id, 16).toString(), // ERC-721 token ID
        provider
      )
        .then((address) => {
          setLinkedAccount(address);
          return address;
        })
        .then((address) => {
          provider
            .getCode(address)
            .then((code) => {
              if (code == "0x") {
                setTbaenabled(false);
              }
            })
            .catch((error) => {
              console.log(error);
              setTbaenabled(false);
            });
        });
    }
  }, [activeProfile, provider]);

  const enableTBA = async () => {
    setEnablingTBA(true);

    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector && activeProfile) {
      const signer = await connector.getSigner();
      createAccount(
        "0x60ae865ee4c725cd04353b5aab364553f56cef82", // ERC-712 contract address
        Number.parseInt(activeProfile.id, 16).toString(), // ERC-721 token ID
        signer // ethers signer
      ).then(() => {
        writeContract({
          mode: "recklesslyUnprepared",
          address: process.env
            .NEXT_PUBLIC_MOSAIC_CONTRACT_ADDRESS as `0x${string}`,
          abi: mosaicAbi,
          functionName: "setSecret",
          args: [linkedAccount, secret],
        })
          .then((hash) => {
            return waitForTransaction(hash);
          })
          .then(() => {
            setEnablingTBA(false);
            setTbaenabled(true);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  };

  return (
    <>
      <div className="space-y-3 rounded-2xl bg-white p-10 text-center">
        <h1 className="mb-5 text-xl font-bold text-green-800">
          {tbaEnabled
            ? "Your Lens Profile is registered"
            : "Register your Lens Profile"}
        </h1>
        <h2 className="font-bold">
          {tbaEnabled
            ? `${activeProfile?.handle} is already registered as an ERC-6551`
            : `👋 ${
                activeProfile?.name ? activeProfile?.name + "!" : ""
              } Ready to upgrade your Lens profile?`}
        </h2>
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
        {!tbaEnabled && (
          <>
            <input
              type="password"
              placeholder="Secret"
              value={secret}
              onChange={(event_) => setSecret(event_.target.value)}
              className="input-bordered input w-full max-w-xs"
            />
            <div>
              <button
                disabled={enablingTBA}
                onClick={enableTBA}
                className="btn-primary btn"
              >
                Enable TBA
              </button>
            </div>
          </>
        )}
      </div>
      {tbaEnabled && <Members linkedAccount={linkedAccount} />}
    </>
  );
}
