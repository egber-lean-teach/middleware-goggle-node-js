export interface ReveniumConfig {
  /** Configuration for Revenium metering service. */
  apiKey: string;
  baseUrl?: string;
  logLevel?: string;
  timeout?: number;
}
