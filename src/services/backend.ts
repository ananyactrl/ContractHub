export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

async function http<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export const backend = {
  signup(username: string, password: string) {
    return http<{ token: string }>(`/signup`, { method: 'POST', body: JSON.stringify({ username, password }) });
  },
  login(username: string, password: string) {
    return http<{ token: string }>(`/login`, { method: 'POST', body: JSON.stringify({ username, password }) });
  },
  upload(token: string, fileMeta: { filename: string; contentType: string }) {
    return http<{ doc_id: string }>(`/upload`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify(fileMeta) });
  },
  ask(token: string, question: string) {
    return http<{ answer: string; chunks: Array<{ text: string; metadata: any; relevance: number }> }>(`/ask`, { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: JSON.stringify({ q: question }) });
  },
  contracts(token: string) {
    return http(`/contracts`, { headers: { Authorization: `Bearer ${token}` } });
  },
};


