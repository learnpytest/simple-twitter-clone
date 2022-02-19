// import currentUserAPI from "../../apis/currentUserAPI";

// import {
//   vm
// } from "../../main";

import { POST_LIKE, DELETE_LIKE, SET_TWEET } from "../store-types";

const state = {};
const getters = {};
const actions = {
  [POST_LIKE]: async ({ dispatch }, targetedTweetId) => {
    //重新拉取該推文資料帶動mutation改變state,畫面自動更新
    dispatch(SET_TWEET, targetedTweetId);
  },
  [DELETE_LIKE]: async ({ dispatch }, targetedTweetId) => {
    //重新拉取該推文資料帶動mutation改變state,畫面自動更新

    dispatch(SET_TWEET, targetedTweetId);
  },
};
const mutations = {};

export default {
  state,
  getters,
  actions,
  mutations,
};
