import IcomoonReact from "icomoon-react";

import iconSet from "../../assets/icon-selection.json";

type iconType =
  | "flow-line"
  | "bucket"
  | "eraser-alt"
  | "pen"
  | "download"
  | "circle"
  | "square"
  | "refresh-cw"
  | "mic-off"
  | "mic"
  | "check"
  | "paper-plane"
  | "check-circled"
  | "link"
  | "volume-medium"
  | "mute2";

interface IconProps {
  className?: string;
  color?: string;
  size: string | number;
  icon: iconType;
}

const Icon = ({ className, color, size, icon }: IconProps) => {
  return (
    <IcomoonReact
      className={className || ""}
      iconSet={iconSet}
      color={color}
      size={size}
      icon={icon}
    />
  );
};

export default Icon;
