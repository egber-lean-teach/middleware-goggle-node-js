export class MeteringError extends Error {
  /** Base exception for metering-related errors. */
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = "MeteringError";

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, MeteringError);
    }
  }
}
