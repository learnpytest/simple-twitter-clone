import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import './assets/scss/reset.scss'
import store from "./store";

import VueChatScroll from "vue-chat-scroll";

import VueSocketIO from "vue-socket.io";
import {
  io
} from "socket.io-client";
// const socket = io("http://localhost:3000");

Vue.config.productionTip = false;
const socketOptions = {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  forceNew: true,
  allowUpgrades: false,
  pingTimeout: 30000,
  transports: ["websocket", "polling"],
};

// const socket = io("http://localhost:3000", socketOptions);

const socket = io(
  "https://53c1-2001-b011-e-3a69-b4fc-f6aa-204e-1228.ngrok.io",
  socketOptions
);

// const socket = io(
//   "https://twitter-llrs-chatroom.herokuapp.com/",
//   socketOptions
// );

socket.onAny((event, ...args) => {
  console.log("main.js收到的資訊", event, args);
});

// socket.emit("message", "Hello user");

Vue.use(
  new VueSocketIO({
    debug: true,
    connection: socket,
    vuex: {
      store,
      actionPrefix: "SOCKET_",
      mutationPrefix: "SOCKET_",
    },
  })
);

Vue.directive("focus", {
  inserted: function (el) {
    el.focus();
    console.log(el);
  },
});

Vue.use(VueChatScroll);

export const vm = new Vue({
  router,
  store,
  sockets: {
    connecting() {
      console.log("main.js connecting");
    },
    disconnect() {
      console.log("main.js Disconnect");
    },
    connect_failed() {
      console.log("main.js connect failed");
    },
    connect() {
      console.log("main.js connected in main.js");
    },

    allMessages: function (data) {
      store.state.allMessages = data;
    },

    allUsers: function (data) {
      store.state.allUsers = [...data];
    },
  },
  render: (h) => h(App),
}).$mount("#app");

export default socket;