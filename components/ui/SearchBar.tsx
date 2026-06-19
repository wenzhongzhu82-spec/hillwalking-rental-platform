"use client";

import { useState, useRef } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  placeholder?: string;
  defaultValue?: string;
  onSearch?: (query: string) => void;
  className?: string;
  /** Make it controlled */
  value?: string;
  onChange?: (value: string) => void;
  /** Show clear button */
  clearable?: boolean;
}

export default function SearchBar({
  placeholder = "Search hillwalking gear...",
  defaultValue = "",
  onSearch,
  className,
  value: controlledValue,
  onChange,
  clearable = true,
}: SearchBarProps) {
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentValue = isControlled ? controlledValue : internalValue;

  const handleChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    onChange?.(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(currentValue.trim());
  };

  const handleClear = () => {
    handleChange("");
    onSearch?.("");
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative", className)}
    >
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-light pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 pl-10 pr-10 bg-white border border-surface-dark rounded-xl text-sm text-foreground placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
      />
      {clearable && currentValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-muted-light hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </form>
  );
}
