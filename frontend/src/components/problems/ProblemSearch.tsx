"use client";

import { Search, Tag } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface ProblemSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
  selectedTag: string;
  onSelectTag: (tag: string) => void;
  availableTags: string[];
}

export function ProblemSearch({
  query,
  onQueryChange,
  selectedTag,
  onSelectTag,
  availableTags,
}: ProblemSearchProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
      {/* Search Input */}
      <div className="flex-1">
        <Input
          placeholder="Search problem title, pattern, or tags..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          onClear={() => onQueryChange("")}
          leftIcon={<Search className="w-4 h-4" />}
          aria-label="Search problems"
        />
      </div>

      {/* Category / Tag filter */}
      <div className="sm:w-52 shrink-0">
        <select
          value={selectedTag}
          onChange={(e) => onSelectTag(e.target.value)}
          aria-label="Filter by algorithmic category"
          className="w-full h-10 px-3 rounded-control bg-surface border border-border-subtle text-xs text-primary font-mono focus:outline-none focus:border-accent-primary cursor-pointer transition-colors"
        >
          <option value="All">All Topics</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
