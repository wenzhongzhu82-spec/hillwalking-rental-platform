"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { CONDITIONS, CONDITION_LABELS } from "@/lib/constants";

interface FilterState {
  categories: string[];
  priceMin: string;
  priceMax: string;
  depositMin: string;
  depositMax: string;
  conditions: string[];
  hillwalkingRecommended: boolean;
  freeOnly: boolean;
}

interface ItemFilterSidebarProps {
  categories: { id: string; name: string }[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  className?: string;
}

const defaultFilters: FilterState = {
  categories: [],
  priceMin: "",
  priceMax: "",
  depositMin: "",
  depositMax: "",
  conditions: [],
  hillwalkingRecommended: false,
  freeOnly: false,
};

export default function ItemFilterSidebar({
  categories,
  filters,
  onFilterChange,
  className,
}: ItemFilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCategory = (id: string) => {
    const next = filters.categories.includes(id)
      ? filters.categories.filter((c) => c !== id)
      : [...filters.categories, id];
    onFilterChange({ ...filters, categories: next });
  };

  const toggleCondition = (cond: string) => {
    const next = filters.conditions.includes(cond)
      ? filters.conditions.filter((c) => c !== cond)
      : [...filters.conditions, cond];
    onFilterChange({ ...filters, conditions: next });
  };

  const handleReset = () => onFilterChange({ ...defaultFilters });

  const CheckboxGroup = ({
    label,
    children,
  }: {
    label: string;
    children: React.ReactNode;
  }) => (
    <div className="mb-5">
      <h4 className="text-xs font-semibold text-muted-dark uppercase tracking-wider mb-2.5">
        {label}
      </h4>
      {children}
    </div>
  );

  const CheckboxItem = ({
    checked,
    onChange,
    label,
  }: {
    checked: boolean;
    onChange: () => void;
    label: string;
  }) => (
    <label className="flex items-center gap-2 py-1 cursor-pointer group">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 rounded border-surface-darker text-primary focus:ring-primary/30 cursor-pointer"
      />
      <span className="text-sm text-muted-dark group-hover:text-foreground transition-colors">
        {label}
      </span>
    </label>
  );

  const filterContent = (
    <div className="space-y-1">
      {/* Categories */}
      <CheckboxGroup label="Categories">
        {categories.map((cat) => (
          <CheckboxItem
            key={cat.id}
            checked={filters.categories.includes(cat.id)}
            onChange={() => toggleCategory(cat.id)}
            label={cat.name}
          />
        ))}
      </CheckboxGroup>

      {/* Price Range */}
      <CheckboxGroup label="Daily Price (¥)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.priceMin}
            onChange={(e) =>
              onFilterChange({ ...filters, priceMin: e.target.value })
            }
            className="w-full h-9 px-2.5 bg-white border border-surface-dark rounded-lg text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <span className="text-muted-light text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.priceMax}
            onChange={(e) =>
              onFilterChange({ ...filters, priceMax: e.target.value })
            }
            className="w-full h-9 px-2.5 bg-white border border-surface-dark rounded-lg text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </CheckboxGroup>

      {/* Deposit Range */}
      <CheckboxGroup label="Deposit (¥)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min"
            value={filters.depositMin}
            onChange={(e) =>
              onFilterChange({ ...filters, depositMin: e.target.value })
            }
            className="w-full h-9 px-2.5 bg-white border border-surface-dark rounded-lg text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
          <span className="text-muted-light text-sm">-</span>
          <input
            type="number"
            placeholder="Max"
            value={filters.depositMax}
            onChange={(e) =>
              onFilterChange({ ...filters, depositMax: e.target.value })
            }
            className="w-full h-9 px-2.5 bg-white border border-surface-dark rounded-lg text-sm placeholder:text-muted-light focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
          />
        </div>
      </CheckboxGroup>

      {/* Condition */}
      <CheckboxGroup label="Condition">
        {CONDITIONS.map((cond) => (
          <CheckboxItem
            key={cond}
            checked={filters.conditions.includes(cond)}
            onChange={() => toggleCondition(cond)}
            label={CONDITION_LABELS[cond] || cond}
          />
        ))}
      </CheckboxGroup>

      {/* Toggles */}
      <CheckboxGroup label="Options">
        <CheckboxItem
          checked={filters.hillwalkingRecommended}
          onChange={() =>
            onFilterChange({
              ...filters,
              hillwalkingRecommended: !filters.hillwalkingRecommended,
            })
          }
          label="Hillwalking Recommended"
        />
        <CheckboxItem
          checked={filters.freeOnly}
          onChange={() =>
            onFilterChange({ ...filters, freeOnly: !filters.freeOnly })
          }
          label="Free Only"
        />
      </CheckboxGroup>

      {/* Action buttons */}
      <div className="flex gap-2 pt-4 border-t border-surface-dark">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          variant="primary"
          size="sm"
          className="flex-1"
          onClick={() => setMobileOpen(false)}
        >
          Apply
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-surface-dark rounded-xl text-sm text-muted-dark shadow-sm mb-4"
        onClick={() => setMobileOpen(true)}
      >
        <SlidersHorizontal className="w-4 h-4" />
        Filters
      </button>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden lg:block w-64 flex-shrink-0 bg-white rounded-2xl border border-surface-dark p-5 shadow-sm h-fit sticky top-20",
          className
        )}
      >
        {filterContent}
      </aside>

      {/* Mobile slide-in panel */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-xl overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="flex items-center justify-between p-5 border-b border-surface-dark">
                <h3 className="text-base font-semibold">Filters</h3>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1 rounded-lg text-muted hover:text-foreground hover:bg-surface transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-5">{filterContent}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
