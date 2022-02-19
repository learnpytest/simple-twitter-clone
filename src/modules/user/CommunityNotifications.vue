<template>
  <div class="follow-wrapper" @click.stop.prevent="makeUnreadNotificationZero">
    <div
      class="follow-card"
      v-for="(noti, index) in getCommunityNotification"
      :key="index"
    >
      <!-- 沒有上傳照片產生空圖 -->
      <img :src="noti.senderAvatar | emptyImage" alt="user avatar" />
      <div class="follow-card_info">
        <!-- <p class="user-info">@{{ noti.senderAccount }}</p> -->
        <p class="noti-line">{{ displayNotificationStrings(noti) }}</p>
        <p class="noti-text">{{ noti.senderText }}</p>
        <p class="noti-text">{{ noti.createdAt | fromNow }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import currentUserAPi from "../../apis/currentUserAPI";
import helpers from "../../utils/helpers";

import socket from "../../main";

import { mapGetters } from "vuex";

import {
  mixinEmptyImage,
  mixinHandleCommunityNotification,
  mixinFromNowFilters,
} from "../../utils/mixin";

import { GET_COMMUNITY_NOTIFICATION } from "../../store/store-types";

export default {
  name: "CommunityNotifications",
  mixins: [
    mixinEmptyImage,
    mixinHandleCommunityNotification,
    mixinFromNowFilters,
  ],
  data() {
    return { currentUser: {} };
  },
  async created() {
    await this.fetchCurrentUser();
    await socket.emit("getAllCommunityNotification", this.currentUser);
  },
  sockets: {
    getAllCommunityNotification(myCommunityFeed) {
      this.$store.dispatch("RESET_COMMUNITY_NOTIFICATION", myCommunityFeed);
      console.log("myCommunityFeed是甚麼:", myCommunityFeed);
    },
    addOneCommunityNotification(newCommunityFeed) {
      this.$store.dispatch("INCREMENT_UNREAD_COMMUNITY_NOTIFICATION");
      this.$store.dispatch("SET_NEW_NOTIFICATION", newCommunityFeed);
    },
  },
  methods: {
    async makeUnreadNotificationZero() {
      // 取消標示未讀
      this.$store.dispatch("CLEAR_COMMUNITY_NOTIFICATION_UNREAD", {
        currentUserId: this.currentUser.id,
        types: ["1"],
      });
      await socket.emit("zeroCommunityNotificationUnread", this.currentUser.id);
    },
    async fetchCurrentUser() {
      const res = await currentUserAPi.getCurrentUser();
      const { data } = res;
      this.currentUser = { ...data };
    },
    // @param noti:Object
    // @return notificationState:String
    displayNotificationStrings(noti) {
      let notificationState;
      const hasReceiverTitle = ["1", "2", "3", "4"];

      const receiverTitle =
        hasReceiverTitle.includes(noti.type) &&
        helpers.formatUserTitle(
          noti.receiverUserId,
          this.currentUser.id,
          noti.receiverName
        );

      const actionAndTarget = helpers.getNotificationActionAndTarget(noti.type);
      notificationState =
        noti.senderName +
        actionAndTarget.action +
        (receiverTitle || "") +
        (actionAndTarget.target || "");

      return notificationState;
    },
  },
  computed: {
    ...mapGetters({
      getCommunityNotification: GET_COMMUNITY_NOTIFICATION,
    }),
    notificationArr() {
      return this.getCommunityNotification.map(this.displayNotificationStrings);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./../../assets/scss/main.scss";
.follow-wrapper {
  font-weight: var(--fw-normal);
  width: 100%;
}
.follow-header {
  padding: 10px;
}

.follow-card {
  display: flex;
  // flex-flow: row nowrap;
  flex-direction: column;
  // align-items: center;
  align-items: flex-start;
  padding: 15px;
  border-bottom: 1px solid $gray-75;
}

.follow-card img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 0.8rem;
  // width: 10%;
}

.follow-card_info {
  font-size: 14px;
  margin-left: 10px;
  width: 70%;
}

.user-info {
  color: $gray-600;
}

.follow-btn {
  width: 20%;
  text-align: right;
}

.follow-btn button {
  border-radius: 25px;
  padding: 4px 10px;
}
.following-btn {
  color: $white;
  background-color: $orange-100;
}

.follower-btn {
  background-color: $gray-50;
  color: $orange-100;
  border: 1.5px solid $orange-100;
}
.noti-line {
  font-weight: var(--fw-bold);
  color: $gray-900;
  word-break: break-all;
}
.noti-text {
  padding: 1rem 0;
  background-color: $gray-50;
  color: $gray-700;
}
</style>
