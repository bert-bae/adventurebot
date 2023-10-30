import {
  Body,
  Controller,
  Example,
  Post,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
import bcrypt from "bcrypt";
import { UserService } from "../services/UserService";
import { User } from "@prisma/client";
import { AuthorizationError, NotFound } from "../utils/errors";
import { signToken } from "../utils/auth";

type UserLoginRequest = Pick<User, "email" | "password">;
type UserAuthorizationRequest = { token: string; refreshToken: string };

@Route("auth")
@Tags("Authorization")
export class AuthorizationController extends Controller {
  private userService: UserService;
  constructor() {
    super();
    this.userService = new UserService();
  }

  /**
   * Pass credentials to verify user login.
   * @param loginRequest The user email and password
   * @example login {
   *  "password": "SomeSecurePassword12345",
   *  "email": "test@example.com"
   * }
   */
  @SuccessResponse(200, "Authenticated")
  @Response<NotFound>(404, "User not found")
  @Response<AuthorizationError>(401, "Invalid crendentials")
  @Post("/login")
  @Example<UserLoginRequest>({
    email: "tsoa@example.com",
    password: "SomeComplexPassword12345",
  })
  public async login(
    @Body() login: UserLoginRequest
  ): Promise<UserAuthorizationRequest> {
    const { email, password } = login;
    const user = await this.userService.getByEmail(email);
    const check = await bcrypt.compare(password, user.password);
    if (!check) {
      throw new AuthorizationError("Invalid credentials.");
    }

    const token = signToken(
      {
        name: user.name,
        email: user.email,
        id: user.id,
      },
      "6h"
    );
    const refreshToken = signToken(
      {
        name: user.name,
        email: user.email,
        id: user.id,
      },
      "48h"
    );
    return {
      token,
      refreshToken,
    };
  }
}
