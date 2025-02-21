import { useLoaderData } from "react-router-dom";
import type { SuperJSONResult } from "superjson";
import superjson from "superjson";

export function useSerializedLoaderData<T>() {
  const result = useLoaderData() as SuperJSONResult;
  return superjson.deserialize(result) as T;
}
