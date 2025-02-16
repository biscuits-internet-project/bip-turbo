import type { Show, Track } from "@bip/domain";
import type { LoaderFunctionArgs } from "react-router";
import { Form, Link, useLoaderData, useSearchParams } from "react-router";
import superjson from "superjson";
import { services } from "~/server/services";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const year = url.searchParams.get("year") || new Date().getFullYear() - 1;

  // retrieve shows for the given year using drizzle SQL<Shows>
  const shows = await services.shows.findMany({});
  const { json: data, meta } = superjson.serialize({ shows, year });
  return { data, meta };
}

function groupTracksBySet(tracks: Track[]) {
  const sets = new Map<string, Track[]>();
  const encores = new Map<string, Track[]>();

  for (const track of tracks) {
    const setName = track.set || "S1";
    const isEncore = setName.startsWith("E");
    const targetMap = isEncore ? encores : sets;

    if (!targetMap.has(setName)) {
      targetMap.set(setName, []);
    }
    targetMap.get(setName)?.push(track);
  }

  // Convert sets to array and sort
  const mainSets = Array.from(sets.entries()).sort();
  const encoreSets = Array.from(encores.entries()).sort();

  // If there's only one encore, remove the number
  if (encoreSets.length === 1) {
    const [[key, tracks]] = encoreSets;
    encoreSets[0] = ["E", tracks];
  }

  return [...mainSets, ...encoreSets];
}

function getShowAnnotations(tracks: Track[]) {
  const annotationMap = new Map<string, number>();
  const annotations: string[] = [];
  let counter = 1;

  // First pass: collect annotations in order of appearance
  const orderedSets = groupTracksBySet(tracks);
  for (const [_, setTracks] of orderedSets) {
    for (const track of setTracks) {
      if (track.annotations?.[0]?.desc) {
        const annotation = track.annotations[0].desc;
        if (!annotationMap.has(annotation)) {
          annotationMap.set(annotation, counter++);
          annotations.push(annotation);
        }
      }
    }
  }

  return { annotationMap, annotations };
}

export default function Shows() {
  const { data, meta } = useLoaderData<typeof loader>();
  const { shows, year } = superjson.deserialize({ json: data, meta }) as { shows: Show[]; year: string };

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-8">{year} Shows</h1>
      <div className="space-y-8">
        {shows.map((show: Show) => {
          const { annotationMap, annotations } = show.tracks ? getShowAnnotations(show.tracks) : { annotationMap: new Map(), annotations: [] };

          return (
            <div key={show.id} className="bg-gray-900 rounded-lg p-6 shadow-lg">
              <div className="mb-4">
                <div className="text-gray-400 text-lg mb-1">
                  {new Date(show.date).toLocaleDateString("en-US", {
                    month: "numeric",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
                <div className="text-gray-100 font-medium text-xl">
                  {show.venue?.name} - {show.venue?.city}, {show.venue?.state}
                </div>
              </div>

              {show.notes && <div className="mb-4 text-gray-400 italic text-base">{show.notes}</div>}

              <div className="space-y-2 text-base">
                {show.tracks &&
                  groupTracksBySet(show.tracks).map(([setName, tracks]) => (
                    <div key={setName} className="flex">
                      <span className="text-gray-400 w-8">{setName}</span>
                      <div className="flex-1">
                        {tracks.map((track: Track, index: number) => (
                          <span key={track.id} className="inline-flex items-baseline">
                            <span className="text-violet-400 hover:text-violet-300">{track.song?.title}</span>
                            {track.annotations?.[0]?.desc && <sup className="text-gray-500 text-sm ml-0.5">{annotationMap.get(track.annotations[0].desc)}</sup>}
                            {index < tracks.length - 1 && <span className="text-gray-600 mx-1">{track.segue ? " > " : ", "}</span>}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>

              {annotations.length > 0 && (
                <div className="mt-4 space-y-1 text-base">
                  {annotations.map((text) => (
                    <div key={text} className="text-gray-400">
                      <sup>{annotationMap.get(text)}</sup> {text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
