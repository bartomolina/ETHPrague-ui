"use client";

import { useActiveProfile, useWalletLogout } from "@lens-protocol/react-web";
import Image from "next/image";

import { getPictureURL } from "@/lib/get-picture-url";

export function LensLogout() {
  const { execute: logout } = useWalletLogout();
  const { data: activeProfile } = useActiveProfile();

  return (
    <>
      {activeProfile && (
        <div className="flex gap-3">
          <Image
            src={getPictureURL(activeProfile)}
            alt={activeProfile?.handle}
            width={30}
            height={30}
            className="m-auto rounded-full object-cover"
          />
          <button onClick={logout} className="btn-error btn">
            Log out
          </button>
        </div>
      )}
    </>
  );
}
