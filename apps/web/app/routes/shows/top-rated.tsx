import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getTopRatedShows, type LoaderData, TopRatedComponent, topRatedMeta } from "./top-rated-component";

export const loader = publicLoader<LoaderData>(() => getTopRatedShows(null));

export const meta = () => topRatedMeta();

export default function TopRated() {
  const { shows = [], year } = useSerializedLoaderData<LoaderData>();
  return <TopRatedComponent shows={shows} year={year} />;
}
