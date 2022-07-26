/* eslint-disable prettier/prettier */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import currentUserAPi from "./apis/currentUserAPI";

import VueChatScroll from "vue-chat-scroll";

import VueSocketIO from "vue-socket.io";
import { io } from "socket.io-client";

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

const socket = io(
  process.env.VUE_APP_SOCKET_URL,
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

Vue.use(VueChatScroll);

export const vm = new Vue({
  router,
  store,
  sockets: {
    async connect() {
      const res = await currentUserAPi.getCurrentUser();
      const { data } = res;
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
