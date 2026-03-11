import { Image } from "@/components/ui/image";
import React, { FC, useMemo } from "react";

type LogoProps = Partial<React.ComponentProps<typeof Image>> & {
  mode?: "name" | "icon" | "vertical" | "horizontal";
};
const Logo: FC<LogoProps> = ({ className, mode = "vertical", ...props }) => {
  const source = useMemo(() => {
    if (mode === "icon") return require("../assets/images/logo-icon.png");
    if (mode === "vertical")
      return require("../assets/images/logo-vertical.png");
    if (mode === "horizontal")
      return require("../assets/images/logo-horizontal.png");
    return require("../assets/images/logo-name.png");
  }, [mode]);
  return (
    <Image alt="Logo" className={`${className}`} {...props} source={source} />
  );
};

export default Logo;
