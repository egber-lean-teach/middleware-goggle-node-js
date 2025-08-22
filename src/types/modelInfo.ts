import { Provider } from "./provider";

export interface ModelInfo {
  name: string;
  provider: string;
  modelSource: string;
  sdkType: Provider;
}
