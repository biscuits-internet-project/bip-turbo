import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";

export function CombinedNotes({ items }: { items: string[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const showBullets = items.length > 1;

  useEffect(() => {
    if (contentRef.current) {
      setIsTruncated(contentRef.current.scrollHeight > contentRef.current.clientHeight);
    }
  });

  return (
    <div className="text-sm text-content-text-secondary">
      <div ref={contentRef} className={cn("leading-relaxed", !isExpanded && "line-clamp-2")}>
        {items.map((item) => (
          <div key={item} className={showBullets ? "flex" : ""}>
            {showBullets && <span className="mr-1">•</span>}
            <span>{item}</span>
          </div>
        ))}
      </div>
      {(isTruncated || isExpanded) && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(!isExpanded);
          }}
          className="text-brand-primary hover:text-brand-secondary underline text-xs mt-0.5"
        >
          {isExpanded ? "less" : "more"}
        </button>
      )}
    </div>
  );
}
