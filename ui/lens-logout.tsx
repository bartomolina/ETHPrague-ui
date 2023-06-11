"use client";

import { useActiveProfile,useWalletLogout  } from "@lens-protocol/react-web";

export function LensLogout() {
  const { execute: logout } = useWalletLogout();
  const { data: activeProfile } = useActiveProfile();

  return (
    <div>
      {activeProfile && (
        <button onClick={logout} className="btn-error btn">
          Log out
        </button>
      )}
    </div>
  );
}
