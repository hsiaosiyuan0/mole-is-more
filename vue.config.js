const path = require("path");

module.exports = {
  outputDir: path.resolve(__dirname, "docs"),
  publicPath: process.env.NODE_ENV == "production" ? "/mole-is-more" : "/",
  chainWebpack: (config) => {
    config.resolve.symlinks(false);

    config.module
      .rule("wasm")
      .test(/\.(wasm)(\?.*)?$/)
      .type("javascript/auto")
      .use("wasm-loader")
      .loader("wasm-loader");

    config.devtool("inline-source-map");

    config.plugin("html").tap((args) => {
      args[0].template = path.resolve(__dirname, "index.html");
      return args;
    });

    config.externals([
      {
        "monaco-editor": "monaco",
      },
    ]);
  },
};
