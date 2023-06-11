import { useProfile } from "@lens-protocol/react-web";
import Image from "next/image";

import { getPictureURL } from "@/lib/get-picture-url";

export function Member({ handle }) {
  const { data: profile, loading } = useProfile({ handle });

  return (
    <>
      {profile && (
        <div className="w-36 items-center space-y-3 rounded-md">
          <Image
            src={getPictureURL(profile)}
            alt={profile?.handle}
            width={60}
            height={60}
            className="m-auto rounded-full object-cover"
          />
          <h2 className="text-sm">{profile?.name}</h2>
        </div>
      )}
    </>
  );
}
