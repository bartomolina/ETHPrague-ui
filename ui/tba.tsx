"use client";

import { useActiveProfile } from "@lens-protocol/react-web";
import { createAccount, getAccount } from "@tokenbound/sdk-ethers";
import { waitForTransaction, writeContract } from "@wagmi/core";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect, useProvider } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { mosaicAbi } from "@/lib/contracts/mosaic-abi";

export default function Tba() {
  const [secret, setSecret] = useState("");
  const [linkedAccount, setLinkedAccount] = useState("");
  const [tbaEnabled, setTbaenabled] = useState(false);
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
              if (code !== "0x") {
                setTbaenabled(true);
              }
            })
            .catch((error) => {
              console.log(error);
            });
        });
    }
  }, [activeProfile, provider]);

  const enableTBA = async () => {
    console.log("enabling TBA");
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
        console.log("write contract");

        writeContract({
          mode: "recklesslyUnprepared",
          address: "0x2f99Aa2276216d08315FC97f3dbf319D80109dDF",
          abi: mosaicAbi,
          functionName: "setSecret",
          args: [linkedAccount, secret],
        })
          .then((hash) => {
            console.log("done writting contract");

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
      {!tbaEnabled && (
        <>
          <input
            type="password"
            placeholder="Secret"
            value={secret}
            onChange={(event_) => setSecret(event_.target.value)}
            className="input-bordered input w-full max-w-xs"
          />
          <button
            disabled={enablingTBA}
            onClick={enableTBA}
            className="btn-primary btn"
          >
            Enable TBA
          </button>
        </>
      )}
    </div>
  );
}
