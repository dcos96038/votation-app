import FingerprintJS from "@fingerprintjs/fingerprintjs";

export const getVisitorId = async () => {
  const fp = await FingerprintJS.load();

  const result = await fp.get();

  return result.visitorId;
};
