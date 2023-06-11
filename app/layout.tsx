"use client";
import "@/styles/globals.css";

import { LensProvider } from "@lens-protocol/react-web";
import { Space_Grotesk } from "next/font/google";
import Image from "next/image";
import { WagmiConfig } from "wagmi";

import { lensConfig } from "@/lib/lens-config";
import { client } from "@/lib/wagmi";
import { LensLogout } from "@/ui/lens-logout";
import { Menu } from "@/ui/menu";

const space_grotesk = Space_Grotesk({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html data-theme="lemonade" lang="en">
      <body
        className={`flex h-screen bg-orange-100 ${space_grotesk.className}`}
      >
        <WagmiConfig client={client}>
          <LensProvider config={lensConfig}>
            <div className="m-auto max-w-xl items-center justify-center space-y-6">
              <Image
                src={"/logo.svg"}
                alt="Logo"
                width={350}
                height={350}
                className="w-full"
              />
              <div className="flex justify-between">
                <Menu />
                <LensLogout />
              </div>
              <div className="rounded-2xl bg-white p-10 text-center">
                {children}
              </div>
            </div>
          </LensProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
