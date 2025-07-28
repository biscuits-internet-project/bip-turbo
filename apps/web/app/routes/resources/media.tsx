import { useEffect, useState } from "react";
import type { ReactElement } from "react";

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
      } catch (error) {
        console.error("Error fetching media:", error);
      }
    };
    fetchMedia();
  }, []);

  return (
    <div className="">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">News from Nowhere</h1>
        </div>

        <div className="overflow-x-auto rounded-lg border border-content-bg-secondary bg-content-bg">
          <table className="min-w-full divide-y divide-divider">
            <thead className="bg-table-header">
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
            <tbody className="divide-y divide-divider">
              {media.length > 0 ? (
                media.map((m) => (
                  <tr key={m.id || `${m.year}-${m.description}`} className="hover:bg-table-row-hover">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-content-text-primary">{m.year}</td>
                    <td className="px-6 py-4 text-sm">
                      <a
                        href={m.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-brand hover:text-hover-accent"
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
