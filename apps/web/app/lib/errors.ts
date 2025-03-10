export function notFound(message = "Not Found") {
  throw new Response(message, {
    status: 404,
    statusText: message,
  });
}

export function methodNotAllowed(message = "Method not allowed") {
  return new Response(JSON.stringify({ error: message }), {
    status: 405,
    headers: { "Content-Type": "application/json" },
  });
}

export function badRequest(message = "Missing required parameters") {
  return new Response(JSON.stringify({ error: message }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
}

export function unauthorized(message = "Unauthorized") {
  return new Response(JSON.stringify({ error: message }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
