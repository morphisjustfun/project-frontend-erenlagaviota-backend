module.exports = {
  presets: [
    "next/babel",
    "@babel/preset-react",
    "@babel/preset-typescript",
    "@babel/preset-env",
  ],
  plugins: [
    [
      "styled-components",
      {
        ssr: true,
        displayName: true,
        preprocess: false,
      },
    ],
    [
      "@babel/plugin-transform-runtime",
      {
        regenerator: true,
      },
    ],
  ],
};
