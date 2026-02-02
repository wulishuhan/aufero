const { defineConfig } = require("@vue/cli-service");
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  // chainWebpack: (config) => {
  //   config.plugin("html").tap((args) => {
  //     args[0].title = "Ortur Library";
  //     return args;
  //   });
  // },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: "AlgoLaser Library",
    resolve: {
      alias: {
        "@": resolve("src"),
      },
    },
  },
  chainWebpack: (config) => {
    config.externals({
      vue: "Vue",
      "element-ui": "ELEMENT",
    });
    // 移除 prefetch 插件
    config.plugins.delete("prefetch");
    config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]",
      })
      .end();
  },
  devServer: {
    // setupMiddlewares: (middlewares, devServer) => {
    //   if (!devServer) {
    //     throw new Error("webpack-dev-server is not defined");
    //   }
    //   // Mock(devServer.app);
    //   mockServer(devServer.app);
    //   return middlewares;
    // },
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: "http://172.16.116.234:8080",
        changeOrigin: true,
        pathRewrite: {
          ["^" + process.env.VUE_APP_BASE_API]: "",
        },
      },
      // [process.env.VUE_APP_BASE_API_ALGO_AUTH]: {
      //   target: "https://gateway.inner.dev.cloud.algolaser.com", // 代理的目标地址
      //   changeOrigin: true,
      //   pathRewrite: {
      //     ["^" + process.env.VUE_APP_BASE_API_ALGO_AUTH]: "", // 可选，重写路径，将 /api 去掉
      //   },
      // },
      // "/algo": {
      //   target: "https://auth.dev.algolaser.cn", // 代理的目标地址
      //   changeOrigin: true,
      //   pathRewrite: {
      //     "^/algo": "", // 可选，重写路径，将 /api 去掉
      //   },
      // },
    },
  },
});
