export const SET_OPTIONS = [
  { value: "S1", label: "Set 1" },
  { value: "S2", label: "Set 2" },
  { value: "S3", label: "Set 3" },
  { value: "E1", label: "Encore 1" },
  { value: "E2", label: "Encore 2" },
  { value: "E3", label: "Encore 3" },
];

export const SEGUE_OPTIONS = [
  { value: "none", label: "No segue" },
  { value: ">", label: ">" },
];

/**
 * Orders set codes for the setlist UI: regular sets first (S1, S2, S3),
 * then encores (E1, E2, E3). Within a group, sort numerically by suffix —
 * an encore is "after the show", so E1 follows S3 even though 1 < 3.
 */
export function compareSets(a: string, b: string): number {
  const setOrder = { S: 0, E: 1 };
  const aType = a.charAt(0) as "S" | "E";
  const bType = b.charAt(0) as "S" | "E";
  const aNum = Number.parseInt(a.slice(1), 10);
  const bNum = Number.parseInt(b.slice(1), 10);

  if (aType !== bType) {
    return setOrder[aType] - setOrder[bType];
  }
  return aNum - bNum;
}
