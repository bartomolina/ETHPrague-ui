import { utils } from "ethers";
import omitDeep from "omit-deep";

export const omit = (object: any, name: string) => {
  return omitDeep(object, name);
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};
