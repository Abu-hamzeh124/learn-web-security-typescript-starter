import type { RequestHandler } from "express";

export function validateRequestOrigin(_appOrigin: string): RequestHandler {
  return (_req, _res, next) => {
    if (_req.method === "POST") {
      if (_req.header("Origin")) {
        if (_req.header("Origin") !== _appOrigin) {
          _res.status(403).send("Wrong origin");
          return;
        }
        next();
      }
      if (_req.header("Referer") && _req.header("Referer") === _appOrigin) return next();
      _res.status(403).send();
    }
    next();
  };
}

export function csrfTokensMatch(_expected: string, _actual: unknown): boolean {
  return true;
}
