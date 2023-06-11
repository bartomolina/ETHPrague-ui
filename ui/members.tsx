import { Alchemy,Network } from "alchemy-sdk";
import { useEffect, useState } from "react";

import { Member } from "./member";

const settings = {
  apiKey: "pN6wlpnPCLZ7F8vefa8fNTmbD0j1W9gx",
  network: Network.MATIC_MUMBAI,
};

const alchemy = new Alchemy(settings);

export function Members({ linkedAccount }: { linkedAccount: string }) {
  const [members, setMembers] = useState([] as string[]);

  useEffect(() => {
    if (linkedAccount) {
      alchemy.nft
        .getNftsForOwner(linkedAccount, {
          contractAddresses: [
            process.env.NEXT_PUBLIC_MOSAIC_CONTRACT_ADDRESS as string,
          ],
        })
        .then((result) => {
          if (result.ownedNfts) {
            const profileIds = result.ownedNfts
              .map((item) => item.title)
              .filter((value, index, self) => self.indexOf(value) === index);
            setMembers(profileIds);
          }
        });
    }
  }, [linkedAccount]);

  return (
    <>
      {members.length > 0 && (
        <div className="space-y-5 rounded-2xl bg-white p-5 text-center">
          <h1 className="text-xl font-bold text-green-800">Members</h1>
          <div className="flex">
            {members.map((member) => (
              <div key={member}>
                <Member handle={member} />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
