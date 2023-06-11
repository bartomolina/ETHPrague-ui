import { development } from "@lens-protocol/react-web";
import { bindings as wagmiBindings } from "@lens-protocol/wagmi";

export const lensConfig = {
  bindings: wagmiBindings(),
  environment: development,
};
