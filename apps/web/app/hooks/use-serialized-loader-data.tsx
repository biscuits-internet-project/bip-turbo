import { useLoaderData } from "react-router-dom";

export function useSerializedLoaderData<T>() {
  return useLoaderData() as T;
}
