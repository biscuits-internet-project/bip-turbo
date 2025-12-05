import { z } from "zod";

/**
 * MCP Utility Functions
 * Shared utilities for MCP endpoint responses and error handling
 */

// Standard MCP response wrapper
export function mcpSuccess<T>(data: T) {
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=300", // Cache for 5 minutes
    },
  });
}

// MCP error response
export function mcpError(error: string, details?: unknown, status = 500) {
  return new Response(
    JSON.stringify({
      error,
      details,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

// Validation error response
export function mcpValidationError(zodError: z.ZodError) {
  return mcpError("Validation failed", zodError.errors, 400);
}

// Parse and validate JSON request body
export async function parseRequestBody<T>(
  request: Request,
  schema: z.ZodSchema<T>,
): Promise<{ success: true; data: T } | { success: false; response: Response }> {
  try {
    const body = await request.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return {
        success: false,
        response: mcpValidationError(result.error),
      };
    }

    return {
      success: true,
      data: result.data,
    };
  } catch (error) {
    return {
      success: false,
      response: mcpError("Invalid JSON body", error instanceof Error ? error.message : "Unknown error", 400),
    };
  }
}

// Format date to string (handles Date objects and strings)
export function formatDate(date: Date | string | null): string | null {
  if (!date) return null;
  if (typeof date === "string") return date;
  return date.toISOString().split("T")[0];
}

// Format venue location
export function formatVenueLocation(city: string, state: string | null, country: string): string {
  if (state) {
    return `${city}, ${state}`;
  }
  return `${city}, ${country}`;
}
