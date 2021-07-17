const path = require("path");
const withSass = require("@zeit/next-sass");

module.exports = {
  /* Add Your Scss File Folder Path Here */
    webpack5: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  images: {
    loader: "imgix",
    path: "",
    domains: ["lh3.googleusercontent.com"],
  },
  basePath: "/app-sec02-group03",
};
