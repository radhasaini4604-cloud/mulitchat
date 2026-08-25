const accountId = localStorage.getItem('api-key-cloudflare-account') || import.meta.env.VITE_CLOUDFLARE_ACCOUNT_ID || "a3fc173c2b06b226e3b3be38fe1c126b";
const apiToken = localStorage.getItem('api-key-cloudflare-token') || import.meta.env.VITE_CLOUDFLARE_API_TOKEN || "cfat_YhefWQbjhjrbi1F0outvPLvyWgOtkeXVN0Ml1wMZ3fdcf2b1";
const kvNamespaceId = import.meta.env.VITE_CLOUDFLARE_KV_NAMESPACE_ID || "2f7cc864e51c464cae3cfa356a46e382";

export async function getKvValue(key: string): Promise<string | null> {
  if (!accountId || !apiToken || !kvNamespaceId || kvNamespaceId.includes("your-cloudflare")) {
    console.warn("Cloudflare KV credentials not fully configured. Using local storage backup.");
    return localStorage.getItem(`kv_mock:${key}`);
  }

  const modelPath = `/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvNamespaceId}/values/${key}`;
  const endpoint = `/cloudflare-api${modelPath}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      }
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`KV Error: ${response.status}`);
    return await response.text();
  } catch (err) {
    console.error("Failed to read from Cloudflare KV, falling back to local storage:", err);
    return localStorage.getItem(`kv_mock:${key}`);
  }
}

export async function putKvValue(key: string, value: string): Promise<boolean> {
  // Always save locally first as a fallback/cache
  localStorage.setItem(`kv_mock:${key}`, value);

  if (!accountId || !apiToken || !kvNamespaceId || kvNamespaceId.includes("your-cloudflare")) {
    return true;
  }

  const modelPath = `/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvNamespaceId}/values/${key}`;
  const endpoint = `/cloudflare-api${modelPath}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      },
      body: value
    });
    if (!response.ok) throw new Error(`KV Error: ${response.status}`);
    return true;
  } catch (err) {
    console.error("Failed to write to Cloudflare KV:", err);
    return false;
  }
}

export async function deleteKvValue(key: string): Promise<boolean> {
  localStorage.removeItem(`kv_mock:${key}`);

  if (!accountId || !apiToken || !kvNamespaceId || kvNamespaceId.includes("your-cloudflare")) {
    return true;
  }

  const modelPath = `/client/v4/accounts/${accountId}/storage/kv/namespaces/${kvNamespaceId}/values/${key}`;
  const endpoint = `/cloudflare-api${modelPath}`;
  
  try {
    const response = await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${apiToken}`,
      }
    });
    if (!response.ok && response.status !== 404) throw new Error(`KV Error: ${response.status}`);
    return true;
  } catch (err) {
    console.error("Failed to delete key from Cloudflare KV:", err);
    return false;
  }
}
