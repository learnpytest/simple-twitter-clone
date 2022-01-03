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

        <div class="active-users">
          <div class="active-user" v-for="(item, key) in rooms" :key="key">
            <router-link
              class="reply-box"
              :to="{
                name: 'private-room',
                query: {
                  to: selectOtherUser(item.users).userId,
                  room:
                    selectOtherUser(item.users).userId < currentUser.id
                      ? `${selectOtherUser(item.users).userId}${currentUser.id}`
                      : `${currentUser.id}${
                          selectOtherUser(item.users).userId
                        }`,
                },
              }"
            >
              <div class="reply-text-info bottom-align">
                <div class="user-info">
                  <img
                    class="user-pic"
                    :src="
                      selectOtherUser(item.users)
                        ? selectOtherUser(item.users).avatar
                        : '' | emptyImage
                    "
                    alt=""
                  />
                </div>
                <div class="reply-text-wrapper">
                  <div class="user-name">
                    <div>
                      <p>
                        {{
                          selectOtherUser(item.users)
                            ? selectOtherUser(item.users).name
                            : ""
                        }}
                      </p>
                      <p>
                        {{
                          selectOtherUser(item.users)
                            ? `@${selectOtherUser(item.users).account}`
                            : ""
                        }}
                      </p>
                    </div>

                    <span class="reply-time">
                      {{
                        item.messages.length
                          ? item.messages.slice(-1)[0].createdAt
                          : "" | fromNow
                      }}
                    </span>
                  </div>
                  <div class="reply-text">
                    <span
                      v-if="
                        item.messages.length &&
                        item.messages.slice(-1)[0].userId === currentUser.id
                      "
                      >您:</span
                    >
                    {{
                      item.messages.length
                        ? item.messages.slice(-1)[0].message
                        : ""
                    }}
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div class="chat-room" v-chat-scroll="{ always: false, smooth: true }">
        <PrivateChatRoom />
      </div>
    </div>
  </div>
</template>
<script>
import Sidebar from "../modules/user/Sidebar.vue";
import NewTweetModal from "../modules/user/NewTweetModal.vue";
import PrivateChatRoom from "../modules/user/PrivateChatRoom.vue";

import { mapGetters } from "vuex";

import currentUserAPI from "@/apis/currentUserAPI";
import usersAPI from "../apis/usersAPI";

import { mixinEmptyImage, mixinFromNowFilters } from "@/utils/mixin";

import socket from "../main";

export default {
  mixins: [mixinEmptyImage, mixinFromNowFilters],
  components: {
    Sidebar,
    NewTweetModal,
    PrivateChatRoom,
  },

  sockets: {
    connect() {
      console.log("socket connected");
    },
    disconnect() {
      console.log("socket disconnected!");
    },
    setOnlyJoinedRooms(leaveOnlyJoinedRooms) {
      this.$store.dispatch("setRoomsState", leaveOnlyJoinedRooms);
      this.getRooms();
    },
  },
  data() {
    return {
      showModal: false,
      showReplyModal: false,
      currentUser: {},
      otherUser: {},
      rooms: {},
    };
  },

  async created() {
    await this.fetchData();
    await this.joinPrivateRoom();
  },
  computed: {
    ...mapGetters({
      getRoomsState: "getRooms",
    }),
  },
  async beforeRouteUpdate(to, from, next) {
    await this.fetchData();

    await this.joinPrivateRoom();
    next();
  },
  methods: {
    selectOtherUser(users) {
      return users.filter((user) => user.id !== this.currentUser.id)[0];
    },
    getRooms() {
      this.rooms = this.getRoomsState;
    },
    joinPrivateRoom() {
      const { room } = this.$route.query;

      socket.emit("joinPrivateRoom", {
        room,
        selfObj: { ...this.currentUser, userId: this.currentUser.id },
        otherUserObj: { ...this.otherUser, userId: this.otherUser.UserId },
      });
    },
    async fetchData() {
      await this.fetchCurrentUser();
      await this.fetchOtherUser();
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
    async fetchOtherUser() {
      try {
        const res = await usersAPI.getUser(this.$route.query.to);
        const { data, statusText } = res;

        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.otherUser = { ...data };
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
    display: flex;
    justify-content: space-between;
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

.bottom-align {
  display: flex;
  flex-flow: row nowrap;
  align-items: end;
}

.reply-box {
  width: 100%;
  margin: 10px 0;
}

.reply-text-info {
  align-items: start;
}

.reply-text {
  background-color: $gray-50;
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
</style>
