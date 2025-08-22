import { APIResponseError, logger, MeteringError } from "../models";
import { MeteringRequest } from "../types";

/**
 * Send metering data to Revenium.
 */
export async function sendMeteringData(
  meteringRequest: MeteringRequest,
  apiKey: string,
  baseUrl: string = "https://api.revenium.io/meter/v2"
): Promise<void> {
  try {
    const response = await fetch(`${baseUrl}/ai/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "User-Agent": "revenium-middleware-google-nodejs/0.1.0",
      },
      body: JSON.stringify(meteringRequest),
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new APIResponseError(
        `Metering API request failed with status ${response.status}`,
        response.status,
        errorData
      );
    }

    logger.debug("Metering data sent successfully to Revenium");
  } catch (error) {
    if (error instanceof MeteringError) {
      throw error;
    }

    logger.error("Failed to send metering data to Revenium:", error);
    throw new MeteringError(
      "Failed to send metering data to Revenium",
      error as Error
    );
  }
}
