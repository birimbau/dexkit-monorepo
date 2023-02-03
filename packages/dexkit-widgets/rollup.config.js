// rollup.config.js
const typescript = require("@rollup/plugin-typescript");
const commonjs = require("@rollup/plugin-commonjs");
const nodeResolve = require("@rollup/plugin-node-resolve");
const terser = require("@rollup/plugin-terser");
const replace = require("@rollup/plugin-replace");
const path = require("path");

const pa = path.join(process.cwd(), "..");

exports.default = {
  input: "src/widgets/swap/index.tsx",
  output: {
    file: "dist/index.js",
    format: "cjs",
  },
  plugins: [
    typescript({}),
    nodeResolve({
      preferBuiltins: false,
      rootDir: path.join(process.cwd(), ".."),
    }),
    commonjs(),
    terser(),
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify("production"),
      __buildDate__: () => JSON.stringify(new Date()),
      __buildVersion: 15,
    }),
  ],
};
