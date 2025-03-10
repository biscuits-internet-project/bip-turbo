import type { ProtectedContext, PublicContext } from "~/lib/base-loaders";

declare module "react-router" {
  export interface LoaderFunctionArgs {
    context: PublicContext | ProtectedContext;
  }
  export interface ActionFunctionArgs {
    context: PublicContext | ProtectedContext;
  }
}
