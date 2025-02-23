export function notFound(message = "Not Found") {
  throw new Response(message, {
    status: 404,
    statusText: message,
  });
}
