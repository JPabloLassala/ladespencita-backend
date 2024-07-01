module.exports = {
  moduleFileExtensions: ["js", "json", "ts"],
  roots: ["src", "test"],
  testRegex: "/test/.*\\.test\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  modulePaths: ["<rootDir>", "/home/some/other/path"],
  moduleDirectories: ["node_modules"],
  collectCoverageFrom: ["**/*.(t|j)s"],
  coverageDirectory: "./coverage",
  testEnvironment: "node",
};
