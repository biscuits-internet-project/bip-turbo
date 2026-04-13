const MINOR_WORDS = new Set([
  "a",
  "an",
  "the",
  "and",
  "but",
  "or",
  "nor",
  "for",
  "yet",
  "so",
  "as",
  "at",
  "by",
  "from",
  "in",
  "into",
  "of",
  "on",
  "to",
  "till",
  "up",
  "x",
]);

export function toTitleCase(input: string): string {
  const trimmed = input.trim();

  if (trimmed === trimmed.toUpperCase()) {
    return trimmed;
  }

  const words = trimmed.split(" ");
  const length = words.length;

  const result = words.map((word, index) => {
    if (word === "") return word;

    const isFirst = index === 0;
    const isLast = index === length - 1;
    const previousWord = index > 0 ? words[index - 1] : "";
    const isAfterSeparator = previousWord.endsWith(":") || word.startsWith("(") || previousWord.toLowerCase() === "x";

    if (isFirst || isAfterSeparator) {
      return word;
    }

    if (MINOR_WORDS.has(word.toLowerCase()) && !isLast) {
      return word.toLowerCase();
    }

    if (/^[a-z]+$/.test(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }

    return word;
  });

  return result.join(" ");
}
