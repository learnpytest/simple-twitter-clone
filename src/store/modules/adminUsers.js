import usersAPI from "../../apis/usersAPI";
import {
  GET_ALL_USERS,
  SET_ALL_USERS,
  ADD_NOTIFICATION
} from "../store-types";

const state = {
  adminUsers: [],
};
const getters = {
  [GET_ALL_USERS]: (state) => state.adminUsers,
};
const actions = {
  [SET_ALL_USERS]: async ({
    commit,
    dispatch
  }) => {
    try {
      const {
        data,
        statusText
      } = await usersAPI.all();
      if (statusText !== "OK") {
        throw new Error(statusText);
      }
      commit(SET_ALL_USERS, data);
    } catch (err) {
      dispatch(ADD_NOTIFICATION, {
        type: "error",
        message: "載入資料失敗，請稍後再試",
      });
    }
  },
};
const mutations = {
  [SET_ALL_USERS]: async (state, adminUsers) => {
    state.adminUsers = {
      ...adminUsers,
    };
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};