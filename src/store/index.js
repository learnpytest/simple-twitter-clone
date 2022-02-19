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

import community from "./modules/community";

import { CLEAR_ONE_ROOM_MESSAGES } from "./store-types";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    allMessages: [],
    allUsers: [],
    oneRoomMessages: {
      roomId: "",
      messages: [],
    },
    onlyLatestMessageOfEachRoom: [],
    rooms: {
      isUpdating: false,
    },
  },
  getters: {
    getRooms: (state) => state.rooms,
    getOneRoomMessages: (state) => state.oneRoomMessages,
    getOnlyLatestMessageOfEachRoom: (state) =>
      state.onlyLatestMessageOfEachRoom,
  },
  actions: {
    [CLEAR_ONE_ROOM_MESSAGES]: ({ commit }) => {
      commit(CLEAR_ONE_ROOM_MESSAGES);
    },
    setOneNewMsgToLatestMessageOfEachRoom: ({ commit }, oneNewMsg) => {
      commit("setOneNewMsgToLatestMessageOfEachRoom", oneNewMsg);
    },
    setOnlyLatestMessageOfEachRoom: (
      { commit },
      onlyLatestMessageOfEachRoomArr
    ) => {
      commit("setOnlyLatestMessageOfEachRoom", onlyLatestMessageOfEachRoomArr);
    },
    setOneRoomMessages: ({ commit }, { roomId, messages }) => {
      commit("setOneRoomMessages", {
        roomId,
        messages,
      });
    },

    appendRoomMessage: ({ commit }, { roomId, oneNewMessage }) => {
      commit("appendRoomMessage", {
        roomId,
        oneNewMessage,
      });
    },
  },
  mutations: {
    [CLEAR_ONE_ROOM_MESSAGES]: (state) => {
      state.oneRoomMessages = {
        roomId: "",
        messages: [],
      };
    },
    setOneNewMsgToLatestMessageOfEachRoom: (state, oneNewMsg) => {
      try {
        const latestMsgState = state.onlyLatestMessageOfEachRoom.filter(
          (msg) => msg
        );
        if (
          !latestMsgState.length ||
          !latestMsgState.some((msg) => msg.roomId === oneNewMsg.roomId)
        )
          return state.onlyLatestMessageOfEachRoom.push(oneNewMsg);

        const newArr = latestMsgState.map((msg) => {
          return msg.roomId.toString() === oneNewMsg.roomId.toString()
            ? oneNewMsg
            : msg;
        });
        state.onlyLatestMessageOfEachRoom = [...newArr].filter((msg) => msg);
      } catch (err) {
        console.log(err);
      }
    },
    setOnlyLatestMessageOfEachRoom: (state, onlyLatestMessageOfEachRoomArr) => {
      state.onlyLatestMessageOfEachRoom = [...onlyLatestMessageOfEachRoomArr];
    },
    setOneRoomMessages: (state, { roomId, messages }) => {
      state.oneRoomMessages = {
        roomId,
        messages: [...messages],
      };
    },

    appendRoomMessage: (state, { roomId, oneNewMessage }) => {
      state.oneRoomMessages.roomId = roomId;
      state.oneRoomMessages.messages.push(oneNewMessage);
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
    community,
  },
});
