import usersAPI from "../../apis/usersAPI";

import { vm } from "../../main";

import {
  GET_CURRENT_USER,
  SET_CURRENT_USER,
  REVOKE_AUTHENTICATION,
  ADD_NOTIFICATION,
  GET_TOP_USERS,
  SET_TOP_USERS,
} from "../store-types";

const state = {
  currentUser: {},

  token: "",
  isAuthenticated: false,
  topUsers: [],
};
const getters = {
  [GET_CURRENT_USER]: (state) => state.currentUser,
  [GET_TOP_USERS]: (state) => state.topUsers,
};
const actions = {
  [REVOKE_AUTHENTICATION]: async ({ commit, dispatch }) => {
    commit(REVOKE_AUTHENTICATION);
    dispatch(ADD_NOTIFICATION, {
      type: "success",
      message: "成功登出",
    });
  },
  [SET_CURRENT_USER]: async ({ commit }, currentUser) => {
    commit(SET_CURRENT_USER, currentUser);
  },
  [SET_TOP_USERS]: async ({ commit }) => {
    // send api
    try {
      const res = await usersAPI.getTop();
      const { data, statusText } = res;
      if (statusText !== "OK") {
        throw new Error(statusText);
      }
      commit(SET_TOP_USERS, data);
    } catch (err) {
      throw new Error(err);
    }
  },
};
const mutations = {
  [REVOKE_AUTHENTICATION]: async (state) => {
    state.currentUser = {};
    state.isAuthenticated = false;
    localStorage.removeItem("token");
    //測試是否還能取得資料，在此階段，期待結果將是，能進入其他頁面但不能取得資料，此步驟保護api。下一步驟為若使用者沒有登入，直接再網址輸入api，將使用者導回登入頁而不是顯示其他頁面。如果使用者已經login，若使用者還想進入登入頁，將使用者直接導向抵達頁。
    vm.$router.push("/admin/login");
  },
  [SET_CURRENT_USER]: async (state, currentUser) => {
    state.currentUser = {
      ...currentUser,
    };
    state.token = localStorage.getItem("token");
    state.isAuthenticated = true;
  },
  [SET_TOP_USERS]: async (state, topUsers) => {
    state.topUsers = [...topUsers];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
