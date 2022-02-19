import tweets from "../../apis/tweets";
import {
  GET_UNFILTERED_TWEETS_FOR_ADMIN,
  SET_UNFILTERED_TWEETS_FOR_ADMIN,
  VERIFY_DELETE_TWEET,
  DELETE_TWEET,
  CANCEL_DELETE,
  ADD_NOTIFICATION,
  ADD_NOTIFICATION_CONFIRM,
  REMOVE_NOTIFICATION,
  SET_TWEET_ID_TO_DELETE,
  SET_ALL_TWEETS,
} from "../store-types";

const state = {
  unFilteredTweetsForAdmin: [],
  tweetIdToDelete: "",
};
const getters = {
  [GET_UNFILTERED_TWEETS_FOR_ADMIN]: (state) => state.unFilteredTweetsForAdmin,
};
const actions = {
  [SET_UNFILTERED_TWEETS_FOR_ADMIN]: async ({ commit, dispatch }) => {
    try {
      const { data, statusText } = await tweets.unFilteredForAdmin();
      if (statusText !== "OK") {
        throw new Error(statusText);
      }
      commit(SET_UNFILTERED_TWEETS_FOR_ADMIN, data);
    } catch (err) {
      dispatch(ADD_NOTIFICATION, {
        type: "error",
        message: "載入資料失敗，請稍後再試",
      });
    }
  },
  [VERIFY_DELETE_TWEET]: async ({ dispatch, commit }, tweetId) => {
    dispatch(ADD_NOTIFICATION_CONFIRM, {
      type: "confirm",
      message: "確定要刪除推文嗎?",
    });
    commit(SET_TWEET_ID_TO_DELETE, tweetId);
  },
  [DELETE_TWEET]: async ({ dispatch, state, commit }) => {
    // todo after create new twee to test delete tweet in case of safety
    const tweetIdToDelete = state.tweetIdToDelete;
    try {
      const { statusText } = await tweets.delete(tweetIdToDelete);
      if (statusText !== "OK") {
        throw new Error(statusText);
      }
      dispatch(SET_UNFILTERED_TWEETS_FOR_ADMIN);
      dispatch(SET_ALL_TWEETS);
      commit(SET_TWEET_ID_TO_DELETE, "");
    } catch (err) {
      dispatch(ADD_NOTIFICATION, {
        type: "error",
        message: "刪除資料失敗，請稍後再試",
      });
    }
  },
  [CANCEL_DELETE]: async ({ commit }) => {
    commit(REMOVE_NOTIFICATION);
    commit(CANCEL_DELETE);
  },
};
const mutations = {
  [CANCEL_DELETE]: (state) => (state.tweetIdToDelete = ""),
  [SET_TWEET_ID_TO_DELETE]: (state, tweetId) =>
    (state.tweetIdToDelete = tweetId),
  [SET_UNFILTERED_TWEETS_FOR_ADMIN]: async (
    state,
    unFilteredTweetsForAdmin
  ) => {
    state.unFilteredTweetsForAdmin = [...unFilteredTweetsForAdmin];
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};
