export interface MusicianFormFields {
  name: string;
  knownFrom: string | null;
  defaultInstrumentId: string | null;
  authorId: string | null;
}

/**
 * Pulls the musician fields out of a posted admin form so the create and edit
 * actions share one parse. Empty optional fields collapse to null, which lets
 * an edit clear a musician's band, default instrument, or linked author.
 */
export function parseMusicianForm(formData: FormData): MusicianFormFields {
  const name = ((formData.get("name") as string | null) ?? "").trim();
  const knownFrom = ((formData.get("knownFrom") as string | null) ?? "").trim() || null;
  const defaultInstrumentId = ((formData.get("defaultInstrumentId") as string | null) ?? "").trim() || null;
  const authorId = ((formData.get("authorId") as string | null) ?? "").trim() || null;
  return { name, knownFrom, defaultInstrumentId, authorId };
}
