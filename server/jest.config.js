const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { useESM: true }],
  },
  testMatch: [
    "**/tests/**/*.test.{ts,js}",
    "**/*.test.{ts,js}",
  ],
  collectCoverageFrom: [
    "**/src/**/*.ts",
    "!**/node_modules/**",
    "!**/dist/**",
    "!**/tests/**",
  ],
  coverageDirectory: "coverage",
  transform: {
    ...tsJestTransformCfg,
  },
};