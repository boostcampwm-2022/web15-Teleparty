import "styled-components";
import { ColorsType } from "./theme";

declare module "styled-components" {
  export interface DefaultTheme {
    colors: ColorsType;
  }
}
