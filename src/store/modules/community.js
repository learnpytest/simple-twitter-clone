import helpers from "../../utils/helpers";

import {
  ADD_NOTIFICATION,
  GET_COMMUNITY_NOTIFICATION,
  SET_NEW_NOTIFICATION,
  SET_PRIVATE_CHAT_NOTIFICATION,
  GET_COMMUNITY_NOTIFICATION_UNREAD,
  SET_COMMUNITY_NOTIFICATION_UNREAD,
  CLEAR_COMMUNITY_NOTIFICATION_UNREAD,
  INCREMENT_COMMUNITY_NOTIFICATION_UNREAD_PUBLIC_MESSAGE,
  INCREMENT_UNREAD_COMMUNITY_NOTIFICATION,
  RESET_COMMUNITY_NOTIFICATION,
  GET_LATEST_PRIVATE_ROOM_MESSAGES,
  GET_SUM_OF_UNREAD_PRIVATE_MESSAGES,
  SET_SUM_OF_UNREAD_PRIVATE_MESSAGES,
  ADD_UNREAD_NOTIFICATION_FOR_ROOM,
  CLEAR_UNREAD_FOR_ROOM,
} from "../store-types";

const state = {
  communityNotification: [],
  communityNotificationUnread: {},
  latestPrivateRoomMessages: [],
  unreadNotificationForRoom: [],
  sumOfUnreadPrivateMessages: 0,
};

const getters = {
  [GET_SUM_OF_UNREAD_PRIVATE_MESSAGES]: (state) =>
    state.sumOfUnreadPrivateMessages,
  [GET_COMMUNITY_NOTIFICATION_UNREAD]: (state) =>
    state.communityNotificationUnread,
  [GET_COMMUNITY_NOTIFICATION]: (state) => state.communityNotification,
  [GET_LATEST_PRIVATE_ROOM_MESSAGES]: (state) =>
    state.latestPrivateRoomMessages,
};

const actions = {
  [INCREMENT_COMMUNITY_NOTIFICATION_UNREAD_PUBLIC_MESSAGE]: ({
    commit
  }) => {
    commit("INCREMENT_COMMUNITY_NOTIFICATION_UNREAD_PUBLIC_MESSAGE");
  },
  [INCREMENT_UNREAD_COMMUNITY_NOTIFICATION]: ({
    commit
  }) => {
    commit("INCREMENT_UNREAD_COMMUNITY_NOTIFICATION");
  },

  [SET_SUM_OF_UNREAD_PRIVATE_MESSAGES]: async ({
    commit
  }, sum) => {
    commit(SET_SUM_OF_UNREAD_PRIVATE_MESSAGES, sum);
  },
  [ADD_UNREAD_NOTIFICATION_FOR_ROOM]: async ({
    commit
  }, {
    roomId,
    addNumber
  }) => {
    commit(ADD_UNREAD_NOTIFICATION_FOR_ROOM, {
      roomId,
      addNumber,
    });
  },

  [CLEAR_UNREAD_FOR_ROOM]: async ({
    commit
  }, roomId) => {
    commit(CLEAR_UNREAD_FOR_ROOM, roomId);
  },

  // @params types:Array
  // @return commit CLEAR_COMMUNITY_NOTIFICATION_UNREAD
  [CLEAR_COMMUNITY_NOTIFICATION_UNREAD]: async ({
    commit
  }, {
    types
  }) => {
    commit(CLEAR_COMMUNITY_NOTIFICATION_UNREAD, types);
  },
  [SET_COMMUNITY_NOTIFICATION_UNREAD]: ({
      commit
    },
    unreadNotificationCounts
  ) => {
    commit(SET_COMMUNITY_NOTIFICATION_UNREAD, unreadNotificationCounts);
  },
  [SET_NEW_NOTIFICATION]: ({
    commit
  }, formatedNotification) => {
    commit(SET_NEW_NOTIFICATION, formatedNotification);
  },
  [RESET_COMMUNITY_NOTIFICATION]: ({
    commit
  }, data) => {
    commit(RESET_COMMUNITY_NOTIFICATION, data);
  },
  [SET_PRIVATE_CHAT_NOTIFICATION]: ({
    commit,
    dispatch
  }, data) => {
    try {
      const {
        receivingRoom,
        sender,
        type
      } = data;
      commit(SET_PRIVATE_CHAT_NOTIFICATION, {
        receivingRoom,
        sender,
        type,
      });
    } catch (err) {
      dispatch(ADD_NOTIFICATION, {
        type: "error",
        message: "傳送失敗，請稍後再試",
      });
    }
  },
};

const mutations = {
  [SET_SUM_OF_UNREAD_PRIVATE_MESSAGES]: (state, sum) => {
    state.sumOfUnreadPrivateMessages = sum;
  },
  [CLEAR_UNREAD_FOR_ROOM]: (state, roomId) => {
    console.log(
      "畫面上減少這個聊天室的未讀state:",

      "roomId:",
      roomId
    );
    const where = {
      roomId,
      newMessages: 0,
    };
    if (
      !state.unreadNotificationForRoom.some((item) => item.roomId === roomId)
    ) {
      return state.unreadNotificationForRoom.push(where);
    }
    state.unreadNotificationForRoom = state.unreadNotificationForRoom.map(
      (item) => {
        if (item.roomId === roomId) {
          return {
            roomId,
            newMessages: 0,
          };
        } else {
          return item;
        }
      }
    );
  },
  [ADD_UNREAD_NOTIFICATION_FOR_ROOM]: (state, {
    roomId,
    addNumber
  }) => {
    if (
      !state.unreadNotificationForRoom.some((item) => item.roomId === roomId)
    ) {
      state.unreadNotificationForRoom.push({
        roomId,
        newMessages: addNumber,
      });
      return;
    }
    state.unreadNotificationForRoom = state.unreadNotificationForRoom.map(
      (item) =>
      item.roomId === roomId ?
      {
        roomId,
        newMessages: item.newMessages + addNumber,
      } :
      item
    );
  },

  [INCREMENT_COMMUNITY_NOTIFICATION_UNREAD_PUBLIC_MESSAGE]: (state) => {
    state.communityNotificationUnread.publicMessage += 1;
  },
  [INCREMENT_UNREAD_COMMUNITY_NOTIFICATION]: (state) => {
    state.communityNotificationUnread.communityNotification += 1;
  },

  [CLEAR_COMMUNITY_NOTIFICATION_UNREAD]: (state, types) => {
    types.forEach((type) => {
      state.communityNotificationUnread[
        helpers.getUnreadNotificationTarget(type)
      ] = 0;
    });
  },
  [SET_COMMUNITY_NOTIFICATION_UNREAD]: (state, unreadNotificationCounts) => {
    state.communityNotificationUnread = {
      ...unreadNotificationCounts,
    };
  },
  [SET_NEW_NOTIFICATION]: (state, formatedNotification) => {
    state.communityNotification.unshift(
      formatedNotification.formatedNotification
    );
  },
  [RESET_COMMUNITY_NOTIFICATION]: (state, notifications) => {
    state.communityNotification = [...notifications];
  },
  [SET_PRIVATE_CHAT_NOTIFICATION]: (state, notification) => {
    state.communityNotification.push({
      ...notification,
    });
  },
};

export default {
  state,
  getters,
  actions,
  mutations,
};