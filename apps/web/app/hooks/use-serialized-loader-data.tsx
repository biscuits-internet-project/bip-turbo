import type { LoaderFunction } from "react-router";
import { useLoaderData } from "react-router-dom";
import { deserialize } from "superjson";
import type { SuperJSONResult } from "superjson";

// Helper type to unwrap the loader return type
type LoaderReturnType<T> = T extends (...args: unknown[]) => Promise<infer R> ? R : never;

export function useSerializedLoaderData<T extends LoaderFunction>() {
  const serialized = useLoaderData() as SuperJSONResult;
  return deserialize(serialized) as LoaderReturnType<T>;
}
