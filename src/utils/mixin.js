import Moment from "moment";
import socket from "../main";

Moment.locale("zh-tw", {
  monthsShort: "1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月".split("_"),
  weekdaysMin: "日_一_二_三_四_五_六".split("_"),
  longDateFormat: {
    LT: "Ah點mm分",
    LTS: "Ah點m分s秒",
    L: "YYYY-MM-DD",
    LL: "YYYY年MMMD日",
    LLL: "YYYY年MMMD日Ah點mm分",
    LLLL: "YYYY年MMMD日ddddAh點mm分",
    l: "YYYY-MM-DD",
    ll: "YYYY年MMMD日",
    lll: "YYYY年MMMD日Ah點mm分",
    llll: "YYYY年MMMD日ddddAh點mm分",
  },
  ordinal: function (number, period) {
    switch (period) {
      case "d":
      case "D":
      case "DDD":
        return number + "日";
      case "M":
        return number + "月";
      case "w":
      case "W":
        return number + "周";
      default:
        return number;
    }
  },
  relativeTime: {
    future: "%s内",
    // past: "%s前",
    past: "%s",
    s: "幾秒",
    m: "1 分鐘",
    mm: "%d 分鐘",
    h: "1 小時",
    hh: "%d 小時",
    d: "1 天",
    dd: "%d 天",
    M: "1 個月",
    MM: "%d 个月",
    y: "1 年",
    yy: "%d 年",
  },
});

// @params type:String, currentUserObj:Object, otherObj:Object, senderText:String || null, senderTextIndex:String || null
// @return Object
const formatNotification = (
  type,
  currentUserObj,
  otherObj,
  senderText,
  senderTextIndex
) => {
  let receiverUserId = "";
  if (otherObj && otherObj.followerId) {
    receiverUserId = otherObj.followerId.toString();
  } else if (otherObj && otherObj.UserId) {
    receiverUserId = otherObj.UserId.toString();
  } else if (otherObj && otherObj.id) {
    receiverUserId = otherObj.id.toString();
  }
  return {
    senderUserId: currentUserObj.id.toString(),
    senderName: currentUserObj.name,
    senderAccount: currentUserObj.account,
    senderAvatar: currentUserObj.avatar,
    senderText,
    senderTextIndex,
    receiverUserId,
    receiverName: otherObj && otherObj.name,
    receiverAccount: otherObj && otherObj.account,
    receiverAvatar: otherObj && otherObj.avatar,
    type,
    createdAt: new Date(),
  };
};

export const mixinFromNowFilters = {
  filters: {
    fromNow(datetime) {
      if (!datetime) {
        return "-";
      }
      const nowTime = new Date();
      const pastTime = new Date(datetime.toString().split(".")[0]).getTime();
      if (nowTime - pastTime < 86400000) {
        return Moment(datetime).fromNow();
      } else {
        return Moment(datetime.toString().split("T")[0])
          .locale("zh-tw")
          .format("LL");
      }
    },
  },
};

export const mixinEmptyImage = {
  filters: {
    emptyImage(src) {
      return src || "https://via.placeholder.com/350x220/DFDFDF?text=No+Image";
    },
  },
};

export const mixinFormatMessage = {
  methods: {
    formatMessage(message, type, currentUser) {
      return {
        userId: currentUser.id,
        name: currentUser.name,
        account: currentUser.account,
        avatar: currentUser.avatar,
        message,
        type,
        createdAt: new Date(),
      };
    },
    formatNotification(sender, receivingRoom, type) {
      return {
        sender,
        receivingRoom,
        type,
        createdAt: new Date(),
      };
    },
  },
};

export const mixinFormatGroupMessage = {
  methods: {
    formatGroupMessage(message, type, room, currentUser, otherUser) {
      return {
        roomId: room,
        userId: currentUser.id,
        account: currentUser.account,
        name: currentUser.name,
        avatar: currentUser.avatar,
        message,
        receiverUserId: otherUser.UserId,
        receiverUserName: otherUser.name,
        receiverUserAccount: otherUser.account,
        receiverUserAvatar: otherUser.avatar,
        type,
        createdAt: new Date(),
      };
    },
  },
};

export const mixinHandleCommunityNotification = {
  methods: {
    // 通知訂閱人，追蹤增加一個，type 3，通知訂閱人，追蹤減少一個，type 4，增加一個新的私人訊息，不包括通知訂閱人，除了接收訊息一方，任何訂閱人不會收到其他私人訊息通知，type 7
    socketSendCommunityOneNotification(
      type,
      currentUser,
      targetUser,
      senderText,
      senderTextIndex
    ) {
      const typesSubscriberCanAccess = ["1", "2", "3", "4", "5", "6"];
      senderText = String(senderText) || null;
      senderTextIndex = String(senderTextIndex) || null;

      const formatedNotification = formatNotification(
        type,
        currentUser,
        targetUser,
        senderText,
        senderTextIndex
      );

      if (typesSubscriberCanAccess.includes(type)) {
        socket.emit("sendCommunityNotification", formatedNotification);
      } else if (type === "7") {
        socket.emit(
          "oneNewCommunityFeedOfPrivateMessage",
          formatedNotification
        );
      }
    },
  },
};

const formatUnreadNotification = (
  receiverUserId,
  type,
  addNumber,
  currentUserId,
  roomId
) => {
  return {
    receiverUserId: String(receiverUserId),
    type,
    addNumber,
    currentUserId: String(currentUserId),
    roomId,
  };
};

export const mixinHandleUnreadNotification = {
  methods: {
    socketAfterPrivateMessageSend(
      userId,
      type,
      addNumber,
      currentUserId,
      roomId
    ) {
      const formatedUnreadNotification = formatUnreadNotification(
        userId,
        type,
        addNumber,
        currentUserId,
        roomId
      );
      socket.emit("afterPrivateMessageSend", formatedUnreadNotification);
    },
  },
};