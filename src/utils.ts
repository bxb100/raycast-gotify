import { getPreferenceValues } from "@raycast/api";

export function buildEndpoint(path: string, websocket: boolean = false) {
  const { endpoint } = getPreferenceValues<Preferences.Messages>();
  const url = new URL(endpoint);
  if (websocket) {
    url.protocol = url.protocol === "http:" ? "ws:" : "wss:";
  }
  url.pathname = path;
  return url;
}

export function authHeaders(token: string) {
  return {
    headers: {
      "X-Gotify-Key": token,
    },
  };
}
