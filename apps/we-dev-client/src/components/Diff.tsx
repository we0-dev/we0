import React, { useMemo, useState } from "react";

type FilesMap = Record<string, string>;

interface DiffProps {
  oldFiles: FilesMap;
  newFiles: FilesMap;
}

function computeChangedFiles(oldFiles: FilesMap, newFiles: FilesMap): string[] {
  const fileSet = new Set<string>([...Object.keys(oldFiles || {}), ...Object.keys(newFiles || {})]);
  const changed: string[] = [];
  for (const path of fileSet) {
    const a = oldFiles?.[path] ?? "";
    const b = newFiles?.[path] ?? "";
    if (a !== b) changed.push(path);
  }
  return changed.sort();
}

function simpleLineDiff(a: string, b: string): { type: "ctx" | "add" | "del"; text: string }[] {
  const aLines = (a || "").split("\n");
  const bLines = (b || "").split("\n");
  const max = Math.max(aLines.length, bLines.length);
  const out: { type: "ctx" | "add" | "del"; text: string }[] = [];
  for (let i = 0; i < max; i++) {
    const al = aLines[i];
    const bl = bLines[i];
    if (al === bl) {
      if (al !== undefined) out.push({ type: "ctx", text: al });
    } else {
      if (al !== undefined) out.push({ type: "del", text: al });
      if (bl !== undefined) out.push({ type: "add", text: bl });
    }
  }
  return out;
}

const Diff: React.FC<DiffProps> = ({ oldFiles, newFiles }) => {
  const [activePath, setActivePath] = useState<string | null>(null);
  const changedFiles = useMemo(() => computeChangedFiles(oldFiles, newFiles), [oldFiles, newFiles]);
  const diffLines = useMemo(() => {
    if (!activePath) return [];
    return simpleLineDiff(oldFiles?.[activePath] ?? "", newFiles?.[activePath] ?? "");
  }, [activePath, oldFiles, newFiles]);

  return (
    <div className="flex h-full">
      <div className="w-64 border-r border-gray-200 dark:border-gray-700 overflow-auto">
        {changedFiles.map((p) => (
          <button
            key={p}
            onClick={() => setActivePath(p)}
            className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${
              activePath === p ? "bg-gray-100 dark:bg-gray-800" : ""
            }`}
          >
            {p}
          </button>
        ))}
        {changedFiles.length === 0 && (
          <div className="p-3 text-sm text-gray-500">No changes</div>
        )}
      </div>
      <div className="flex-1 overflow-auto p-3 text-sm font-mono whitespace-pre">
        {!activePath && changedFiles.length > 0 && (
          <div className="text-gray-500">Select a file to view diff</div>
        )}
        {activePath && (
          <div>
            <div className="mb-2 font-semibold">{activePath}</div>
            {diffLines.map((l, idx) => (
              <div key={idx} className={l.type === "add" ? "text-green-600" : l.type === "del" ? "text-red-600" : "text-gray-800 dark:text-gray-200"}>
                {l.type === "add" ? "+ " : l.type === "del" ? "- " : "  "}
                {l.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export { Diff };

