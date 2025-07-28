import type { TourDate } from "@bip/domain";
import { Card } from "~/components/ui/card";
import { useSerializedLoaderData } from "~/hooks/use-serialized-loader-data";
import { publicLoader } from "~/lib/base-loaders";
import { services } from "~/server/services";

interface LoaderData {
  tourDates: TourDate[];
}

export const loader = publicLoader<LoaderData>(async () => {
  const tourDates = Array.isArray(await services.tourDatesService.getTourDates())
    ? await services.tourDatesService.getTourDates()
    : [];

  console.log(tourDates);

  return { tourDates };
});

export function meta() {
  return [
    { title: "Tour Dates | Biscuits Internet Project" },
    {
      name: "description",
      content: "View upcoming Disco Biscuits tour dates and shows.",
    },
  ];
}

export default function TourDates() {
  const { tourDates = [] } = useSerializedLoaderData<LoaderData>();
  const dates = Array.isArray(tourDates) ? tourDates : [];

  return (
    <div className="">
      <div className="space-y-6 md:space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-bold text-white">Tour Dates</h1>
        </div>

        <Card className="bg-content-bg border-content-bg-secondary">
          <div className="relative overflow-x-auto">
            <table className="w-full text-md">
              <thead>
                <tr className="text-left text-sm text-muted-foreground border-b border-border/40">
                  <th className="p-4">Date</th>
                  <th className="p-4">Venue</th>
                  <th className="p-4">Address</th>
                </tr>
              </thead>
              <tbody>
                {dates.map((td: TourDate) => (
                  <tr
                    key={td.formattedStartDate + td.venueName}
                    className="border-b border-border/40 hover:bg-accent/5"
                  >
                    <td className="p-4 text-white">
                      {td.formattedStartDate === td.formattedEndDate
                        ? td.formattedStartDate
                        : `${td.formattedStartDate} - ${td.formattedEndDate}`}
                    </td>
                    <td className="p-4 text-white font-medium">{td.venueName}</td>
                    <td className="p-4 text-content-text-secondary">{td.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
