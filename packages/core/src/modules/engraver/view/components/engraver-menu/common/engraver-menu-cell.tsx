import { cn } from "@/utils/style";
import { FC, HTMLAttributes } from "react";

export const EngraverMenuCell: FC<HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cn(
        "border-muted-foreground flex flex-row gap-[6px] border-r px-[6px] py-[5px]",
        className,
      )}
    >
      {children}
    </div>
  );
};
