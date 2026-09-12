"use client";

import { useState, useMemo } from "react";
import { PROBLEMS_DATA } from "@/data/problems";
import { ProblemFilter } from "@/types/problem";
import { filterProblems } from "@/lib/utils";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProblemFilters } from "./ProblemFilters";
import { ProblemSearch } from "./ProblemSearch";
import { ProblemCard } from "./ProblemCard";
import { Button } from "@/components/ui/Button";
import { AlertCircle, RotateCcw, ArrowRight } from "lucide-react";

export function ProblemExplorer() {
  const [currentFilter, setCurrentFilter] = useState<ProblemFilter>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

  // Collect unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    PROBLEMS_DATA.forEach((p) => p.tags.forEach((t) => tagsSet.add(t)));
    return Array.from(tagsSet).sort();
  }, []);

  // Compute counts per difficulty
  const counts = useMemo(() => {
    return {
      all: PROBLEMS_DATA.length,
      easy: PROBLEMS_DATA.filter((p) => p.difficulty === "Easy").length,
      medium: PROBLEMS_DATA.filter((p) => p.difficulty === "Medium").length,
      hard: PROBLEMS_DATA.filter((p) => p.difficulty === "Hard").length,
    };
  }, []);

  // Filter problems
  const filteredProblems = useMemo(() => {
    return filterProblems(PROBLEMS_DATA, searchQuery, currentFilter, selectedTag);
  }, [searchQuery, currentFilter, selectedTag]);

  const handleResetFilters = () => {
    setCurrentFilter("All");
    setSearchQuery("");
    setSelectedTag("All");
  };

  return (
    <section id="problems" className="py-20 sm:py-28">
      <Container size="xl">
        <SectionHeading
          badge="Problem Explorer"
          title="Battle-Tested"
          highlight="Algorithmic Problems"
          description="Master high-yield patterns across dynamic programming, graph theory, trees, and system design with verified constraints."
        />

        {/* Filter & Search Bar */}
        <div className="space-y-4 mb-8">
          <ProblemSearch
            query={searchQuery}
            onQueryChange={setSearchQuery}
            selectedTag={selectedTag}
            onSelectTag={setSelectedTag}
            availableTags={allTags}
          />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
            <ProblemFilters
              currentFilter={currentFilter}
              onSelectFilter={setCurrentFilter}
              counts={counts}
            />

            <div className="text-xs text-text-muted font-mono">
              Showing <span className="text-primary font-bold">{filteredProblems.length}</span> of{" "}
              <span>{PROBLEMS_DATA.length}</span> problems
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        {filteredProblems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onClick={() => {
                  const previewEl = document.getElementById("editor-preview");
                  previewEl?.scrollIntoView({ behavior: "smooth" });
                }}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="rounded-card bg-surface border border-border-subtle p-12 text-center max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-full bg-surface-hover border border-border-subtle flex items-center justify-center mx-auto mb-4 text-text-muted">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-primary mb-2">No problems found</h3>
            <p className="text-sm text-text-secondary mb-6">
              We couldn&apos;t find any problems matching &ldquo;{searchQuery}&rdquo; with the selected filters.
            </p>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              onClick={handleResetFilters}
            >
              Reset Filters
            </Button>
          </div>
        )}

        {/* Bottom CTA / More */}
        <div className="mt-12 text-center">
          <Button
            variant="secondary"
            size="lg"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => alert("Demo: Navigating to Full Problem Archive")}
          >
            Explore All 1,400+ Curated Problems
          </Button>
        </div>
      </Container>
    </section>
  );
}
