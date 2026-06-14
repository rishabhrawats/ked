const PUBLIC_URL = (import.meta.env.BASE_URL || "").replace(/\/$/, "");
export const API_BASE = `${PUBLIC_URL}/api`;

function readCookie(name) {
  const match = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=").slice(1).join("=")) : "";
}

export async function api(path, options = {}) {
  const method = options.method || "GET";
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData) && options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }
  if (!["GET", "HEAD", "OPTIONS"].includes(method.toUpperCase())) {
    const csrf = readCookie("ked_csrf");
    if (csrf) headers.set("X-CSRF-Token", csrf);
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: "include",
    body:
      options.body instanceof FormData || options.body === undefined
        ? options.body
        : JSON.stringify(options.body),
  });
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = Array.isArray(payload.detail)
      ? payload.detail.map((item) => item.msg).join(", ")
      : payload.detail || "Request failed";
    throw new Error(message);
  }
  return payload;
}
