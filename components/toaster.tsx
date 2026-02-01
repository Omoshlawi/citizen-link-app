import React, { FC } from "react";
import { Toast, ToastDescription, ToastTitle } from "./ui/toast";

type ToasterProps = {
  uniqueToastId: string;
  variant?: "solid" | "outline";
  title?: string;
  description?: string;
  render?: () => React.ReactNode;
  action?: "error" | "warning" | "success" | "info" | "muted";
  className?: string;
};
const Toaster: FC<ToasterProps> = ({
  uniqueToastId,
  variant = "outline",
  title,
  description,
  render,
  action = "info",
  className,
}) => {
  return (
    <Toast
      nativeID={uniqueToastId}
      action={action}
      variant={variant}
      className={`${className}`}
    >
      {title && <ToastTitle>{title}</ToastTitle>}
      {description && <ToastDescription>{description}</ToastDescription>}
      {typeof render === "function" && <>{render()}</>}
    </Toast>
  );
};

export default Toaster;
