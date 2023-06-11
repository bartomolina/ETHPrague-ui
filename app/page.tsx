"use client";

import { useActiveProfile } from "@lens-protocol/react-web";

import { LensLogin } from "@/ui/lens-login";
import Tba from "@/ui/tba";

export default function Home() {
  const { data: activeProfile } = useActiveProfile();

  return (
    <div className="space-y-3">
      <LensLogin />
      {activeProfile && <Tba />}
    </div>
  );
}
