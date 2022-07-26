// import currentUserAPI from "../../apis/currentUserAPI";
// import {
//   vm
// } from "../../main";

import followshipAPI from "../../apis/followshipAPI";
// import {
//   vm
// } from "../../main";

// import currentUserAPI from "../../apis/currentUserAPI";

import {
  GET_CURRENT_USER_FOLLOWERS,
  SET_CURRENT_USER_FOLLOWERS,
  GET_CURRENT_USER_FOLLOWINGS,
  SET_CURRENT_USER_FOLLOWINGS,
  //

  // GET_FOLLOWERS,
  // SET_FOLLOWERS,
  // GET_FOLLOWEING,
  // SET_FOLLOWEING,
  //
  SET_TOP_USERS,
  POST_FOLLOWSHIP,
  DELETE_FOLLOWSHIP,
  ADD_NOTIFICATION,
} from "../store-types";

const state = {
  currentUserFollowers: [],
  currentUserFollowings: [],

  // followers: [],
  //   followings: [],
};
const getters = {
  [GET_CURRENT_USER_FOLLOWERS]: (state) => state.currentUserFollowers,
  [GET_CURRENT_USER_FOLLOWINGS]: (state) => state.currentUserFollowings,
};
const actions = {
  [SET_CURRENT_USER_FOLLOWERS]: async ({ commit }, userId) => {
    try {
      const res = await followshipAPI.getFollowers(userId);
      const { statusText, data } = res;
      if (statusText !== "OK") {
        throw new Error(statusText);
      }
      commit(SET_CURRENT_USER_FOLLOWERS, data);
    } catch (err) {
      console.log(err);
    }
  },
  [SET_CURRENT_USER_FOLLOWINGS]: async ({ commit }, userId) => {
    // send api
    try {
      const res = await followshipAPI.getFollowings(userId);
      const { statusText, data } = res;
      if (statusText !== "OK") {
        throw new Error(statusText);
      }
      commit(SET_CURRENT_USER_FOLLOWINGS, data);
    } catch (err) {
      console.log(err);
    }
  },
  [POST_FOLLOWSHIP]: async ({ dispatch }, { followingId, userId }) => {
    try {
      const res = await followshipAPI.postFollowships(followingId);
      const { data, statusText } = res;
      if (data.status !== "success" || statusText !== "OK") {
        throw new Error(data.message);
      }
      dispatch(SET_CURRENT_USER_FOLLOWINGS, userId);
      dispatch(SET_CURRENT_USER_FOLLOWERS, userId);
      dispatch(SET_TOP_USERS);

      setTimeout(() => {
        dispatch(ADD_NOTIFICATION, {
          type: "success",
          message: "跟隨成功",
        });
      }, 1000);
    } catch (err) {
      dispatch(ADD_NOTIFICATION, {
        type: "error",
        message: "更新跟隨資料失敗，請稍後再試",
      });
    }
  },
  [DELETE_FOLLOWSHIP]: async ({ dispatch }, { followingId, userId }) => {
    const res = await followshipAPI.deleteFollowship(followingId);
    const { data, statusText } = res;
    if (data.status !== "success" || statusText !== "OK") {
      throw new Error(data.message);
    }

    dispatch(SET_CURRENT_USER_FOLLOWINGS, userId);
    dispatch(SET_CURRENT_USER_FOLLOWERS, userId);
    dispatch(SET_TOP_USERS);

    setTimeout(() => {
      dispatch(ADD_NOTIFICATION, {
        type: "success",
        message: "成功取消跟隨",
      });
    }, 1000);
  },
};
const mutations = {
  [SET_CURRENT_USER_FOLLOWERS]: async (state, currentUserFollowers) => {
    state.currentUserFollowers = [...currentUserFollowers];
  },
  [SET_CURRENT_USER_FOLLOWINGS]: async (state, currentUserFollowings) => {
    state.currentUserFollowings = [...currentUserFollowings];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
