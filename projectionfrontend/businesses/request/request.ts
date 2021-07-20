import { ACCESS_TOKEN } from "../constants";

const request = (
  options: RequestInit & { url: string },
  abortController?: AbortController
) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(
      "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = { ...defaults, ...options };
  if (abortController !== undefined) {
    options = { ...options, signal: abortController.signal };
  }

  return fetch(options.url, options);
};

export default request;
