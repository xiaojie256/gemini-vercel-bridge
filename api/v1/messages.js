export const config = {
  runtime: 'edge',
  regions: ['hnd1'], // 锁定日本，破除谷歌400地域限制
};

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    });
  }

  const targetUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  
  const authKey = request.headers.get("x-api-key") || request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!authKey) return new Response("Missing API Key", { status: 401 });

  const body = await request.text();

  const newRequest = new Request(targetUrl, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${authKey}`
    },
    body: body || null
  });

  return fetch(newRequest);
}
