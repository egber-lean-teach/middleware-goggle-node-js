export enum Provider {
  GOOGLE_AI_SDK = "google_ai_sdk",
  VERTEX_AI_SDK = "vertex_ai_sdk",
}
export interface ProviderMetadata {
  provider: string;
  modelSource: string;
  sdkType: Provider;
}
