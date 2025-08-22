import { MeteringError } from "./MeteringError";

export class ConfigurationError extends MeteringError {
  /** Exception for configuration errors. */
  constructor(message: string, cause?: Error) {
    super(message, cause);
    this.name = "ConfigurationError";
  }
}
