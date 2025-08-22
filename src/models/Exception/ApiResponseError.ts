import { MeteringError } from "./MeteringError";

export class APIResponseError extends MeteringError {
  /** Exception for API response errors. */
  constructor(
    message: string,
    public readonly statusCode?: number,
    public readonly responseData?: any,
    cause?: Error
  ) {
    super(message, cause);
    this.name = "APIResponseError";
  }
}
