import { MeteringError } from "./MeteringError";

export class MiddlewareActivationError extends MeteringError {
  /** Exception for middleware activation errors. */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = "MiddlewareActivationError";
  }
}
