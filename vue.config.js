// ./vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ?
    "/Front_End_Vue_Simple_Twitter/" :
    "/",
  devServer: {
    proxy: {
      "/socket.io": {
        target: "http://localhost:3000",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};