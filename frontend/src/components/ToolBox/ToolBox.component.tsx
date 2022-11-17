import { useAtom } from "jotai";

import { ToolBoxLayout, ToolBoxCell } from "./ToolBox.styles";

import { colors } from "../../global-styles/theme";
import { TOOL_TYPES, toolAtom } from "../../store/tool";
import Icon, { IconType } from "../Icon/Icon";

const TOOL_ICON_MAP: {
  [key: string]: IconType;
} = {
  pen: "pen",
  fill: "bucket",
  circle: "circle",
  erase: "eraser-alt",
  straightLine: "flow-line",
  rectangle: "square",
};

const ToolBox = () => {
  const [tool, setTool] = useAtom(toolAtom);

  return (
    <ToolBoxLayout>
      {TOOL_TYPES.map((toolType) => (
        <ToolBoxCell
          className={toolType === tool ? "selected" : ""}
          key={toolType}
          onClick={() => setTool(toolType)}
        >
          <Icon
            color={colors.primary}
            size={24}
            icon={TOOL_ICON_MAP[toolType]}
          ></Icon>
        </ToolBoxCell>
      ))}
    </ToolBoxLayout>
  );
};

export default ToolBox;
