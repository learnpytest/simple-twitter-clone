// need to use this for real sign in
import usersAPI from "../../apis/usersAPI";
import currentUserAPI from "../../apis/currentUserAPI";

// import {
//   vm
// } from "../../main";

import {
  SET_IS_PROCESSING,
  PUT_CURRENT_USER_PROFILE,
  RESET_CURRENT_USER_PROFILE,
  FETCH_CURRENT_USER,
  REVOKE_AUTHENTICATION,
  ADD_NOTIFICATION,
  SET_CURRENT_USER,
} from "../store-types";

const state = {
  currentUserProfile: {},
};
const getters = {
  [FETCH_CURRENT_USER]: (state) => state.currentUserProfile,
};
const actions = {
  [RESET_CURRENT_USER_PROFILE]: async ({
    commit,
    dispatch
  }) => {
    // 將使用RESET_CURRENT_USER_PROFILE來驗證每一次轉址使用者是否仍有權限。需要設定router的beforeEach來監聽每一個轉址token有無變化
    try {
      const {
        data,
        statusText
      } = await currentUserAPI.getCurrentUser();
      if (statusText !== "OK") throw new Error("無法取得現在使用者");

      commit(RESET_CURRENT_USER_PROFILE, data);
      commit(SET_CURRENT_USER, data);

      return true;
    } catch (err) {
      dispatch(ADD_NOTIFICATION, {
        type: "error",
        message: "無法取得現在使用者，請稍後再試",
      });
      commit(REVOKE_AUTHENTICATION);
      return false;
    }
  },
  [PUT_CURRENT_USER_PROFILE]: async ({
    dispatch
  }, payload) => {
    try {
      dispatch(SET_IS_PROCESSING, true);
      const res = await usersAPI.putUserProfile(payload);

      const {
        data,
        statusText
      } = res;
      if (statusText !== "OK" || data.status !== "success") {
        throw new Error(data.message);
      }
      dispatch(RESET_CURRENT_USER_PROFILE);

      dispatch(SET_IS_PROCESSING, false);
    } catch (err) {
      dispatch(SET_IS_PROCESSING, false);
    }
  },
};

const mutations = {
  [RESET_CURRENT_USER_PROFILE]: async (state, currentUserProfile) => {
    state.currentUserProfile = {
      ...currentUserProfile,
    };
  },
};

export default {
  state,
  getters,
  mutations,
  actions,
};