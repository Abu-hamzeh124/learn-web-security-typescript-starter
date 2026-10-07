import type { RequestHandler } from "express";
import { timingSafeEqual } from "node:crypto";

export function validateRequestOrigin(_appOrigin: string): RequestHandler {
  return (_req, _res, next) => {
    if (_req.method !== "POST") return next();

    const origin = _req.header("Origin");
    if (origin) {
      if (origin === _appOrigin) return next();
      _res.status(403).send("Wrong origin");
      return;
    }

    const referer = _req.header("Referer");
    if (referer) {
      try {
        if (new URL(referer).origin === _appOrigin) return next();
      } catch {
        // malformed Referer: fall through to rejection
      }
    }

    _res.status(403).send("Missing or invalid origin");
  };
}

export function csrfTokensMatch(_expected: string, _actual: unknown): boolean {
  if (!_actual || typeof _actual !== "string") return false;

  const expetedBuff = Buffer.from(_expected);
  const actualBuff = Buffer.from(_actual);

  return timingSafeEqual(expetedBuff, actualBuff);
}
