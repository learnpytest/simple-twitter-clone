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
            <router-link
              :to="{
                name: 'private-room',
                query: {
                  id: user.id,
                  room: `${user.id}` + `${currentUser.id}`,
                },
              }"
            >
              <img :src="user.avatar | emptyImage" alt="" />
            </router-link>
            <p class="user-name">{{ user.name }}</p>

            <p class="user-id">@{{ user.account }}</p>
          </div>
        </div>
      </div>
      <div
        class="chat-room"
        v-chat-scroll="{
          always: false,
          smooth: true,
        }"
        @click.stop.prevent="makeUnreadPublicMessageZero"
      >
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
  data() {
    return {
      showModal: false,
      showReplyModal: false,
      currentUser: {},
    };
  },

  async created() {
    // window.onbeforeunload = () => {
    //   socket.emit("leaved", this.currentUser);
    // };

    await this.fetchCurrentUserAndEmitNewUser();

    this.makeUnreadPublicMessageZero();
  },
  computed: {
    ...mapState({
      allUsers: "allUsers",
    }),
  },

  methods: {
    makeUnreadPublicMessageZero() {
      // 修改畫面，Sidebar的公開聊天室未讀歸零
      this.$store.dispatch("CLEAR_COMMUNITY_NOTIFICATION_UNREAD", {
        currentUserId: this.currentUser.id,
        types: ["3"],
      });
      // 修改資料庫自己的unread notification public message 歸零
      socket.emit("afterReadPublicMessage", this.currentUser.id);
    },
    async fetchCurrentUserAndEmitNewUser() {
      try {
        const res = await currentUserAPI.getCurrentUser();
        const { data, statusText } = res;

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.currentUser = { ...data };
        this.newUser();
      } catch (err) {
        console.log(err);
      }
    },
    newUser() {
      socket.emit("user", { ...this.currentUser });
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
