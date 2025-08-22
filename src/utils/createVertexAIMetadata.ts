import { Provider, ProviderMetadata } from "../types/provider";

/**
 * Create provider metadata for Vertex AI SDK.
 */
export function createVertexAIMetadata(): ProviderMetadata {
  return {
    provider: "Google",
    modelSource: "GOOGLE",
    sdkType: Provider.VERTEX_AI_SDK,
  };
}
