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
    newUserReady: {},
  },
  mutations: {},
  actions: {},
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