import { LucideIcon } from "lucide-react-native";
import React, { FC } from "react";
import { Box } from "../ui/box";
import {
  ButtonIcon,
  ButtonText,
  Button as GlueStackButton,
} from "../ui/button";

type ButtonProps = {
  text: string;
  onPress?: () => void;
  prefixIcon?: LucideIcon;
  suffixIcon?: LucideIcon;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  disabled?: boolean;
};
const Button: FC<ButtonProps> = ({
  text,
  onPress,
  prefixIcon,
  suffixIcon,
  size,
  disabled = false,
}) => {
  return (
    <GlueStackButton
      className={`w-full rounded-full bg-background-btn justify-start`}
      size={size}
      onPress={onPress}
      disabled={disabled}
    >
      {!!prefixIcon && <ButtonIcon as={prefixIcon} className="text-white" />}
      <ButtonText className="text-white">{text}</ButtonText>
      {!!suffixIcon && <Box className="flex-1 text-white" />}
      {!!suffixIcon && <ButtonIcon as={suffixIcon} className="text-white" />}
    </GlueStackButton>
  );
};

export default Button;
