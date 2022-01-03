import Vue from "vue";
import Vuex from "vuex";

import login from "./modules/login";
import user from "./modules/user";
import tweet from "./modules/tweet";
import adminUsers from "./modules/adminUsers";
import adminTweets from "./modules/adminTweets";

import userAccount from "./modules/userAccount";
import userProfile from "./modules/userProfile";

import notification from "./modules/notification";
import processing from "./modules/processing";

import followship from "./modules/followship";
import likeship from "./modules/likeship";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    allMessages: [],
    allUsers: [],
    rooms: {
      isUpdating: false,
    },
  },
  getters: {
    getRooms: (state) => state.rooms,
    getRoomState: (state) => (room) => state.rooms[room],
  },
  mutations: {
    setRoomsState: (state, rooms) => {
      state.rooms = rooms;
    },
    appendRoomMessage: (state, {
      room,
      message
    }) => {
      state.rooms[room].messages.push(message);
    },
  },
  actions: {
    setRoomsState: ({
      commit
    }, rooms) => {
      commit("setRoomsState", rooms);
    },
    getRoomState: ({
      getters
    }, room) => {
      getters.getRoomState(room);
    },
    appendRoomMessage: ({
      commit
    }, {
      room,
      message
    }) => {
      commit("appendRoomMessage", {
        room,
        message,
      });
    },
  },
  modules: {
    login,
    user,
    tweet,
    adminUsers,
    userAccount,
    userProfile,
    notification,
    processing,
    followship,
    likeship,
    adminTweets,
  },
});