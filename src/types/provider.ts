export enum Provider {
  /** Supported Google AI providers. */
  GOOGLE_AI_SDK = "google_ai_sdk",
  VERTEX_AI_SDK = "vertex_ai_sdk",
}
export interface ProviderMetadata {
  provider: string; // Always "Google" for unified reporting
  modelSource: string; // Always "GOOGLE"
  sdkType: Provider; // Which SDK is being used
}
