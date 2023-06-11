"use client";

import { useActiveProfile, useWalletLogin } from "@lens-protocol/react-web";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export function LensLogin() {
  const { execute: login, isPending: isLoginPending } = useWalletLogin();
  const { data: activeProfile } = useActiveProfile();
  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();
      await login(signer);
    }
  };

  return (
    <div>
      {!activeProfile && (
        <button
          disabled={isLoginPending}
          onClick={onLoginClick}
          className="btn-primary btn"
        >
          Log in
        </button>
      )}
    </div>
  );
}
