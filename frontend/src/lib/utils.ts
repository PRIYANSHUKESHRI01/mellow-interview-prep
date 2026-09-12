import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple Tailwind CSS classes cleanly resolving conflicts.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Filter problems array based on search term, difficulty filter, and optional tag.
 */
export function filterProblems<T extends { title: string; difficulty: string; tags: string[]; description?: string }>(
  problems: T[],
  searchQuery: string,
  difficultyFilter: string,
  selectedTag?: string
): T[] {
  const query = searchQuery.trim().toLowerCase();
  
  return problems.filter((problem) => {
    // Difficulty match
    if (difficultyFilter !== "All" && problem.difficulty.toLowerCase() !== difficultyFilter.toLowerCase()) {
      return false;
    }

    // Tag match
    if (selectedTag && selectedTag !== "All" && !problem.tags.includes(selectedTag)) {
      return false;
    }

    // Search query match in title, tags, or description
    if (query) {
      const matchTitle = problem.title.toLowerCase().includes(query);
      const matchTags = problem.tags.some((t) => t.toLowerCase().includes(query));
      const matchDesc = problem.description ? problem.description.toLowerCase().includes(query) : false;
      return matchTitle || matchTags || matchDesc;
    }

    return true;
  });
}
