import { createHmac } from "node:crypto";

const SIGNED_DOWNLOAD_TTL_SECONDS = 5 * 60;

export function createSignedDownloadPath(
  signingKey: Buffer,
  fileId: number,
  nowSeconds: number = currentUnixTime(),
): string {
  const expires = nowSeconds + SIGNED_DOWNLOAD_TTL_SECONDS;
  const signature = signDownload(signingKey, fileId, expires);
  return `/files/${fileId}/signed-download?expires=${expires}&signature=${signature}`;
}

export function verifySignedDownload(
  _signingKey: Buffer,
  _fileId: number,
  expiresValue: string,
  signature: string,
  nowSeconds: number = currentUnixTime(),
): boolean {
  if (!/^\d+$/.test(expiresValue) || !/^[a-f0-9]{64}$/.test(signature)) {
    return false;
  }

  const expires = Number(expiresValue);
  if (!Number.isSafeInteger(expires) || expires <= nowSeconds) {
    return false;
  }

  const signBuff = Buffer.from(signature);
  const expectedSign = signDownload(signBuff, _fileId, expires);
  
  return expectedSign === signature;
}

function signDownload(
  _signingKey: Buffer,
  _fileId: number,
  _expires: number,
): string {
  const hash = `GET\n/files/${_fileId}/signed-download\n${_expires}`;
  const signature = createHmac("sha-256", _signingKey,)
    .update(hash)
    .digest("hex");
  
  return signature;
}

function currentUnixTime(): number {
  
  return Math.floor(Date.now() / 1000);
}
