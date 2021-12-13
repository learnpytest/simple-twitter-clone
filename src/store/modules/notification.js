import {
  ADD_NOTIFICATION,
  ADD_NOTIFICATION_CONFIRM,
  REMOVE_NOTIFICATION,
  GET_NOTIFICATION,
  IS_NOTIFICATION_OPEN,
  IS_NOTIFICATION_CONFIRM,
} from "../store-types";

const state = {
  notification: {},
  isOpen: false,
  isNotificationConfirm: false,
};
const getters = {
  [GET_NOTIFICATION]: (state) => state.notification,
  [IS_NOTIFICATION_OPEN]: (state) => state.isOpen,
  [IS_NOTIFICATION_CONFIRM]: (state) => state.isNotificationConfirm,
};
const actions = {
  [ADD_NOTIFICATION_CONFIRM]: ({ commit, state }, notification) => {
    state.isNotificationConfirm = true;
    commit("ADD_NOTIFICATION", notification);
  },
  [ADD_NOTIFICATION]: ({ commit }, notification) => {
    commit("ADD_NOTIFICATION", notification);
    setTimeout(() => {
      commit("REMOVE_NOTIFICATION");
    }, 3000);
  },
  [REMOVE_NOTIFICATION]: ({ commit }) => {
    commit("REMOVE_NOTIFICATION");
  },
};
const mutations = {
  [ADD_NOTIFICATION]: (state, notification) => {
    state.isOpen = true;
    state.notification = {
      ...notification,
    };
  },
  [REMOVE_NOTIFICATION]: (state) => {
    state.isOpen = false;
    state.isNotificationConfirm = false;
    state.notification = {};
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
