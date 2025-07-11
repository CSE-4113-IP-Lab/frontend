interface SearchBarProps {
  searchTerm: string;
  onChange: React.Dispatch<React.SetStateAction<string>>;
  className?: string;       // optional container wrapper className
  inputClassName?: string;  // optional input element className
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onChange,
  className = '',
  inputClassName = '',
  placeholder = 'Search...',
}) => (
  <div className={className}>
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 ${inputClassName}`}
    />
  </div>
);

export default SearchBar;
