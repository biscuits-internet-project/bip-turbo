import type { LoaderFunction, LoaderFunctionArgs } from "react-router-dom";
import superjson from "superjson";

interface LoaderContext {
  auth?: {
    userId: string;
    role: string;
  };
  requestId?: string;
}

export function createLoader<T>(
  fn: (args: LoaderFunctionArgs, context: LoaderContext) => Promise<T>,
  options?: {
    auth?: boolean;
    metrics?: boolean;
    rateLimit?: boolean;
  },
): LoaderFunction {
  return async (args) => {
    const context: LoaderContext = {};
    const startTime = performance.now();

    try {
      // Auth middleware
      //   if (options?.auth) {
      //     const authToken = await getAuthToken(args.request);
      //     if (!authToken) {
      //       throw redirect('/login');
      //     }
      //     context.auth = await validateToken(authToken);
      //   }

      //   // Request tracking
      //   if (options?.metrics) {
      //     context.requestId = crypto.randomUUID();
      //     console.log(`🔄 Request ${context.requestId} started: ${args.request.url}`);
      //   }

      //   // Rate limiting
      //   if (options?.rateLimit) {
      //     await checkRateLimit(args.request);
      //   }

      // Execute the loader with context
      const result = await fn(args, context);

      // Metrics logging
      if (options?.metrics) {
        const duration = performance.now() - startTime;
        console.log(`✅ Request ${context.requestId} completed in ${duration}ms`);
      }

      return superjson.serialize(result);
    } catch (error) {
      // Error handling middleware
      if (options?.metrics) {
        console.error(`❌ Request ${context.requestId} failed:`, error);
      }
      throw error;
    }
  };
}

// You could even create preset configurations:
export const protectedLoader = <T>(fn: (args: LoaderFunctionArgs, context: LoaderContext) => Promise<T>) =>
  createLoader(fn, { auth: true, metrics: true });

export const publicLoader = <T>(fn: (args: LoaderFunctionArgs, context: LoaderContext) => Promise<T>) =>
  createLoader(fn, { metrics: true });

// Then use like:
export const sensitiveDataLoader = protectedLoader(async (args, context) => {
  // Already has auth and metrics!
});
