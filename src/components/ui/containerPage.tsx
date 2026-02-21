import React from "react";
import { cn } from "@/lib/utils";

interface ContainerPageProps {
  children: React.ReactNode;
  className?: string;
}

const ContainerPage = ({ children, className }: ContainerPageProps) => {
  return (
    <div
      className={cn(
        "mx-auto px-6 py-10 flex flex-col items-center justify-center h-full",
        className,
      )}>
      {children}
    </div>
  );
};

export default ContainerPage;
