import React from "react";
import Button from "./Button";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  title: string;
  options: FilterOption[];
  activeFilter: string | number;
  onFilterChange: any;
}

const FilterBar: React.FC<FilterBarProps> = ({
  title,
  options,
  activeFilter,
  onFilterChange,
}) => {
  return (
    <div className="bg-secondary-gray p-4 mb-6">
      <h3 className="font-bold text-sm uppercase mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <Button
            key={option.value}
            variant={activeFilter === option.value ? "primary" : "outline"}
            size="sm"
            cornerStyle="tr"
            onClick={() => onFilterChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
