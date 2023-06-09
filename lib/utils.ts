import omitDeep from "omit-deep";
import { utils } from "ethers";

export const omit = (object: any, name: string) => {
  return omitDeep(object, name);
};

export const splitSignature = (signature: string) => {
  return utils.splitSignature(signature);
};
