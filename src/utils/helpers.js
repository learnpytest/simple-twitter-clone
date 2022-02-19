import {
  notificationTypes,
  unreadNotificationTypes,
} from "./notification-types";

export default {
  // @param Id:String, compareId:String
  // @return String
  formatUserTitle(userId, compareUserId, name) {
    return userId && String(userId) === String(compareUserId) ? "您" : name;
  },

  // @param type:String
  // @return String
  getNotificationActionAndTarget(type) {
    const displayNotificationStrings = {
      [notificationTypes.like]: {
        action: "喜歡",
        target: "的貼文",
      },
      [notificationTypes.unlike]: {
        action: "收回喜歡",
        target: "的貼文",
      },
      [notificationTypes.follow]: {
        action: "開始追蹤",
        target: null,
      },
      [notificationTypes.unfollow]: {
        action: "取消追蹤",
        target: null,
      },
      [notificationTypes.newTweet]: {
        action: "有新的推文",
        target: null,
      },
      [notificationTypes.replyTweet]: {
        action: "有新的回覆",
        target: null,
      },
      [notificationTypes.newPrivateMessage]: {
        action: "回覆了您的私人訊息",
        target: null,
      },
    };
    return displayNotificationStrings[type];
  },

  getUnreadNotificationTarget(type) {
    const target = {
      [unreadNotificationTypes.communityNotification]: "communityNotification",
      [unreadNotificationTypes.privateMessage]: "privateMessage",
      [unreadNotificationTypes.publicMessage]: "publicMessage",
    };
    return target[type];
  },
};

// 用switch的寫法
//  displayNotificationStrings(noti) {
//    let action;
//    switch (noti.type) {
//      case "1":
//        action = "有新的回覆";
//        break;
//      case "2":
//        action = "開始追蹤";
//        break;
//      case "3":
//        action = "取消追蹤";
//        break;
//    }
//    return (
//      helpers.formatUserTitle(
//        noti.senderUserId,
//        this.currentUser.id.toString(),
//        noti.senderName
//      ) +
//      `${action}` +
//      helpers.formatUserTitle(
//        noti.receiverUserId,
//        this.currentUser.id.toString(),
//        noti.receiverUserName
//      )
//    );
//  },
