import "styled-components";
import { ColorsType, GradientsType, BackgroundsType, ShadowsType } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: ColorsType;
    gradients: GradientsType;
    backgrounds: BackgroundsType;
    shadows: ShadowsType;
  }
}
