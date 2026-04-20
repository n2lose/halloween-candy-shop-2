type SearchBarProps = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
};

export default function SearchBar({
  value,
  onChange,
  placeholder = "Search orders, ingredients, or spirits...",
  className = "",
}: SearchBarProps) {
  return (
    <div className={`relative ${className}`}>
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40 text-lg pointer-events-none">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-surface-container-lowest rounded-full pl-10 pr-4 py-2
                   text-sm text-on-surface placeholder:text-outline/40 outline-none
                   focus:ring-1 focus:ring-primary/50 transition-all"
      />
    </div>
  );
}
