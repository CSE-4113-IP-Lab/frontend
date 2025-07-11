import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface FilterOption {
  label: string;
  value: string;
}

interface SearchAndFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;

  filterValue: string;
  onFilterChange: (value: string) => void;
  filterLabel: string;
  filterOptions: FilterOption[];

  viewMode?: string;
  onViewModeChange?: (mode: string) => void;
  viewModeOptions?: { label: string; value: string }[];

  onClearFilters?: () => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue,
  onFilterChange,
  filterLabel,
  filterOptions,
  viewMode,
  onViewModeChange,
  viewModeOptions,
  onClearFilters,
}) => {
  return (
    <div className="space-y-4 mb-8">
      {/* View Mode Toggle */}
      {viewModeOptions && onViewModeChange && (
        <div className="flex space-x-2">
          {viewModeOptions.map((option) => (
            <Button
              key={option.value}
              variant={viewMode === option.value ? "default" : "outline"}
              onClick={() => onViewModeChange(option.value)}
              className="rounded-lg">
              {option.label}
            </Button>
          ))}
        </div>
      )}

      {/* Search Bar */}
      <div className="space-y-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full"
        />
      </div>

      {/* Filter Select */}
      <div className="space-y-2">
        <Label htmlFor="filter">{filterLabel}</Label>
        <Select value={filterValue} onValueChange={onFilterChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Select ${filterLabel.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {filterOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters Button */}
      {onClearFilters && (
        <Button variant="outline" onClick={onClearFilters} className="w-full">
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default SearchAndFilter;
