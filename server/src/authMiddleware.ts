import * as express from "express";
import * as jwt from "jsonwebtoken";
import { AuthorizationError } from "./utils/errors";
import { JWT_SECRET } from "./utils/auth";

export function expressAuthentication(
  req: express.Request,
  securityName: string,
  scopes: string[]
): Promise<any> {
  const bearer = req.headers["authorization"] || req.headers["Authorization"];
  return new Promise((resolve, reject) => {
    if (!bearer) {
      reject(new AuthorizationError("No token provided"));
    }
    const token = (bearer as string).split(" ")[1];
    jwt.verify(token, JWT_SECRET, function (err: any, decoded: any) {
      if (err) {
        reject(err);
      } else {
        // Check if JWT contains all required scopes
        for (let scope of scopes) {
          if (!decoded.scopes.includes(scope)) {
            reject(new Error("JWT does not contain required scope."));
          }
        }
        const user = JSON.parse(decoded.data);
        resolve(user);
      }
    });
  });
}
