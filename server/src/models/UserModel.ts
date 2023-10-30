import { nanoid } from "nanoid";
import { prisma } from "../db/pg";
import { AuthenticationError, NotFound } from "../utils/errors";
import { User, Prisma } from "@prisma/client";
import { hashPassword } from "../utils/auth";

export class UserModel {
  private prisma: typeof prisma;
  constructor() {
    this.prisma = prisma;
  }

  public async get(where: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({
      where,
    });
    if (!user) {
      throw new NotFound("User does not exist");
    }

    return user;
  }

  public async getByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new NotFound("User does not exist");
    }

    return user;
  }

  public async create(user: Pick<User, "name" | "password" | "email">) {
    const userId = nanoid();
    await this.prisma.user.create({
      data: {
        ...user,
        password: hashPassword(user.password),
        id: userId,
      },
    });

    return { id: userId };
  }
}
