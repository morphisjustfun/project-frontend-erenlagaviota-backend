const config = {
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "./businesses/**",
    "./components/**",
    "./config/**",
    "./pages/**",
    "./store/**",
    "./styles/**",
    // "!**/node_modules/**",
    // "!**/out/**",
    // "!**/coverage/**",
    // "!**/__tests__/**",
  ],
};

module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  testPathIgnorePatterns: [
    "<rootDir>/out",
    "<rootDir>/.next/",
    "<rootDir>/node_modules/",
  ],
  transform: {
    "^.+\\.(js|jsx|ts|tsx)?$": ["babel-jest", { rootMode: "upward" }],
  },
  ...config,
};
