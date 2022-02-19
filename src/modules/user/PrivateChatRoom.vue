<template>
  <div>
    <Spinner v-if="isLoading" />
    <div class="chat-room-wrapper" v-else>
      <div class="header">
        <div class="header-info">
          <p v-if="otherUser.name">
            {{ `${otherUser.name} @${otherUser.account}` }}
          </p>
          <p v-else>
            {{ "請選取聊天對象" }}
          </p>
        </div>
      </div>
      <div id="chat-wrapper" v-if="$route.query.room && otherUser.name">
        <div
          class="chat-wrapper"
          v-for="(item, index) in getOneRoomMessages.messages"
          :key="index"
        >
          <div
            class="online-box center"
            v-if="index === getOneRoomMessages.messages.length - thisRoomUnread"
          >
            <span class="online-text">以下為未讀訊息</span>
          </div>
          <div class="reply-box" v-if="item.account !== currentUser.account">
            <div class="reply-text-info bottom-align">
              <div class="user-info">
                <img class="user-pic" :src="item.avatar | emptyImage" alt="" />
                <div class="user-name">{{ item.name }}</div>
              </div>
              <div class="reply-text-time">
                <div class="reply-text">
                  {{ item.message }}
                </div>
              </div>
            </div>
            <p class="reply-time">{{ item.createdAt | fromNow }}</p>
          </div>

          <div
            v-if="item.account === currentUser.account"
            class="sent-box right"
          >
            <div class="sent-text">{{ item.message }}</div>

            <span v-show="item.isLoading" class="online-text"
              >訊息未傳送...</span
            >
            <p class="sent-time">{{ item.createdAt | fromNow }}</p>
          </div>
        </div>
        <div class="chat-wrapper">
          <div class="online-box center">
            <span class="online-text" v-show="typing">正在輸入訊息...</span>
          </div>
        </div>
      </div>
      <div class="chat-field">
        <input
          type="text"
          id="sendtxt"
          placeholder="輸入訊息..."
          v-model="temp.message"
          @keyup.enter="sendMessage"
        />
        <button class="sendBtn" @click.stop.prevent="sendMessage">
          <img src="./../../assets/images/send_button.png" />
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import socket from "../../main";

import Spinner from "@/components/Loaders/Spinner.vue";

import { mapGetters } from "vuex";
import currentUserAPI from "@/apis/currentUserAPI";
import usersAPI from "@/apis/usersAPI";

import errorHandler from "../../utils/errorHandler";

import {
  mixinEmptyImage,
  mixinFormatMessage,
  mixinFromNowFilters,
  mixinFormatGroupMessage,
  mixinHandleCommunityNotification,
  mixinHandleUnreadNotification,
} from "@/utils/mixin.js";

export default {
  name: "ChatRooom",
  components: { Spinner },
  mixins: [
    mixinEmptyImage,
    mixinFormatMessage,
    mixinFromNowFilters,
    mixinFormatGroupMessage,
    mixinHandleCommunityNotification,
    mixinHandleUnreadNotification,
  ],
  sockets: {
    displayNotificationForEmptyData() {
      return this.$store.dispatch("ADD_NOTIFICATION", {
        type: "info",
        message: "還沒有任何對話訊息",
      });
    },
    users: function (data) {
      this.users = data;
    },
    displayOneRoomMessages({ roomId, messages }) {
      this.$store.dispatch("setOneRoomMessages", { roomId, messages });
    },
    appendRoomMessage({ roomId, oneNewMessage }) {
      // 增加一個訊息在訊息框
      this.appendRoomMessage(roomId, oneNewMessage);

      // 增加一個對方傳來的 the Latest Private Room Messages 訊息在最新訊息欄位
      this.$store.dispatch(
        "setOneNewMsgToLatestMessageOfEachRoom",
        oneNewMessage
      );
    },
    typing: function () {
      this.typing = true;
    },
    stopTyping: function () {
      this.typing = false;
    },
  },
  props: {
    thisRoomUnread: {
      type: Number,
    },
  },
  data() {
    return {
      ready: false,
      typing: false,
      userName: [],
      room: "",
      temp: {
        message: "",
      },
      currentUser: {},
      otherUser: {},
      thisRoom: {
        users: [],
        messages: [],
      },
      isLoading: true,
    };
  },
  async created() {
    try {
      await this.fetchCurrentUser();
      await this.fetchOtherUser();
      const { room } = this.$route.query;
      this.room = room || "";
    } catch (err) {
      errorHandler.generalErrorHandler("無法取得資料，請稍後再試")(this);
    }
  },

  methods: {
    sendMessage(e) {
      // emit事件給server
      e.target.focus();
      if (!this.temp.message.trim().length) return;
      const senderText = this.temp.message;

      try {
        const oneNewRoomMessage = this.formatGroupMessage(
          this.temp.message,
          0,
          this.$route.query.room,
          this.currentUser,
          this.otherUser
        );

        // this just append room messages on frontend instead of modifying database so that user can see update once it's sent
        oneNewRoomMessage.isLoading = true;
        this.appendRoomMessage(this.$route.query.room, oneNewRoomMessage);
        socket.emit("roomMessage", oneNewRoomMessage, (data) => {
          if (data === "success") {
            // 給對方新的通知增加一個，不通知訂閱人
            this.socketSendCommunityOneNotification(
              "7",
              this.currentUser,
              this.otherUser,
              senderText
            );

            // // 未讀數目
            this.socketAfterPrivateMessageSend(
              this.otherUser.UserId,
              "2",
              1,
              this.currentUser.id,
              this.$route.query.room
            );

            // 修改這裡，在回傳appendMessage以後再增加在畫面上
            // 增加一個 the Latest Private Room Messages 在前端的畫面上
            this.$store.dispatch(
              "setOneNewMsgToLatestMessageOfEachRoom",
              oneNewRoomMessage
            );

            oneNewRoomMessage.isLoading = false;
          }
        });
      } catch (err) {
        errorHandler.generalErrorHandler("無法取得資料，請稍後再試")(this);
      }

      this.temp.message = "";
    },
    appendRoomMessage(roomId, oneNewMessage) {
      this.$store.dispatch("appendRoomMessage", { roomId, oneNewMessage });
    },
    async fetchOtherUser() {
      try {
        this.isLoading = true;
        const { to } = this.$route.query;
        const res = await usersAPI.getUser(+to);
        const { data, statusText } = res;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.otherUser = { ...data };
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;

        errorHandler.generalErrorHandler("無法取得資料，請稍後再試")(this);
      }
    },
    async fetchCurrentUser() {
      try {
        this.isLoading = true;
        const res = await currentUserAPI.getCurrentUser();
        const { data, statusText } = res;

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.currentUser = { ...data };
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;
        errorHandler.generalErrorHandler("無法取得資料，請稍後再試")(this);
      }
    },
  },

  computed: {
    ...mapGetters({
      getOneRoomMessages: "getOneRoomMessages",
    }),
  },

  watch: {
    temp: {
      handler(value) {
        value.message ? socket.emit("typing") : socket.emit("stopTyping");
      },
      deep: true,
    },
    $route() {
      this.fetchCurrentUser();
      this.fetchOtherUser();

      const { room } = this.$route.query;
      this.room = room;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./src/assets/scss/main.scss";
#chat-wrapper {
  display: flex;
  flex-flow: column nowrap;
  justify-content: end;
}

.bottom-align {
  display: flex;
  flex-flow: row nowrap;
  align-items: end;
}

.reply-box {
  margin: 10px 0;
}

.reply-text {
  background-color: $gray-75;
  padding: 12px 15px;
  border-radius: 30px 30px 30px 0px;
}

.reply-time {
  text-align: left;
  margin-left: 50px;
  font-size: 13px;
  color: $gray-600;
}

.online-text {
  background-color: $gray-100;
  color: $gray-600;
  padding: 7px 10px;
  border-radius: 100px;
}

.sent-time {
  font-size: 13px;
  color: $gray-600;
}

.sent-box {
  margin: 10px 0;
  display: flex;
  flex-flow: column nowrap;
  align-items: end;
}
.sent-text {
  background-color: $orange-100;
  padding: 13px 10px;
  color: $white;
  border-radius: 30px 30px 0px 30px;
}

.center {
  text-align: center;
  margin: 10px 0;
}

.chat-wrapper {
  padding: 15px;
}

.chat-room-wrapper {
  // height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: space-around;
}

.chat-field {
  border-top: 1px solid $gray-75;
  background-color: $white;
  padding: 11px 20px;
  position: sticky;
  position: -webkit-fixed;
  bottom: 0;
  display: flex;
  flex-flow: row nowrap;
  height: 60px;
  input {
    border: 1px solid $gray-75;
    border-radius: 100px;
    padding: 0 15px;
    background-color: $gray-100;
  }
  button {
    width: 5%;
  }
  img {
    width: 20px;
    height: 20px;
    margin: 0 auto;
  }
  #sendtxt {
    width: 100%;
  }
}

.header {
  display: flex;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid $gray-75;
  padding-left: 15px;
  font-weight: var(--fw-bolder);
  width: 100%;
  background-color: $white;
  position: sticky;
  top: 0;
  .header-info {
    :nth-child(2) {
      font-size: 13px;
      color: $gray-600;
      font-weight: var(--fw-normal);
    }
  }

  img {
    width: 20px;
    height: 20px;
    margin-right: 40px;
  }
  img:hover {
    cursor: pointer;
  }
}

.user-info {
  width: 40px;
  height: 40px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .user-name {
    font-size: 10px;
    color: #657786;
  }
}

// .user-pic {
//   width: 40px;
//   height: 40px;
//   border-radius: 50%;
//   margin-right: 10px;
// }
</style>
