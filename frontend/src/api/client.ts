import axios from "axios";
import { getTokens, setAccessToken, clearTokens } from "../store/tokenStorage";

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// ─── Request: attach access token ────────────────────────────────────────────

client.interceptors.request.use((config) => {
  const { access_token } = getTokens();
  if (access_token) config.headers.Authorization = `Bearer ${access_token}`;
  return config;
});

// ─── Response: handle 401 with concurrent refresh queue ──────────────────────

let isRefreshing = false;
let queue: Array<{ resolve: (token: string) => void; reject: (err: unknown) => void }> = [];

const processQueue = (error: unknown, token: string | null) => {
  queue.forEach(({ resolve, reject }) => (error ? reject(error) : resolve(token!)));
  queue = [];
};

client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config as typeof error.config & { _retry?: boolean };
    if (error.response?.status !== 401 || original._retry) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => queue.push({ resolve, reject }))
        .then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return client(original);
        });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const { refresh_token } = getTokens();
      const { data } = await axios.post<{ access_token: string }>(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        {},
        { headers: { Authorization: `Bearer ${refresh_token}` } }
      );
      setAccessToken(data.access_token);
      processQueue(null, data.access_token);
      original.headers.Authorization = `Bearer ${data.access_token}`;
      return client(original);
    } catch (err) {
      processQueue(err, null);
      clearTokens();
      window.location.href = "/login";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default client;
