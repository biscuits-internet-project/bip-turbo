import React from "react";
import { useEffect, useState } from "react";
import { publicLoader } from "~/lib/base-loaders";

export const loader = publicLoader<void>(async () => {});

export function meta() {
  return [
    { title: "Touchdowns All Day Podcast | Biscuits Internet Project" },
    {
      name: "description",
      content:
        "Step inside the mind of Jon Barber as he breaks down jams, interviews guests, and discusses all things Disco Biscuits on Touchdowns All Day w/ Jon Barber.",
    },
    { property: "og:image", content: "/public/tdad.jpg" },
  ];
}

interface IPodcast {
  title: string;
  links: string[];
  itunes: {
    image: string;
    subtitle: string;
    duration: string;
  };
}

// Define a simplified RSS item type
interface RssItem {
  title?: string;
  link?: string;
  contentSnippet?: string;
  itunes?: {
    image?: string;
    duration?: string;
  };
}

export default function Touchdowns() {
  const [podcasts, setPodcasts] = useState<IPodcast[]>([]);

  useEffect(() => {
    const fetchPodcasts = async () => {
      try {
        const response = await fetch("https://rss.acast.com/touchdownsallday");
        const responseData = await response.text();

        // Fallback to fetch-based approach without external parser
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(responseData, "text/xml");
        const items = Array.from(xmlDoc.querySelectorAll("item"));

        const parsedItems = items.map((item) => {
          const title = item.querySelector("title")?.textContent || "";
          const link = item.querySelector("link")?.textContent || "";
          const description = item.querySelector("description")?.textContent || "";
          const image = item.querySelector("itunes\\:image")?.getAttribute("href") || "/public/tdad.jpg";
          const duration = item.querySelector("itunes\\:duration")?.textContent || "";

          return {
            title,
            links: link ? [link] : [],
            itunes: {
              image,
              subtitle: description,
              duration,
            },
          };
        });

        setPodcasts(parsedItems);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
      }
    };

    fetchPodcasts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Touchdowns All Day Podcast</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {podcasts?.map((pod, index) => (
          <div key={`podcast-${pod.title}-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-semibold line-clamp-2">{pod.title}</h2>
            </div>

            {pod.itunes.image && <img src={pod.itunes.image} alt={pod.title} className="w-full h-64 object-cover" />}

            <div className="p-4">
              <p className="text-gray-700 mb-4 line-clamp-3">{pod.itunes.subtitle}</p>

              <div className="text-center">
                <a
                  href="https://www.osirispod.com/podcasts/touchdowns-all-day-with-jon-barber/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Check it out
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
