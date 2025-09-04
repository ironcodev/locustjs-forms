const { babel } = require("@rollup/plugin-babel");
const { nodeResolve } = require("@rollup/plugin-node-resolve");

module.exports = [
  {
    input: "src/index.js",
    plugins: [
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-env"],
      }),
    ],
    output: {
      file: "./dist/index.js",
      format: "cjs",
    },
    external: [
      "@locustjs/base",
      "@locustjs/extensions-array",
      "@locustjs/extensions-object",
    ],
  },
  {
    input: "src/index.js",
    plugins: [
      babel({
        babelHelpers: "bundled",
        presets: ["@babel/preset-env"],
      }),
    ],
    output: {
      name: "@locustjs/forms",
      file: "./dist/index.umd.js",
      format: "umd",
    },
    plugins: [nodeResolve()],
  },
];
