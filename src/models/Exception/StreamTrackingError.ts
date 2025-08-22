import { MeteringError } from "./MeteringError";

export class StreamTrackingError extends MeteringError {
  /** Exception for stream tracking errors. */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = "StreamTrackingError";
  }
}
