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
            <p>訊息</p>
          </div>
        </div>
        <Spinner v-if="isLoading" />
        <div :class="['active-users']" v-else>
          <div
            :class="[
              'active-user',
              { hasUnreadStyle: hasUnread(item && item.roomId) },
            ]"
            v-for="(item, key) in onlyLatestMessageOfEachRoom"
            :key="key"
          >
            <router-link
              v-if="item"
              :class="['reply-box']"
              :to="{
                name: 'private-room',
                query: {
                  to:
                    String(item.userId) !== String(currentUser.id)
                      ? item.userId
                      : item.receiverUserId,
                  room:
                    item.userId < item.receiverUserId
                      ? `${item.userId}${item.receiverUserId}`
                      : `${item.receiverUserId}${item.userId}`,
                },
              }"
            >
              <div class="reply-text-info bottom-align">
                <div class="user-info">
                  <img
                    class="user-pic"
                    :src="
                      String(item.userId) !== String(currentUser.id)
                        ? item.avatar
                        : item.receiverUserAvatar | emptyImage
                    "
                    alt=""
                  />
                </div>
                <div class="reply-text-wrapper">
                  <div class="user-name">
                    <div>
                      <p>
                        {{
                          String(item.userId) !== String(currentUser.id)
                            ? item.name
                            : item.receiverUserName
                        }}
                      </p>
                      <p>
                        {{
                          String(item.userId) !== String(currentUser.id)
                            ? item.account
                            : item.receiverUserAccount
                        }}
                      </p>
                    </div>

                    <span class="reply-time">
                      {{ item.createdAt | fromNow }}
                    </span>
                  </div>
                  <div :class="['reply-text']">
                    <span v-if="String(item.userId) === String(currentUser.id)"
                      >您:</span
                    >

                    <span v-else>{{ item.name }}:</span>

                    {{ item.message }}
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <!-- <div
        class="chat-room"
        id="chatRoom"
        v-chat-scroll="{
          always: false,
          smooth: true,
          scrollonremoved: true,
          smoothonremoved: false,
          notSmoothOnInit: true,
        }"
      >
        <PrivateChatRoom :thisRoomUnread="thisRoomUnread" />
      </div> -->
      <div class="chat-room" id="chatRoom" @click="afterReadPrivateMessages">
        <PrivateChatRoom :thisRoomUnread="thisRoomUnread" />
      </div>
    </div>
  </div>
</template>
<script>
import socket from "../main";
import messagesSocket from "../sockets/messagesSocket";

import currentUserAPI from "@/apis/currentUserAPI";
import usersAPI from "../apis/usersAPI";

import Spinner from "@/components/Loaders/Spinner.vue";
import Sidebar from "../modules/user/Sidebar.vue";
import NewTweetModal from "../modules/user/NewTweetModal.vue";
import PrivateChatRoom from "../modules/user/PrivateChatRoom.vue";

import { mapGetters } from "vuex";

import { mixinEmptyImage, mixinFromNowFilters } from "@/utils/mixin";

import errorHandler from "../utils/errorHandler";

export default {
  name: "PrivateRoom",
  mixins: [mixinEmptyImage, mixinFromNowFilters],
  components: {
    Sidebar,
    NewTweetModal,
    PrivateChatRoom,
    Spinner,
  },

  sockets: {
    displayLatestPrivateRoomMessages(theLatestRoomMessagesArr) {
      if (!theLatestRoomMessagesArr.length)
        return this.$store.dispatch("ADD_NOTIFICATION", {
          type: "info",
          message: "還沒有任何對話訊息",
        });

      this.$store.dispatch(
        "setOnlyLatestMessageOfEachRoom",
        theLatestRoomMessagesArr
      );
    },

    displayNotification(data) {
      this.$store.dispatch("SET_PRIVATE_CHAT_NOTIFICATION", data);
    },
    displayAllUnreadPrivateMessages(myAllUnreadPrivateMessages) {
      this.myAllUnreadPrivateMessages = myAllUnreadPrivateMessages;
    },

    privateMessagesThisRoomAddOne(roomId) {
      this.myAllUnreadPrivateMessages = this.myAllUnreadPrivateMessages.map(
        (msg) =>
          msg.roomId === roomId ? { ...msg, unread: msg.unread + 1 } : msg
      );
      this.thisRoomUnread += 1;
    },
  },
  data() {
    return {
      isLoading: false,
      showModal: false,
      showReplyModal: false,
      currentUser: {},
      otherUser: {},
      myAllUnreadPrivateMessages: [],
      thisRoomUnread: 0,
    };
  },

  mounted() {
    const thisEl = document.querySelector("#chatRoom");
    thisEl.scrollTop + thisEl.clientHeight + this.thisRoomUnread * 50;
    thisEl.addEventListener("scroll", () => {
      thisEl.scrollTop + thisEl.clientHeight + 50 >= thisEl.scrollHeight;
    });
  },
  async beforeRouteUpdate(to, from, next) {
    try {
      await this.fetchCurrentUser();
      // 通知 socket server，增加一個新的使用者進入私人聊天室，不論是否指定聊天室的 id
      await messagesSocket.emitDisplayLatestPrivateRoomMessages(
        this.currentUser
      );

      // 進入元件、路由改變要取得所有未讀資料
      await socket.emit("getAllUnreadPrivateMessages", this.currentUser.id);

      if (!to.query.room) {
        this.$store.dispatch("CLEAR_ONE_ROOM_MESSAGES");
        return next();
      }
      // 通知 socket server，增加一個使用者進入私人聊天室，指定聊天室 id，確認這個聊天是是否已經建立，如果已經建立，並且已經有聊天訊息將歷史訊息，給前端資料顯示指定聊天室的訊息
      await this.fetchOtherUser(to.query.to);

      await messagesSocket.emitDisplayOneRoomMessages(
        to.query.room,
        this.currentUser,
        this.otherUser
      );
      next();
    } catch (err) {
      errorHandler.generalErrorHandler("無法取得資料，請稍後再試")(this);
      next(err);
    }
  },
  async created() {
    try {
      const { room, to } = this.$route.query;
      await this.fetchCurrentUser();
      // 通知 socket server，增加一個使用者進入私人聊天室，不論是否指定聊天室 id，給前端資料顯示最新一則訊息
      await messagesSocket.emitDisplayLatestPrivateRoomMessages(
        this.currentUser
      );

      // 進入元件、路由改變要取得所有未讀資料
      await socket.emit("getAllUnreadPrivateMessages", this.currentUser.id);

      // 私人訊息標示已讀
      if (!this.$route.query.room) {
        this.$store.dispatch("CLEAR_ONE_ROOM_MESSAGES");
        return;
      }

      await this.fetchOtherUser(to);
      // 通知 socket server，增加一個使用者進入私人聊天室，指定聊天室 id，確認這個聊天是是否已經建立，如果已經建立，並且已經有聊天訊息將歷史訊息，給前端資料顯示指定聊天室的訊息
      await messagesSocket.emitDisplayOneRoomMessages(
        room,
        this.currentUser,
        this.otherUser
      );
    } catch (err) {
      this.isLoading = false;

      errorHandler.generalErrorHandler(err)(this);
    }
  },
  computed: {
    hasUnread() {
      return (roomId) => {
        if (!this.myAllUnreadPrivateMessages.length) return false;
        const found = this.myAllUnreadPrivateMessages
          .filter((msg) => msg)
          .find((msg) => msg.roomId === roomId);
        return found && found.unread > 0;
      };
    },
    ...mapGetters({
      onlyLatestMessageOfEachRoom: "getOnlyLatestMessageOfEachRoom",
    }),
  },
  watch: {
    async $route() {
      this.getThisRoomUnread(this.myAllUnreadPrivateMessages);
    },
    myAllUnreadPrivateMessages: {
      handler(value) {
        this.getThisRoomUnread(value);
        const thisEl = document.querySelector("#chatRoom");
        if (!thisEl) return;
        thisEl.scrollTop =
          thisEl.scrollHeight - this.thisRoomUnread * 11.5 - 50;
      },
    },
    deep: true,
  },
  methods: {
    getThisRoomUnread(value) {
      if (!value.length) return;
      const found = value
        .filter((msg) => msg)
        .find((msg) => msg.roomId === this.$route.query.room);
      if (found) {
        this.thisRoomUnread = found.unread;
      }
    },
    makeThisRoomUnreadZeroOnView() {
      if (!this.myAllUnreadPrivateMessages.length) return;
      this.myAllUnreadPrivateMessages = this.myAllUnreadPrivateMessages
        .filter((msg) => msg)
        .map((msg) =>
          msg.roomId === this.$route.query.room ? { ...msg, unread: 0 } : msg
        );
    },
    afterReadPrivateMessages() {
      if (!this.$route.query.room) return;
      // 通知資料庫
      socket.emit("afterReadPrivateMessageOfThisRoom", {
        roomId: this.$route.query.room,
        currentUserId: this.currentUser.id,
        substractNumber: this.thisRoomUnread,
        type: "decrement",
      });

      // 修改畫面
      // Sidebar總數
      this.$store.dispatch("SET_SUM_OF_UNREAD_PRIVATE_MESSAGES", 0);
      // 當前頁面
      this.thisRoomUnread = 0;
      this.makeThisRoomUnreadZeroOnView();
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
        console.log(err);
      }
    },
    async fetchOtherUser(userId2) {
      try {
        this.isLoading = true;
        const res = await usersAPI.getUser(userId2);
        const { data, statusText } = res;

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.otherUser = { ...data };
        this.isLoading = false;
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
  margin-bottom: 0.4rem;
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
    display: flex;
    justify-content: space-between;
  }
  .user-id {
    color: $gray-600;
  }
  &:hover {
    cursor: pointer;
    background-color: darken(#e6ecf0, 10%);
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

.bottom-align {
  display: flex;
  flex-flow: row nowrap;
  align-items: end;
}

.reply-box {
  width: 100%;
  margin: 10px 0;
  color: $gray-900;
}

.reply-text-info {
  align-items: start;
}

.reply-text {
  // background-color: $gray-50;
  padding: 0.5rem 0;
  color: $gray-600;
}

.reply-text-wrapper {
  width: 100%;
}

.reply-time {
  text-align: left;
  margin-left: 50px;
  font-size: 13px;
  color: $gray-600;
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
.hasUnreadStyle {
  background-color: var(--g-75);
}
</style>
