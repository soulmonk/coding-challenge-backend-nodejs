const tsConfig = require("../tsconfig.json");
const tsConfigPaths = require("tsconfig-paths");

const path = require('path');

const baseUrl = path.resolve(__dirname, "../dist"); // Either absolute or relative path. If relative it's resolved to current working directory.
const cleanup = tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths
});

// When path registration is no longer needed
// cleanup();
// process on exit clean up
