import type { ReviewMinimal, Setlist } from "@bip/domain";
import { Search } from "lucide-react";
import React from "react";
import ArchiveMusicPlayer from "~/components/player";
import { ReviewsList } from "~/components/review";
import { SetlistCard } from "~/components/setlist/setlist-card";
import { SetlistHighlights } from "~/components/setlist/setlist-highlights";
import { Button } from "~/components/ui/button";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { notFound } from "~/lib/errors";
import { formatDateLong } from "~/lib/utils";
import { services } from "~/server/services";

interface ArchiveItem {
  identifier: string;
  title: string;
  date: string;
  collection?: string[];
  creator?: string;
}

interface ShowLoaderData {
  setlist: Setlist;
  reviews: ReviewMinimal[];
  selectedRecordingId: string | null;
}

// Add interface for the beta search API response
interface ArchiveSearchHit {
  _source: {
    identifier: string;
    title?: string;
    date?: string;
  };
}

export const loader = publicLoader(async ({ params }): Promise<ShowLoaderData> => {
  console.log("⚡️ shows.$slug loader:", params.slug);
  const slug = params.slug;
  if (!slug) throw notFound();

  const setlist = await services.setlists.findByShowSlug(slug);
  if (!setlist) throw notFound();

  const reviews = await services.reviews.findByShowId(setlist.show.id);

  // Find Archive.org recordings for this show date
  let archiveRecordings: ArchiveItem[] = [];
  let selectedRecordingId: string | null = null;

  // Make a second request to get the actual items
  const detailsUrl = `https://archive.org/advancedsearch.php?q=collection:DiscoBiscuits AND date:${setlist.show.date}&fl=identifier,title,date&sort=date desc&rows=100&output=json`;

  console.log("Fetching recording details:", detailsUrl);

  const detailsResponse = await fetch(detailsUrl);
  if (!detailsResponse.ok) {
    throw new Error(`Failed to fetch recording details: ${detailsResponse.status}`);
  }

  const detailsData = await detailsResponse.json();

  if (detailsData?.response?.docs && detailsData.response.docs.length > 0) {
    archiveRecordings = detailsData.response.docs as ArchiveItem[];

    if (archiveRecordings.length > 0) {
      selectedRecordingId = archiveRecordings[0].identifier;
    }
  } else {
    console.log("No recording details found despite having hits in the count");
  }

  return { setlist, reviews, selectedRecordingId };
});

export function meta({ data }: { data: { json: ShowLoaderData } }) {
  const showDate = formatDateLong(data.json.setlist.show.date);
  const venueName = data.json.setlist.show.venue?.name ?? "Unknown Venue";
  const cityState = `${data.json.setlist.show.venue?.city}, ${data.json.setlist.show.venue?.state}`;

  return [
    { title: `${showDate} - ${venueName} - ${cityState} | Biscuits Internet Project` },
    {
      name: "description",
      content: `View setlist, reviews, and recordings from the Disco Biscuits show at ${venueName} in ${cityState} on ${showDate}.`,
    },
  ];
}

export default function Show() {
  const { setlist, reviews, selectedRecordingId } = useSerializedLoaderData<ShowLoaderData>();

  return (
    <div className="w-full">
      {/* Header with show date and venue */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 mt-4">
        <div>
          <h1 className="text-4xl font-bold text-white">{formatDateLong(setlist.show.date)}</h1>
          <p className="text-xl text-gray-300 mt-2">
            {setlist.venue.name} - {setlist.venue.city}, {setlist.venue.state}
          </p>
        </div>

        {/* <Button variant="outline">EDIT SHOW</Button> */}
      </div>

      {/* Main content area with responsive grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left column: Setlist */}
        <div className="lg:col-span-8">
          <SetlistCard key={setlist.show.id} setlist={setlist} />

          {/* Reviews section moved up to fill whitespace */}
          <div className="mt-6">
            <ReviewsList reviews={reviews} />
          </div>
        </div>

        {/* Right column: Highlights and additional content */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-4 space-y-6">
            {/* Music Player */}
            {selectedRecordingId ? (
              <div>
                <ArchiveMusicPlayer identifier={selectedRecordingId} />
              </div>
            ) : (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-medium text-white mb-2">No Recording Available</h3>
                <p className="text-gray-400 text-sm">
                  No Archive.org recording was found for this show date. Check back later or try a different show.
                </p>
                <a
                  href="https://archive.org/details/DiscoBiscuits"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 text-sm mt-4 inline-block"
                >
                  Browse all Disco Biscuits recordings
                </a>
              </div>
            )}

            {/* Highlights panel */}
            <SetlistHighlights setlist={setlist} />
          </div>
        </div>
      </div>
    </div>
  );
}
