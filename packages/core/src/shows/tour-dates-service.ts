import type { TourDate } from "@bip/domain";
import type { RedisClientType } from "redis";
import type { RedisService } from "../_shared/redis";

export class TourDatesService {
  private readonly TOUR_DATES_KEY = "tour-dates";
  constructor(private readonly redis: RedisService) {}

  async getNextXTourDates(x: number): Promise<TourDate[]> {
    const tourDates = await this.getTourDates();
    return tourDates.slice(0, x);
  }

  async getTourDates(): Promise<TourDate[]> {
    const cachedTourDates = await this.redis.get<TourDate[]>(this.TOUR_DATES_KEY);
    if (cachedTourDates) {
      return cachedTourDates;
    }

    const tourDates = await this.#getTourDatesExternal();
    if (tourDates.length > 0) {
      await this.redis.set<TourDate[]>(this.TOUR_DATES_KEY, tourDates, { EX: 60 * 60 * 1 }); // 1 hour
    }
    return tourDates;
  }

  async #getTourDatesExternal(): Promise<TourDate[]> {
    const response = await fetch(
      "https://cdn.seated.com/api/tour/261deef5-93c4-4d64-8582-dff697ce4644?include=tour-events",
    );
    const data: TourResponse = await response.json();

    const tourDates: TourDate[] = data.included.map((obj) => ({
      venueName: obj.attributes["venue-name"],
      formattedStartDate: obj.attributes["starts-at-short"],
      formattedEndDate: obj.attributes["ends-at-short"],
      date: obj.attributes["starts-at"],
      details: obj.attributes.details,
      address: obj.attributes["formatted-address"],
    }));

    tourDates.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

    return tourDates;
  }
}

interface TourResponse {
  included: Array<{
    attributes: {
      "venue-name": string;
      "starts-at-short": string;
      "ends-at-short": string;
      "starts-at": string;
      details: string;
      "formatted-address": string;
    };
  }>;
}
