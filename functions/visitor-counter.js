import { getStore } from "@netlify/blobs";
import { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
  const store = getStore({ name: "visitor"});

  let count = 0;
  const key = "visitor_count";
  const result = await store.get(key);
  count = result ? parseInt(result, 10) : 0;
  count++;

  await store.set(key, count);

//   return new Response(count);
  return new Response(JSON.stringify({ totalVisitors: count }), {
    headers: { "Content-Type": "application/json" }
  });

};