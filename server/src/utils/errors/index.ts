export class CustomError extends Error {
  constructor(public code: number, msg: string) {
    super(msg);
    this.message = msg;
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class AuthorizationError extends CustomError {
  constructor(msg: string) {
    super(401, msg);
    this.message = "Authorzation failed: " + this.message;
    Object.setPrototypeOf(this, AuthorizationError.prototype);
  }
}

export class AuthenticationError extends CustomError {
  constructor(msg: string) {
    super(404, msg);
    this.message = "Authentication failed: " + this.message;
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}

export class BadRequest extends CustomError {
  constructor(msg: string) {
    super(400, msg);
    this.message = "Bad request: " + this.message;
    Object.setPrototypeOf(this, BadRequest.prototype);
  }
}

export class NotFound extends CustomError {
  constructor(msg: string) {
    super(404, msg);
    this.message = "Not found: " + this.message;
    Object.setPrototypeOf(this, NotFound.prototype);
  }
}
