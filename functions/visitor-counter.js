import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const store = getStore({ name: "visitor", consistency: "strong" });

  let count = 0;
  const result = await store.get(key);
  count = result ? parseInt(result, 10) : 0;
  count++;

  await store.set("visitor_count", count);

//   return new Response(count);
  return new Response(JSON.stringify({ totalVisitors: count }), {
    headers: { "Content-Type": "application/json" }
  });

};