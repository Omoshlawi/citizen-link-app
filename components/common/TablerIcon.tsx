/* eslint-disable import/namespace */
import { useComputedColorScheme } from "@/hooks/use-color-scheme";
import * as TablerIconsReactNative from "@tabler/icons-react-native";
import React from "react";

type _TablerIconName = keyof typeof TablerIconsReactNative;

export type TablerIconName = {
  [K in _TablerIconName]: K extends `Icon${infer Rest}` ? Rest : never;
}[_TablerIconName];

type IconActivityProps = React.ComponentProps<
  typeof TablerIconsReactNative.IconActivity
>;

interface TablerIconProps extends Omit<IconActivityProps, "stroke"> {
  name: TablerIconName;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const TablerIcon: React.FC<TablerIconProps> = ({
  name,
  size = 24,
  color = "currentColor",
  strokeWidth = 2,
  ...props
}) => {
  const theme = useComputedColorScheme();
  const iconName = `Icon${name}` as _TablerIconName;
  const IconComponent = TablerIconsReactNative[
    iconName
  ] as typeof TablerIconsReactNative.IconActivity;

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in Tabler icons library`);
    return null;
  }

  return React.createElement(IconComponent, {
    size,
    strokeWidth,
    color:
      color === "currentColor" ? (theme === "dark" ? "#fff" : "#000") : color,
    ...props,
  });
};

export default TablerIcon;
