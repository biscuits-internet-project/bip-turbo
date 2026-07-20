import type { ReactElement } from "react";
import { useEffect, useState } from "react";
import { cardVariants } from "~/components/ui/card";

interface Media {
  date: Date;
  url: string;
  year: string;
  description: string;
  media_type: string;
  id?: string;
}

export default function MediaResources(): ReactElement {
  const [media, setMedia] = useState<Media[]>([]);

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch("/api/media-contents");
        if (response.ok) {
          const data = await response.json();
          setMedia(data);
        }
      } catch (_error) {}
    };
    fetchMedia();
  }, []);

  return (
    <div>
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="page-heading">NEWS FROM NOWHERE</h1>
        </div>

        <div
          className={cardVariants({
            variant: "panel",
            className: "overflow-x-auto rounded-lg border",
          })}
        >
          <table className="min-w-full divide-y">
            <thead className="">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-content-text-primary uppercase tracking-wider"
                >
                  Year
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-content-text-primary uppercase tracking-wider"
                >
                  Description
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-content-text-primary uppercase tracking-wider"
                >
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {media.length > 0 ? (
                media.map((m) => (
                  <tr key={m.id || `${m.year}-${m.description}`} className="">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-content-text-primary">{m.year}</td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand-primary hover:text-brand-secondary"
                      >
                        {m.description}
                      </a>
                      <span className="text-content-text-tertiary ml-1">- {m.url ? new URL(m.url).host : ""}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-content-text-primary">{m.media_type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-6 py-4 text-center text-sm text-content-text-secondary">
                    Loading media content...
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
