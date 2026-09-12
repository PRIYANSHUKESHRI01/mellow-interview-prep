"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

// Dynamically import Monaco Editor to avoid SSR errors and optimize bundle
const Editor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-72 sm:h-80 bg-elevated animate-pulse p-4 flex flex-col justify-between font-mono text-xs text-text-muted">
      <div className="space-y-2">
        <div className="h-4 bg-surface rounded w-3/4" />
        <div className="h-4 bg-surface rounded w-1/2" />
        <div className="h-4 bg-surface rounded w-2/3" />
        <div className="h-4 bg-surface rounded w-1/3" />
      </div>
      <div className="text-center text-text-muted text-xs">Loading Monaco Editor Engine...</div>
    </div>
  ),
});

interface MonacoPreviewProps {
  code: string;
  language: string;
  onChange: (value?: string) => void;
  height?: string;
}

export function MonacoPreview({
  code,
  language,
  onChange,
  height = "320px",
}: MonacoPreviewProps) {
  const [editorTheme, setEditorTheme] = useState<"vs-dark" | "light">("vs-dark");

  // Sync editor theme with document theme
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setEditorTheme(isDark ? "vs-dark" : "light");

    const observer = new MutationObserver(() => {
      const darkNow = document.documentElement.classList.contains("dark");
      setEditorTheme(darkNow ? "vs-dark" : "light");
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  // Map our language IDs to Monaco language identifiers
  const getMonacoLanguage = (id: string) => {
    switch (id) {
      case "cpp":
        return "cpp";
      case "python":
        return "python";
      case "java":
        return "java";
      case "javascript":
        return "javascript";
      case "rust":
        return "rust";
      default:
        return "cpp";
    }
  };

  return (
    <div className="w-full overflow-hidden border-t border-border-subtle bg-elevated">
      <Editor
        height={height}
        language={getMonacoLanguage(language)}
        value={code}
        theme={editorTheme}
        onChange={onChange}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          readOnly: false,
          automaticLayout: true,
          tabSize: 4,
          padding: { top: 12, bottom: 12 },
          fontFamily: "var(--font-mono), Consolas, Monaco, monospace",
          fontLigatures: true,
          folding: true,
          renderLineHighlight: "all",
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
