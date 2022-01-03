<template>
  <div class="chat-room-wrapper">
    <div class="header">
      <div class="header-info">
        <p v-if="prompt">{{ prompt }}</p>

        <p>{{ otherUser.account }}</p>
      </div>
    </div>
    <div id="chat-wrapper">
      <div
        class="chat-wrapper"
        v-for="(item, index) in thisRoom.messages"
        :key="index"
      >
        <div class="reply-box" v-if="item.account !== currentUser.account">
          <div class="reply-text-info bottom-align">
            <div class="user-info">
              <img class="user-pic" :src="item.avatar | emptyImage" alt="" />
              <div class="user-name">{{ item.name }}</div>
            </div>
            <div class="reply-text-time">
              <div class="reply-text">{{ item.message }}</div>
            </div>
          </div>
          <p class="reply-time">{{ item.createdAt | fromNow }}</p>
        </div>

        <div v-if="item.account === currentUser.account" class="sent-box right">
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
import { mapGetters } from "vuex";
import currentUserAPI from "@/apis/currentUserAPI";
import usersAPI from "@/apis/usersAPI";

import {
  mixinEmptyImage,
  mixinFormatMessage,
  mixinFromNowFilters,
  mixinFormatGroupMessage,
} from "@/utils/mixin.js";

export default {
  name: "ChatRooom",
  mixins: [
    mixinEmptyImage,
    mixinFormatMessage,
    mixinFromNowFilters,
    mixinFormatGroupMessage,
  ],
  sockets: {
    users: function (data) {
      this.users = data;
    },
    allRoomMessages: function ({ room, data }) {
      const { users, messages } = data;
      this.$store.state.rooms[room] = {
        users,
        messages,
      };
      this.fetchRoomState();
    },
    appendRoomMessage: function ({ room, message }) {
      this.appendRoomMessage(room, message);
      this.fetchRoomState();
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
      room: "",
      temp: {
        message: "",
        name: "",
      },
      currentUser: {},
      otherUser: {},

      thisRoom: {
        users: [],
        messages: [],
      },
      prompt: "",
    };
  },
  created() {
    this.fetchCurrentUser();
    this.fetchOtherUser();

    const { room } = this.$route.query;

    if (!room) {
      this.prompt = "選取聊天對象";
      return;
    }
    this.prompt = "";
    this.room = room;
    this.fetchRoomState();
  },

  methods: {
    sendMessage(e) {
      // emit事件給server
      e.target.focus();
      if (!this.temp.message.trim().length) return;
      this.temp.name = this.currentUser.name;
      socket.emit(
        "roomMessage",
        this.formatGroupMessage(this.temp.message, 0, this.$route.query.room)
      );

      this.appendRoomMessage(
        this.$route.query.room,
        this.formatGroupMessage(this.temp.message, 0, this.$route.query.room)
      );

      this.fetchRoomState();
      this.temp.message = "";
      this.temp.name = "";
    },
    async fetchOtherUser() {
      try {
        const { to } = this.$route.query;
        const res = await usersAPI.getUser(+to);
        const { data, statusText } = res;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.otherUser = { ...data };
      } catch (err) {
        console.log(err);
      }
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
    fetchRoomState() {
      const roomState = this.getRoomState(this.room);
      this.thisRoom = {
        messages: roomState ? [...roomState.messages] : [],
        users: roomState ? [...roomState.users] : [],
      };
    },
    appendRoomMessage(room, message) {
      this.$store.dispatch("appendRoomMessage", { room, message });
    },
  },

  computed: {
    ...mapGetters({
      getRoomState: "getRoomState",
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
      this.fetchRoomState();
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
