import type { APIRoute } from "astro";
import { parseAndSendMessage } from "../utils/shared";

// Endpoint for the fetch requests
export const POST: APIRoute = async ({ request }) => {
  const result = await parseAndSendMessage(request);
  if (!result.success) {
    return Response.json(result.reply, { status: 400 });
  }

  return new Response();
};
