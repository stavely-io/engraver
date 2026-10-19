import React, { type FC } from "react";

import { EngraverMenuButton } from "../common/engraver-menu-button";
import { EngraverMenuCell } from "../common/engraver-menu-cell";

interface EngraverOptionCell<
  T extends string | number,
> extends React.HTMLAttributes<HTMLDivElement> {
  cellOptions: T[];
  icons: Record<T, FC | null>;
  selectedOption: T;
  onOptionClick: (newValue: T) => void;
}

export const EngraverOptionCell = <T extends string | number>({
  cellOptions,
  icons,
  selectedOption,
  onOptionClick,
  ...divProps
}: EngraverOptionCell<T>) => {
  return (
    <EngraverMenuCell {...divProps}>
      {cellOptions.map((option, index) => {
        const icon = icons[option];
        const isSelected = selectedOption === option;
        if (icon)
          return (
            <EngraverMenuButton
              key={index}
              selected={isSelected}
              onClick={() => onOptionClick(option)}
            >
              {React.createElement(icon)}
            </EngraverMenuButton>
          );
      })}
    </EngraverMenuCell>
  );
};
