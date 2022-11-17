import { ToolBoxLayout, ToolBoxCell } from "./ToolBox.styles";

import { colors } from "../../global-styles/theme";
import Icon, { IconType } from "../Icon/Icon";


const TOOL_TYPES = [
  "pen",
  "fill",
  "circle",
  "erase",
  "straight-line",
  "rectangle",
];

const TOOL_ICON_MAP: {
  [key: string]: IconType;
} = {
  pen: "pen",
  fill: "bucket",
  circle: "circle",
  erase: "eraser-alt",
  "straight-line": "link",
  rectangle: "square",
};

const ToolBox = () => {
  return (
    <ToolBoxLayout>
      {TOOL_TYPES.map((toolType) => <ToolBoxCell key={toolType}>
        <Icon color={colors.primary} size={24} icon={TOOL_ICON_MAP[toolType]}></Icon>
        </ToolBoxCell>)}
    </ToolBoxLayout>
  );
};

export default ToolBox;
