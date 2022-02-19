import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import './assets/scss/reset.scss'
import store from "./store";

import currentUserAPi from "./apis/currentUserAPI";

import VueChatScroll from "vue-chat-scroll";

import VueSocketIO from "vue-socket.io";
import {
  io
} from "socket.io-client";

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

// const socket = io("http://localhost:5000", socketOptions);

const socket = io(
  "https://591f-2001-b011-e-3167-5946-d13b-81dd-f47.ngrok.io",
  socketOptions
);

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

// Vue.directive("focus", {
//   inserted: function (el) {
//     el.focus();
//     console.log(el);
//   },
// });

Vue.use(VueChatScroll);

export const vm = new Vue({
  router,
  store,
  sockets: {
    async connect() {
      console.log("main.js connected in main.js");
      const res = await currentUserAPi.getCurrentUser();
      const {
        data
      } = res;
      socket.emit("socketConnected", data);
    },

    allMessages: (messagesArr) => {
      store.state.allMessages = [...messagesArr];
    },

    allUsers: (data) => {
      store.state.allUsers = [...data];
    },

    userArrived: (newMessage) => {
      socket.emit("userArrived", newMessage);
    },
    socketMessage: (noti) => {
      store.dispatch("ADD_NOTIFICATION", {
        ...noti,
      });
    },
    socketErrorMessage: (noti) => {
      store.dispatch("ADD_NOTIFICATION", {
        ...noti,
      });
    },
  },
  render: (h) => h(App),
}).$mount("#app");

export default socket;