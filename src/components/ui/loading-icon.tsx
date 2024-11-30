import { LoaderCircle } from "lucide-react";
import React from "react";

import { cn } from "@/lib/utils";

export interface LoadingIconProps {
  className?: string;
}

export const LoadingIcon: React.FC<LoadingIconProps> = ({ className }) => {
  return (
    <LoaderCircle className={cn("animate-spin duration-700", className)} />
  );
};
