export default async (request, context) => {
  const key = "count";
  const store = "visitors"; // You can choose any store name

  // Get current count (persistent across invocations)
  let count = 0;
  try {
    // netlify provides `.get` on the blob helper. Must specify store.
    const result = await context.blob.get(key, { store });
    count = result ? parseInt(result, 10) : 0;
  } catch (e) {
    count = 0;
  }

  // Always increment count on every request
  count++;

  // Save the updated count
  await context.blob.set(key, count.toString(), { store });

  return new Response(JSON.stringify({ totalVisitors: count }), {
    headers: { "Content-Type": "application/json" },
  });
};
