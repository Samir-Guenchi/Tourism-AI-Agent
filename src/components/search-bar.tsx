"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Minus,
  Plus,
  Check,
  ChevronDown,
} from "lucide-react";

export type SearchField =
  | {
      key: string;
      label: string;
      placeholder: string;
      type: "select";
      options: string[];
      value: string;
      onChange: (value: string) => void;
    }
  | {
      key: string;
      label: string;
      placeholder: string;
      type: "date";
      value: string;
      onChange: (value: string) => void;
    }
  | {
      key: string;
      label: string;
      placeholder: string;
      type: "counter";
      value: number;
      min: number;
      suffix: string;
      onChange: (value: number) => void;
    };

const fieldIcon = {
  select: MapPin,
  date: Calendar,
  counter: Users,
};

export default function SearchBar({
  fields,
  onSearch,
}: {
  fields: SearchField[];
  onSearch?: () => void;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setActive(null);
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const toggle = (key: string) => {
    setActive((prev) => (prev === key ? null : key));
    setQuery("");
  };

  const displayValue = (field: SearchField) => {
    if (field.type === "counter") return `${field.value} ${field.suffix}`;
    return field.value || "";
  };

  return (
    <div ref={rootRef} className="relative mb-6">
      <div className="flex flex-wrap items-center gap-2 rounded-full border border-border/40 bg-background p-1.5 shadow-sm">
        {fields.map((field, i) => {
          const Icon = fieldIcon[field.type];
          const isActive = active === field.key;
          const value = displayValue(field);

          return (
            <Fragment key={field.key}>
              {i > 0 && <div className="hidden h-8 w-px bg-border sm:block" />}
              <div className="min-w-[150px] flex-1">
                <button
                  type="button"
                  onClick={() => toggle(field.key)}
                  className={`w-full rounded-full px-4 py-2 text-left transition-colors cursor-pointer ${
                    isActive ? "bg-muted/70" : "hover:bg-muted/60"
                  }`}
                >
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-foreground">
                    {field.label}
                  </span>
                  <span className={`flex items-center gap-1.5 truncate text-sm ${value ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {value || field.placeholder}
                    <ChevronDown
                      className={`h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${isActive ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>

                {isActive && (
                  <div className="absolute left-0 top-full z-50 mt-2 w-full min-w-[240px] max-w-xs rounded-2xl border border-border/40 bg-background p-3 shadow-xl sm:left-auto">
                    {field.type === "select" && (
                      <>
                        <div className="mb-2 flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <input
                            autoFocus
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={`Search ${field.label.toLowerCase()}...`}
                            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                          />
                        </div>
                        <div className="max-h-56 overflow-y-auto">
                          {field.options
                            .filter((o) =>
                              o.toLowerCase().includes(query.trim().toLowerCase())
                            )
                            .map((option) => (
                              <button
                                key={option}
                                type="button"
                                onClick={() => {
                                  field.onChange(option);
                                  setActive(null);
                                }}
                                className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors hover:bg-muted cursor-pointer ${
                                  field.value === option
                                    ? "font-medium text-foreground"
                                    : "text-muted-foreground"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {option}
                                </span>
                                {field.value === option && (
                                  <Check className="h-4 w-4 text-foreground" />
                                )}
                              </button>
                            ))}
                          {field.options.filter((o) =>
                            o.toLowerCase().includes(query.trim().toLowerCase())
                          ).length === 0 && (
                            <p className="px-3 py-2 text-sm text-muted-foreground">
                              No results
                            </p>
                          )}
                        </div>
                      </>
                    )}

                    {field.type === "date" && (
                      <div className="flex items-center gap-2 rounded-xl border border-border/40 bg-muted/30 px-3 py-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <input
                          autoFocus
                          type="date"
                          value={field.value}
                          onChange={(e) => field.onChange(e.target.value)}
                          className="flex-1 bg-transparent text-sm outline-none"
                        />
                      </div>
                    )}

                    {field.type === "counter" && (
                      <div className="flex items-center justify-between gap-4 py-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{field.label}</p>
                          <p className="text-xs text-muted-foreground">{field.placeholder}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => field.onChange(Math.max(field.min, field.value - 1))}
                            disabled={field.value <= field.min}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-colors hover:bg-muted disabled:pointer-events-none disabled:opacity-40 cursor-pointer"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-6 text-center text-sm font-semibold text-foreground">
                            {field.value}
                          </span>
                          <button
                            type="button"
                            onClick={() => field.onChange(field.value + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/40 text-muted-foreground transition-colors hover:bg-muted cursor-pointer"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </Fragment>
          );
        })}

        <button
          type="button"
          onClick={onSearch}
          className="flex shrink-0 items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90 cursor-pointer"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </div>
    </div>
  );
}
