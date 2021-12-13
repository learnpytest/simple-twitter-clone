// ./vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/Playground-Chatroom/" : "/",
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