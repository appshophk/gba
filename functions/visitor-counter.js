export default async (req, context) => {
  if (!context.blob) {
    return new Response(JSON.stringify({
      error: "Netlify Blob API is not available - make sure you're deploying to Netlify with the modern runtime."
    }), { status: 500, headers: {"Content-Type":"application/json"} });
  }

  const key = "visitor_count";
  const store = "main";
  let count = 0;
  const result = await context.blob.get(key, { store });
  count = result ? parseInt(result, 10) : 0;
  count++;
  await context.blob.set(key, count.toString(), { store });
  return new Response(JSON.stringify({ totalVisitors: count }), {
    headers: { "Content-Type": "application/json" }
  });
}
