<template>
  <div class="container">
    <div class="new-tweet-modal" v-if="showModal">
      <NewTweetModal :initialShowModal="showModal" @show-modal="modalToggle" />
    </div>

    <div class="public-chat-modal"></div>
    <div class="public-chat">
      <div class="sidebar">
        <Sidebar :initialShowModal="showModal" @show-modal="modalToggle" />
      </div>
      <div class="online-users">
        <div class="header">
          <div class="header-info">
            <p>上線使用者 ({{ allUsers.length }})</p>
          </div>
        </div>

        <div class="active-users">
          <div class="active-user" v-for="user in allUsers" :key="user.id">
            <img :src="user.avatar | emptyImage" alt="" />
            <p class="user-name">{{ user.name }}</p>

            <p class="user-id">@{{ user.account }}</p>
          </div>
        </div>
      </div>
      <div class="chat-room" v-chat-scroll="{ always: false, smooth: true }">
        <ChatRoom />
      </div>
    </div>
  </div>
</template>
<script>
import Sidebar from "../modules/user/Sidebar.vue";
import NewTweetModal from "../modules/user/NewTweetModal.vue";
import ChatRoom from "../modules/user/ChatRoom.vue";

import currentUserAPI from "@/apis/currentUserAPI";

import { mixinEmptyImage } from "@/utils/mixin";

// import io from "socket.io-client";

import socket from "../main";

import { mapState } from "vuex";

export default {
  mixins: [mixinEmptyImage],
  components: {
    Sidebar,
    NewTweetModal,
    ChatRoom,
  },
  beforeRouteLeave(to, from, next) {
    socket.emit("leaved", this.currentUser);
    next();
  },

  sockets: {
    connect() {
      console.log("socket connected");
    },
    disconnect() {
      console.log("socket disconnected!");
    },

    allMessages: function (data) {
      console.log("publichroom.js allMessages", data);
    },

    joined: function (obj) {
      console.log("publicroom", obj);
    },
  },
  data() {
    return {
      showModal: false,
      showReplyModal: false,
      userName: "Louis",
      currentUser: {},
    };
  },

  created() {
    window.onbeforeunload = () => {
      socket.emit("leaved", this.currentUser);
    };

    this.fetchCurrentUser();
  },
  computed: {
    ...mapState({
      allUsers: "allUsers",
    }),
  },

  methods: {
    newUser() {
      socket.emit("user", { ...this.currentUser });
    },

    async fetchCurrentUser() {
      try {
        const res = await currentUserAPI.getCurrentUser();
        const { data, statusText } = res;

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.currentUser = { ...data };
        this.newUser();
        // socket.emit("joined", this.currentUser);
      } catch (err) {
        console.log(err);
      }
    },

    modalToggle() {
      if (!this.showModal) {
        this.showModal = true;
      } else {
        this.showModal = false;
      }
    },

    replyModalToggle(tweetId) {
      if (!this.showReplyModal) {
        this.replyTweetId = tweetId;
        this.showReplyModal = true;
      } else {
        this.replyTweetId = "";
        this.showReplyModal = false;
      }
    },
    clickButton: function (data) {
      // $socket is socket.io-client instance
      this.$socket.emit("emit_method", data);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./src/assets/scss/main.scss";
.new-tweet-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  height: 100%;
}
.active-user {
  display: flex;
  padding: 15px 10px 15px 10px;
  font-size: 14px;
  border-bottom: 1px solid $gray-75;
  cursor: pointer;
  word-break: break-all;
  display: flex;
  align-items: center;
  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 10px;
  }
  .user-name {
    font-weight: var(--fw-bold);
    margin-right: 5px;
  }
  .user-id {
    color: $gray-600;
  }
}

.public-chat {
  display: flex;
  flex-flow: row nowrap;
  justify-content: right;
  height: 100%;
}
.container {
  height: 100%;
  overflow-y: hidden;
}
.sidebar {
  width: 18%;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
}
.online-users {
  width: 30%;
  border-left: 1px solid $gray-75;
  border-right: 1px solid $gray-75;
  margin-left: 30px;
  overflow-y: auto;
}
.chat-room {
  width: 44.5%;
  overflow-y: scroll;
}
.header {
  display: flex;
  align-items: center;
  height: 60px;
  border-bottom: 1px solid $gray-75;
  padding-left: 15px;
  font-weight: var(--fw-bolder);
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
</style>
