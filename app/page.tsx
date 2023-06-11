"use client";

import { useActiveProfile } from "@lens-protocol/react-web";

import { LensLogin } from "@/ui/lens-login";
import Tba from "@/ui/tba";

export default function Home() {
  const { data: activeProfile } = useActiveProfile();

  return (
    <div className="space-y-3">
      <h1 className="text-xl font-bold text-green-800">
        Register your Lens Profile
      </h1>
      <h2 className="font-bold">
        {activeProfile
          ? `Upgrade your ${activeProfile?.handle} Lens profile`
          : "Connect your Lens profile"}
      </h2>
      <p>
        {activeProfile
          ? "Register your profile as an ERC-6551"
          : "First things first: Log in with the lens account you want to register as an ERC-6551"}
      </p>
      <LensLogin />
      {activeProfile && <Tba />}
    </div>
  );
}
