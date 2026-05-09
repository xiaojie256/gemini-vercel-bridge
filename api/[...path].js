export const config = {
  runtime: 'edge',
  regions: ['hnd1'], // 核心杀手锏：强制锁定在日本东京节点，彻底避开谷歌的区域封锁
};

export default async function handler(request) {
  // 处理跨域请求 (CORS)
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization'
      }
    });
  }

  const targetUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
  
  // 提取 Anthropic 格式的 Key 或标准的 Bearer Token
  const authKey = request.headers.get("x-api-key") || request.headers.get("Authorization")?.replace("Bearer ", "");
  if (!authKey) return new Response("Missing API Key", { status: 401 });

  // 接收原始请求体
  const body = await request.text();

  // 构造发给谷歌的请求
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
