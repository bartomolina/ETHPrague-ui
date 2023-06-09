"use client";
import { LensLogin } from "@/ui/lens-login";
import { useEffect, useState } from "react";
import { client, defaultProfile } from "@/lib/lens-client";
import { ModuleSelector } from "@/ui/module-selector";

export default function Home() {
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
    <div>
      <LensLogin address={address} setAddress={setAddress} />
      <ModuleSelector profile={profile} />
    </div>
  );
}
