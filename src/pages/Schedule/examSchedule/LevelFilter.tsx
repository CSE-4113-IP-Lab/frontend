import React from "react";

interface Props {
  selectedLevel: string;
  onChange: (level: string) => void;
  className?: string;           // container wrapper classes
  buttonClassName?: string;     // common button classes
  activeClassName?: string;     // styles for active button
  inactiveClassName?: string;   // styles for inactive button
  levels?: string[];            
}

const defaultLevels = ["All", "Undergraduate", "Masters"];

const LevelFilter: React.FC<Props> = ({
  selectedLevel,
  onChange,
  className = "flex flex-wrap gap-2",
  buttonClassName = "px-4 py-2 rounded-md text-sm transition-colors",
  activeClassName = "bg-blue-900 text-white",
  inactiveClassName = "bg-gray-200 text-gray-700 hover:bg-gray-300",
  levels = defaultLevels,
}) => (
  <div className={className}>
    {levels.map((level) => (
      <button
        key={level}
        onClick={() => onChange(level)}
        className={`${buttonClassName} ${
          selectedLevel === level ? activeClassName : inactiveClassName
        }`}
      >
        {level}
      </button>
    ))}
  </div>
);

export default LevelFilter;
