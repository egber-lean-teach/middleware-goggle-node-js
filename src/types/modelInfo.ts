import { Provider } from "./provider";

export interface ModelInfo {
  /** Information about the AI model being used. */
  name: string;
  provider: string;
  modelSource: string;
  sdkType: Provider;
}
