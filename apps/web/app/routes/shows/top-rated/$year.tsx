import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { getTopRatedShows, type LoaderData, TopRatedComponent, topRatedMeta } from "../top-rated-component";

export const loader = publicLoader<LoaderData>(async ({ params }) => {
  const year = params.year ? Number(params.year) : null;
  return getTopRatedShows(year);
});

export function meta({ params }: { params: { year?: string } }) {
  const year = params.year ? Number(params.year) : undefined;
  return topRatedMeta(year);
}

export default function TopRatedYear() {
  const { shows = [], year } = useSerializedLoaderData<LoaderData>();
  return <TopRatedComponent shows={shows} year={year} />;
}
