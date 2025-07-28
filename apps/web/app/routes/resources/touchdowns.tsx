import React from "react";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
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

interface AcastEpisode {
  id: string;
  title: string;
  description: string;
  publishDate: string;
  duration: number;
  mediaUrl: string;
  image: string;
  url: string;
}

interface AcastApiResponse {
  episodes: AcastEpisode[];
}

export default function Touchdowns() {
  const [episodes, setEpisodes] = useState<AcastEpisode[]>([]);

  useEffect(() => {
    const fetchEpisodes = async () => {
      try {
        const response = await fetch("https://feeder.acast.com/api/v1/shows/d690923d-524e-5c8b-b29f-d66517615b5b?limit=30&from=0");
        const data: AcastApiResponse = await response.json();
        
        setEpisodes(data.episodes || []);
      } catch (error) {
        console.error("Error fetching episodes:", error);
      }
    };

    fetchEpisodes();
  }, []);

  return (
    <div className="">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-content-text-primary mb-6">Touchdowns All Day Podcast</h1>
        </div>
        
        {/* Subtle back link */}
        <div className="flex justify-start">
          <Link 
            to="/resources" 
            className="flex items-center gap-1 text-content-text-tertiary hover:text-content-text-secondary text-sm transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to resources</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {episodes?.map((episode) => (
            <div key={episode.id} className="card-premium rounded-lg overflow-hidden h-full flex flex-col">
              {episode.image && (
                <div className="relative">
                  <img src={episode.image} alt={episode.title} className="w-full h-48 object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <h2 className="text-white text-lg font-semibold line-clamp-2">{episode.title}</h2>
                  </div>
                </div>
              )}

              <div className="p-6 flex-1 flex flex-col">
                <div 
                  className="text-content-text-secondary mb-4 line-clamp-3 flex-1"
                  dangerouslySetInnerHTML={{ __html: episode.description }}
                />
                
                <div className="text-content-text-tertiary text-sm mb-6 space-y-1">
                  <div>Duration: {Math.floor(episode.duration / 60)} minutes</div>
                  <div>Published: {episode.publishDate ? new Date(episode.publishDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  }) : 'Date unavailable'}</div>
                </div>

                <div className="mt-auto">
                  <a
                    href={episode.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-primary hover:text-brand-secondary text-sm font-medium hover:underline transition-colors"
                  >
                    Listen to episode →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {episodes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-content-text-secondary">Loading episodes...</p>
          </div>
        )}
      </div>
    </div>
  );
}
