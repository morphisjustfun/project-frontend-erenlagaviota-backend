const path = require("path");
const withSass = require("@zeit/next-sass");

module.exports = {
  /* Add Your Scss File Folder Path Here */
    assetPrefix: ".",
  typescript: {
    ignoreBuildErrors: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    loader: "imgix",
    path: "",
  },
  exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
  ) {
    return {
      "/": { page: "/" },
      "/projection": { page: "/projection" },
      "/oauth2/redirect": { page: "/oauth2/redirect" },
    };
  },
};
