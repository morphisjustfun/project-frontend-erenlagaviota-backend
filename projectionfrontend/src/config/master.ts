import exportConfigDev from "./dev";
import exportConfigProd from "./prod";

let config: typeof exportConfigDev = { redirectUri: "", apiBaseUrl: "" };

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
  config = exportConfigDev;
} else {
  config = exportConfigProd;
}

export default config;
