"use client";
import { LensLogin } from "@/ui/lens-login";
import { useEffect, useState } from "react";
import { client, defaultProfile } from "@/lib/lens-client";
import { ModuleSelector } from "@/ui/module-selector";

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [token, setToken] = useState();
  const [address, setAddress] = useState();
  const [profile, setProfile] = useState();

  useEffect(() => {
    if (address) {
      try {
        /* first request the challenge from the API server */
        client
          .query({
            query: defaultProfile,
            variables: { address },
          })
          .then((result) => {
            console.log(result.data.defaultProfile);
            setProfile(result.data.defaultProfile);
          });
      } catch {}
    }
  }, [address]);

  return (
    <div className="space-y-3">
      <h1 className="text-xl text-green-800 font-bold">
        Register your Lens Profile
      </h1>
      <h2 className="font-bold">
        {token
          ? `Upgrade your ${profile?.handle} Lens profile`
          : "Connect your Lens profile"}
      </h2>
      <p>
        {token
          ? "Register your profile as an ERC-6551"
          : "First things first: Log in with the lens account you want to register as an ERC-6551"}
      </p>
      <LensLogin
        address={address}
        setAddress={setAddress}
        token={token}
        setToken={setToken}
      />
      <ModuleSelector profile={profile} token={token} />
    </div>
  );
}
