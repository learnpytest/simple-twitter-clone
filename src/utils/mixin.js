import Moment from "moment";

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
    formatMessage(message, type) {
      return {
        id: this.currentUser.id,
        name: this.currentUser.name,
        message,

        type,
        createdAt: new Date(),
      };
    },
  },
};

export const mixinFormatGroupMessage = {
  methods: {
    formatGroupMessage(message, type, room) {
      return {
        room,
        userId: this.currentUser.id,
        account: this.currentUser.account,
        name: this.currentUser.name,
        avatar: this.currentUser.avatar,
        message,
        toUser: this.otherUser,
        type,
        createdAt: new Date(),
      };
    },
  },
};