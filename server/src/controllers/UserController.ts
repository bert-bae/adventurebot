import {
  Route,
  Tags,
  Post,
  SuccessResponse,
  Response,
  Controller,
  Example,
  Body,
} from "tsoa";
import { UserService } from "../services/UserService";
import { User } from "@prisma/client";
import { signToken } from "../utils/auth";
import { BadRequest } from "../utils/errors";

@Route("users")
@Tags("Users")
export class UserController extends Controller {
  private userService: UserService;
  constructor() {
    super();
    this.userService = new UserService();
  }

  @SuccessResponse(201, "Created")
  @Post("/")
  @Example<Omit<User, "id">>({
    name: "Foo Bar",
    email: "foo@bar.com",
    password: "foobarrules",
  })
  public async createUser(
    @Body() user: Omit<User, "id">
  ): Promise<{ token: string; refreshToken: string }> {
    if (!user.email || !user.password || !user.name) {
      throw new BadRequest("Required fields are missing");
    }

    const { id, name, email } = await this.userService.create(user);
    const token = signToken({ id, name, email }, "6h");
    const refreshToken = signToken({ id, name, email }, "48h");
    return { token, refreshToken };
  }
}
