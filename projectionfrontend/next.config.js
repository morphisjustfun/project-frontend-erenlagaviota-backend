const path = require("path");
const withSass = require("@zeit/next-sass");
module.exports = withSass({
  /* bydefault config  option Read For More Optios
here https://github.com/vercel/next-plugins/tree/master/packages/next-sass*/
  cssModules: true,
});
module.exports = {
  /* Add Your Scss File Folder Path Here */
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
