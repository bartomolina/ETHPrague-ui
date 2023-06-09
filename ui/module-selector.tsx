/* app/page.tsx */
"use client";

import { client, setFollowModule } from "@/lib/lens-client";
import { ethers } from "ethers";

import { LensHubAbi, LensHubContract } from "@/lib/lens-client";

import { splitSignature } from "ethers/lib/utils.js";

import { omit } from "@/lib/utils";

export function ModuleSelector({ profile, token }) {
  async function updateModule() {
    try {
      const typedResult = await client.mutate({
        mutation: setFollowModule,
      });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const typedData =
        typedResult.data.createSetFollowModuleTypedData.typedData;
      const lensHub = new ethers.Contract(LensHubContract, LensHubAbi, signer);
      const signature = await await signer._signTypedData(
        omit(typedData.domain, "__typename"),
        omit(typedData.types, "__typename"),
        omit(typedData.value, "__typename")
      );
      const { v, r, s } = splitSignature(signature);

      console.log("setting...");

      console.log(typedData);

      const result = await lensHub.setFollowModuleWithSig({
        profileId: typedData.value.profileId,
        followModule: typedData.value.followModule,
        followModuleInitData: typedData.value.followModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: typedData.value.deadline,
        },
      });

      console.log("done...");

      console.log("result: ", result);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      {token && (
        <>
          {/* <div>
            {profile?.followModule ? profile.followModule.type : "Not set"}
          </div>
          <div>{profile?.handle}</div>
          <div>{profile?.id}</div> */}
          <button onClick={updateModule} className="btn btn-primary">
            Upgrade profile
          </button>
        </>
      )}
    </>
  );
}
