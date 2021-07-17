import exportConfigDev from "./dev";

let config: typeof exportConfigDev = { redirectUri: "", apiBaseUrl: "" };

config.redirectUri = "https://cs.mrg.com.pe/app-sec02-group03/oauth2/redirect";
config.apiBaseUrl = "https://api.cs.mrg.com.pe/api-sec02-group03";

// config.redirectUri = "http://localhost:3000/oauth2/redirect";
// config.apiBaseUrl = "http://localhost:8080";

export default config;
