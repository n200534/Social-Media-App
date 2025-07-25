export async function apiFetch<T>(
  url: string,
  options: RequestInit = {},
  auth = false
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  if (auth) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) headers['Authorization'] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.detail || 'API Error');
  }
  return res.json();
} 