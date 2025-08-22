import { Provider, ProviderMetadata } from "../types/provider";

/**
 * Create provider metadata for Google AI SDK.
 */
export function createGoogleAIMetadata(): ProviderMetadata {
  return {
    provider: "Google",
    modelSource: "GOOGLE",
    sdkType: Provider.GOOGLE_AI_SDK,
  };
}
