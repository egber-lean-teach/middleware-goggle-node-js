import { v4 as uuidv4 } from "uuid";

/**
 * Generate a unique transaction ID.
 */
export function generateTransactionId(): string {
  return uuidv4();
}
