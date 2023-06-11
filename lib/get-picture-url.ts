export const getPictureURL = (profile) => {
  let picture = "/avatar.png";
  const profilePicture = profile.picture;
  if (
    profile.picture &&
    profilePicture.original &&
    profilePicture.original.url
  ) {
    if (profilePicture.original.url.startsWith("ipfs://")) {
      const result = profilePicture.original.url.slice(
        7,
        profilePicture.original.url.length
      );
      picture = `https://lens.infura-ipfs.io/ipfs/${result}`;
    } else {
      picture = profilePicture.original.url;
    }
  }

  return picture;
};
