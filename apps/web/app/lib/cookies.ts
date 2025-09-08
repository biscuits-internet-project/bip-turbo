/**
 * Cookie utility functions using modern Cookie Store API with fallback to document.cookie
 */

export interface CookieOptions {
  path?: string;
  maxAge?: number;
  expires?: Date;
  domain?: string;
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

// Type for Cookie Store API
interface CookieStore {
  set: (name: string, value: string, options?: Record<string, unknown>) => Promise<void>;
  get: (name: string) => Promise<{ name: string; value: string } | undefined>;
  delete: (name: string) => Promise<void>;
  getAll: () => Promise<Array<{ name: string; value: string }>>;
}

type WindowWithCookieStore = Window & { cookieStore: CookieStore };

/**
 * Set a cookie using Cookie Store API with fallback to document.cookie
 */
export async function setCookie(name: string, value: string, options: CookieOptions = {}): Promise<void> {
  const cookieOptions = {
    path: "/",
    ...options,
  };

  try {
    // Use Cookie Store API if available
    if ("cookieStore" in window) {
      await (window as WindowWithCookieStore).cookieStore.set(name, value, cookieOptions);
      return;
    }
  } catch (error) {
    console.warn("Cookie Store API failed, falling back to document.cookie:", error);
  }

  // Fallback to document.cookie
  let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

  if (cookieOptions.path) {
    cookieString += `; path=${cookieOptions.path}`;
  }

  if (cookieOptions.maxAge !== undefined) {
    cookieString += `; max-age=${cookieOptions.maxAge}`;
  }

  if (cookieOptions.expires) {
    cookieString += `; expires=${cookieOptions.expires.toUTCString()}`;
  }

  if (cookieOptions.domain) {
    cookieString += `; domain=${cookieOptions.domain}`;
  }

  if (cookieOptions.secure) {
    cookieString += "; secure";
  }

  if (cookieOptions.sameSite) {
    cookieString += `; samesite=${cookieOptions.sameSite}`;
  }

  // biome-ignore lint/suspicious/noDocumentCookie: Fallback for Cookie Store API compatibility
  document.cookie = cookieString;
}

/**
 * Get a cookie value by name
 */
export async function getCookie(name: string): Promise<string | null> {
  try {
    // Use Cookie Store API if available
    if ("cookieStore" in window) {
      const cookie = await (window as WindowWithCookieStore).cookieStore.get(name);
      return cookie?.value || null;
    }
  } catch (error) {
    console.warn("Cookie Store API failed, falling back to document.cookie:", error);
  }

  // Fallback to document.cookie
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [cookieName, ...cookieValue] = cookie.split("=");
    if (cookieName.trim() === name) {
      return decodeURIComponent(cookieValue.join("=").trim());
    }
  }

  return null;
}

/**
 * Delete a cookie by name
 */
export async function deleteCookie(name: string, options: Pick<CookieOptions, "path" | "domain"> = {}): Promise<void> {
  const deleteOptions = {
    path: "/",
    ...options,
  };

  try {
    // Use Cookie Store API if available
    if ("cookieStore" in window) {
      await (window as WindowWithCookieStore).cookieStore.delete(name);
      return;
    }
  } catch (error) {
    console.warn("Cookie Store API failed, falling back to document.cookie:", error);
  }

  // Fallback to document.cookie - set expiry date in the past
  await setCookie(name, "", {
    ...deleteOptions,
    expires: new Date(0),
  });
}

/**
 * Clear all cookies (for logout functionality)
 */
export async function clearAllCookies(): Promise<void> {
  try {
    // Use Cookie Store API if available
    if ("cookieStore" in window) {
      const cookies = await (window as WindowWithCookieStore).cookieStore.getAll();
      await Promise.all(
        cookies.map((cookie: { name: string }) =>
          (window as unknown as WindowWithCookieStore).cookieStore.delete(cookie.name),
        ),
      );
      return;
    }
  } catch (error) {
    console.warn("Cookie Store API failed, falling back to document.cookie:", error);
  }

  // Fallback to document.cookie
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name] = cookie.split("=");
    if (name.trim()) {
      await deleteCookie(name.trim());
    }
  }
}
