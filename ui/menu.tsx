import { useActiveProfile } from "@lens-protocol/react-web";
import Link from "next/link";

export function Menu() {
  const { data: activeProfile } = useActiveProfile();

  return (
    <>
      {activeProfile && (
        <ul className="menu rounded-box menu-horizontal bg-base-100">
          <li>
            <Link href={"/"}>Register</Link>
          </li>
          <li>
            <Link href={"/join"}>Join</Link>
          </li>
        </ul>
      )}
    </>
  );
}
