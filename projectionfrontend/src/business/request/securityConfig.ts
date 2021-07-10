import { ACCESS_TOKEN } from "../constants";

interface RequestOptions {
  url: string;
  method: string;
}

const request = (options: RequestOptions) => {
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

  return fetch(options.url, options);
};

export default request;
