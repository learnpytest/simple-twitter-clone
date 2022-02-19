import { SET_IS_PROCESSING, GET_IS_PROCESSING } from "../store-types";

const state = {
  isProcessing: false,
};
const getters = {
  [GET_IS_PROCESSING]: (state) => state.isProcessing,
};
const actions = {
  [SET_IS_PROCESSING]: async ({ commit }, isProcessing) => {
    commit(SET_IS_PROCESSING, isProcessing);
  },
};

const mutations = {
  [SET_IS_PROCESSING]: async (state, isProcessing) =>
    (state.isProcessing = isProcessing),
};

export default {
  state,
  getters,
  mutations,
  actions,
};
