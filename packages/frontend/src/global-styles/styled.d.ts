import "styled-components";
import { ColorsType, GradientsType } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: ColorsType;
    gradients: GradientsType;
  }
}
