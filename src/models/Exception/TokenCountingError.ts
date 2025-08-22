import { MeteringError } from "./MeteringError";

export class TokenCountingError extends MeteringError {
  /** Exception for token counting errors. */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = "TokenCountingError";
  }
}
