// ./vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/Playground-Chatroom/" : "/",
  devServer: {
    proxy: {
      "/socket.io": {
        target: "http://77fc-2001-b011-e-59a3-9de1-69a7-7562-a92f.ngrok.io",
        ws: true,
        changeOrigin: true,
      },
    },
  },
};