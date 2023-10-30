import { User } from "@prisma/client";
import { UserModel } from "../models/UserModel";

export class UserService {
  private userModel: UserModel;
  constructor() {
    this.userModel = new UserModel();
  }

  public async get(userId: string): Promise<User> {
    const user = await this.userModel.get({ id: userId });
    return user;
  }

  public async getByEmail(email: string): Promise<User> {
    const user = await this.userModel.get({ email });
    return user;
  }

  public async create(
    user: Parameters<typeof this.userModel.create>[0]
  ): Promise<Omit<User, "password">> {
    const created = await this.userModel.create(user);
    return { id: created.id, name: user.name, email: user.email };
  }
}
