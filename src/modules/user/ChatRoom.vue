<template>
  <div class="chat-room-wrapper">
    <div class="header">
      <div class="header-info">
        <p>公開聊天室</p>
      </div>
    </div>

    <div id="chat-wrapper">
      <div
        class="chat-wrapper"
        v-for="(item, index) in allMessages"
        :key="index"
      >
        <div
          class="online-box center"
          v-if="+item.type === 1 && item.account !== currentUser.account"
        >
          <span class="online-text">{{ item.name }} 上線</span>
        </div>
        <div
          class="online-box center"
          v-else-if="+item.type === -1 && item.account !== currentUser.account"
        >
          <span class="online-text">{{ item.name }} 下線</span>
        </div>

        <div
          class="reply-box"
          v-if="item.message && item.account !== currentUser.account"
        >
          <div class="reply-text-info bottom-align">
            <div class="user-info">
              <img class="user-pic" :src="item.avatar | emptyImage" alt="" />
              <div class="user-name">{{ item.name }}</div>
            </div>
            <div class="reply-text-time">
              <div class="reply-text">{{ item.message && item.message }}</div>
            </div>
          </div>
          <p class="reply-time">{{ item.createdAt | fromNow }}</p>
        </div>

        <div
          v-if="item.message && item.account === currentUser.account"
          class="sent-box right"
        >
          <div class="sent-text">{{ item.message }}</div>
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
      <button class="sendBtn" @click="sendMessage">
        <img src="./../../assets/images/send_button.png" />
      </button>
    </div>
  </div>
</template>
<script>
import socket from "../../main";
import { mapState } from "vuex";
import currentUserAPI from "@/apis/currentUserAPI";
import {
  mixinEmptyImage,
  mixinFormatMessage,
  mixinFromNowFilters,
  mixinHandleUnreadNotification,
} from "@/utils/mixin.js";

export default {
  name: "ChatRooom",
  mixins: [
    mixinEmptyImage,
    mixinFormatMessage,
    mixinFromNowFilters,
    mixinHandleUnreadNotification,
  ],
  sockets: {
    users: function (data) {
      this.users = data;
    },

    typing: function () {
      this.typing = true;
    },
    stopTyping: function () {
      this.typing = false;
    },
  },
  data() {
    return {
      ready: false,
      typing: false,
      userName: [],
      temp: {
        message: "",
        name: "",
      },
      currentUser: {},
    };
  },

  methods: {
    sendMessage(e) {
      // emit事件給server
      e.target.focus();
      if (!this.temp.message.trim().length) return;
      this.temp.name = this.currentUser.account;
      // 修改message資料庫資料
      socket.emit(
        "message",
        this.formatMessage(this.temp.message, 0, this.currentUser)
      );
      // 畫面
      this.temp.message = "";
      this.temp.name = "";

      // 修改資料庫對方未讀資料，再修改線上使用者畫面
      socket.emit("afterPublicMessageSend", this.currentUser.id);
    },
    async fetchCurrentUser() {
      try {
        const res = await currentUserAPI.getCurrentUser();
        const { data, statusText } = res;

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.currentUser = { ...data };
      } catch (err) {
        console.log(err);
      }
    },
  },
  created() {
    this.fetchCurrentUser();
  },
  computed: {
    ...mapState({
      allMessages: "allMessages",
      allUsers: "allUsers",
    }),
  },
  watch: {
    temp: {
      handler(value) {
        value.message ? socket.emit("typing") : socket.emit("stopTyping");
      },
      deep: true,
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
