// need to use this for real sign in
import authorizationAPI from "../../apis/authorizationAPI";

import { vm } from "../../main";

import {
  SET_IS_PROCESSING,
  GET_LOGIN_INFO,
  SET_LOGIN_INFO,
  POST_LOGIN,
  POST_USER_LOGIN,
  SET_CURRENT_USER,
  RESET_CURRENT_USER_PROFILE,
  ADD_NOTIFICATION,
} from "../store-types";

const state = {
  loginInfo: {
    account: "",
    password: "",
  },
};
const getters = {
  [GET_LOGIN_INFO]: (state) => state.loginInfo,
};
const actions = {
  [SET_LOGIN_INFO]: async ({ commit }, { account, password }) => {
    commit(SET_LOGIN_INFO, {
      account,
      password,
    });
  },
  [POST_USER_LOGIN]: async ({ state, commit, dispatch }) => {
    // if success set current user, save token to localstorage

    const account = state.loginInfo.account;
    const password = state.loginInfo.password;
    if (!account.length || !password.length) {
      dispatch(ADD_NOTIFICATION, {
        type: "error",
        message: "帳號不存在！",
      });
      return;
    }
    try {
      dispatch(SET_IS_PROCESSING, true);
      const res = await authorizationAPI.usersSignIn({
        account,
        password,
      });
      const { data, statusText } = res;
      if (statusText !== "OK" || data.status !== "success") {
        throw new Error(statusText);
      }
      //  假設成功登入，應該得到使用者資料，先存好token, 將使用者資料放入另一個action，再用mutation修改現在使用者，更新現在使用者，然後轉址
      localStorage.setItem("token", data.token);
      commit(SET_CURRENT_USER, data.user);
      vm.$router.push("/usermain");
      dispatch(SET_IS_PROCESSING, false);
      dispatch(ADD_NOTIFICATION, {
        type: "success",
        message: "成功登入",
      });
    } catch (err) {
      dispatch(SET_IS_PROCESSING, false);
      dispatch(ADD_NOTIFICATION, {
        type: "error",
        message: "帳號不存在!",
      });
    }
  },

  [POST_LOGIN]: async ({ state, commit, dispatch }) => {
    // write first start
    const account = state.loginInfo.account;
    const password = state.loginInfo.password;
    // if (!account.length || !password.length) {
    //   dispatch(ADD_NOTIFICATION, {
    //     type: "error",
    //     message: "帳號不存在！",
    //   });
    //   return;
    // }
    try {
      const res = await authorizationAPI.signIn({
        account,
        password,
      });
      const { data } = res;
      localStorage.setItem("token", data.token);
      commit(SET_CURRENT_USER, data.user);
      commit(RESET_CURRENT_USER_PROFILE, data.user);
      vm.$router.push("/admin/tweets");
      dispatch(ADD_NOTIFICATION, {
        type: "success",
        message: "成功登入",
      });
    } catch (err) {
      dispatch(SET_IS_PROCESSING, false);
      dispatch(ADD_NOTIFICATION, {
        type: "error",
        message: "帳號不存在!",
      });
    }
  },

  //  假設成功登入，應該得到使用者資料，先存好token, 將使用者資料放入另一個action，再用mutation修改現在使用者，更新現在使用者，然後轉址
};
const mutations = {
  [SET_LOGIN_INFO]: (state, { account, password }) => {
    state.loginInfo = {
      ...state.loginInfo,
      ...{
        account,
        password,
      },
    };
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
