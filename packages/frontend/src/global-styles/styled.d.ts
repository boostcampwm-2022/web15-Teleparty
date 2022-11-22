import "styled-components";
import { ColorsType, ShadowsType } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: ColorsType;
    shadows: ShadowsType;
  }
}
