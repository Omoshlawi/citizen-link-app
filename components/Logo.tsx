import { Image } from "@/components/ui/image";
import React, { FC } from "react";

type LogoProps = Partial<React.ComponentProps<typeof Image>> & {
  mode?: "name" | "logo";
};
const Logo: FC<LogoProps> = ({ className, mode = "logo", ...props }) => {
  if (mode === "logo")
    return (
      <Image
        alt="Logo"
        className={`w-80 h-80 ${className}`}
        {...props}
        source={require("../assets/images/logo-bgless.png")}
      />
    );
  return (
    <Image
      alt="Logo"
      className={`${className}`}
      {...props}
      source={require("../assets/images/app-name.png")}
    />
  );
};

export default Logo;
