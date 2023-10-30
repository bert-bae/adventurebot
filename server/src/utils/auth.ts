import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SALTS = 12;
export const JWT_SECRET = "jwt_secret";
export const hashPassword = (password: string) => {
  return bcrypt.hashSync(password, SALTS);
};

export const signToken = (user: Omit<User, "password">, expiresIn?: string) => {
  return jwt.sign(
    {
      data: JSON.stringify(user),
    },
    JWT_SECRET,
    { expiresIn: expiresIn || "24h" }
  );
};
