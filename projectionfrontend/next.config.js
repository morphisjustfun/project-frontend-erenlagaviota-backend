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
};
