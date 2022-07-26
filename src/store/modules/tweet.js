/* eslint-disable prettier/prettier */
import tweets from "../../apis/tweets";

import { vm } from "../../main";

import {
  SET_IS_PROCESSING,
  ADD_NOTIFICATION,
  GET_ALL_TWEETS,
  SET_ALL_TWEETS,
  GET_FILLTERED_TWEETS,
  GET_ONE_USER_TWEETS,
  SET_ONE_USER_TWEETS,
  GET_ONE_USER_REPLIES,
  SET_ONE_USER_REPLIES,
  GET_ONE_USER_LIKES,
  SET_ONE_USER_LIKES,
} from "../store-types";

const state = {
  allTweets: [],
  oneUserTweets: [],
  oneUserReplies: [],
  oneUserLikes: [],
  filteredTweets: [],
};
const getters = {
  [GET_FILLTERED_TWEETS]: (state) => state.filteredTweets,
  [GET_ALL_TWEETS]: (state) => state.allTweets,
  [GET_ONE_USER_TWEETS]: (state) => state.oneUserTweets,
  [GET_ONE_USER_REPLIES]: (state) => state.oneUserReplies,
  [GET_ONE_USER_LIKES]: (state) => state.oenUserLikes,
};
const actions = {
  [SET_ALL_TWEETS]: async ({ commit, dispatch }) => {
    try {
      dispatch(SET_IS_PROCESSING, true);
      const res = await tweets.all();
      // send api to get reponse of unFiltered tweets and pass tweets to mutation to change state unFiltered the tweets
      // start
      const { data, statusText } = res;
      if (statusText !== "OK") throw new Error("statusText");
      commit(SET_ALL_TWEETS, data);
      dispatch(SET_IS_PROCESSING, false);
    } catch (err) {
      setTimeout(() => {
        setTimeout(() => {
          dispatch(ADD_NOTIFICATION, {
            type: "error",
            message: "載入資料失敗，請重新登入",
          });
          vm.$router.push("/login");
          dispatch(SET_IS_PROCESSING, false);
        }, 3000);
      }, 5000);
    }
  },
  [SET_ONE_USER_TWEETS]: async ({ commit }, userId) => {
    // send api

    try {
      // const userId = rootState.user.currentUser.id;
      const res = await tweets.getOneUserTweet(userId);
      const { data, statusText } = res;
      if (statusText !== "OK") throw new Error("statusText");
      commit(SET_ONE_USER_TWEETS, data);
    } catch (err) {
      throw new Error(err);
    }
  },
  [SET_ONE_USER_REPLIES]: async ({ commit }, userId) => {
    // send api

    try {
      // const userId = rootState.user.currentUser.id;
      const res = await tweets.getOneUserReplies(userId);
      const { data, statusText } = res;

      if (statusText !== "OK") throw new Error("statusText");
      commit(SET_ONE_USER_REPLIES, data);
    } catch (err) {
      throw new Error(err);
    }
  },
  [SET_ONE_USER_LIKES]: async ({ commit }, userId) => {
    try {
      const res = await tweets.getOneUserLikes(userId);
      const { data, statusText } = res;
      if (statusText !== "OK") throw new Error("statusText");
      commit(SET_ONE_USER_LIKES, data);
    } catch (err) {
      throw new Error(err);
    }
  },
};
const mutations = {
  [SET_ALL_TWEETS]: (state, allTweets) => {
    // state.allTweets = [...state.allTweets, ...allTweets];
    state.filteredTweets = [...allTweets];
  },
  [SET_ONE_USER_TWEETS]: (state, oneUserTweets) => {
    // state.oneUserTweets = [...oneUserTweets];
    state.filteredTweets = [...oneUserTweets];
  },
  [SET_ONE_USER_REPLIES]: (state, oneUserReplies) => {
    // state.oneUserReplies = [...oneUserReplies];
    state.filteredTweets = [...oneUserReplies];
  },
  [SET_ONE_USER_LIKES]: (state, oneUserLikes) => {
    // state.oneUserLikes = [...oneUserLikes];
    state.filteredTweets = [...oneUserLikes];
  },
  [SET_ONE_USER_REPLIES]: (state, oneUserReplies) => {
    // state.oneUserReplies = [...oneUserReplies];
    state.filteredTweets = [...oneUserReplies];
  },
  [SET_ONE_USER_LIKES]: (state, oneUserLikes) => {
    // state.oneUserLikes = [...oneUserLikes];
    state.filteredTweets = [...oneUserLikes];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
