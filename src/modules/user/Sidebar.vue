<template>
  <div class="sidebar-wrapper">
    <ul class="nav-links">
      <li>
        <router-link to="#">
          <img class="logo" src="./../../assets/images/Logo_small.svg" alt="" />
        </router-link>
      </li>

      <li>
        <router-link :to="{ name: 'UserMain' }">
          <div class="nav-link">
            <img
              class="filter-orange"
              src="./../../assets/images/icon_index.svg"
              alt=""
            />
            <p class="nav-link_text">首頁</p>
          </div>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'user', params: { id: currentUserId } }">
          <div class="nav-link">
            <img
              class="filter-orange"
              src="./../../assets/images/icon_user.svg"
              alt=""
            />
            <p class="nav-link_text">個人資料</p>
          </div>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{
            name: 'community',
          }"
        >
          <div class="nav-link community">
            <span class="community__icon">
              <img class="" src="./../../assets/images/btn_noti.svg" alt="" />
              <span
                v-if="notificationUnread.communityNotification"
                class="community__notification"
                >{{ notificationUnread.communityNotification }}</span
              >
            </span>
            <p class="nav-link_text">通知</p>
          </div>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'public-room' }">
          <div class="nav-link community">
            <span class="community__icon">
              <img
                class="filter-orange"
                src="./../../assets/images/icon_chat.svg"
                alt=""
              />
              <span
                v-if="notificationUnread.publicMessage"
                class="community__notification"
                >{{ notificationUnread.publicMessage }}</span
              >
            </span>
            <p class="nav-link_text">公開聊天室</p>
          </div>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{
            name: 'private-room',
          }"
        >
          <div class="nav-link community">
            <span class="community__icon">
              <img
                class="filter-orange"
                src="./../../assets/images/icon_chat.svg"
                alt=""
              />
              <span
                v-if="sumUpOfUnreadPrivateMessages > 0"
                class="community__notification"
                >{{ sumUpOfUnreadPrivateMessages }}</span
              >
            </span>
            <p class="nav-link_text">私人訊息</p>
          </div>
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'user-setting' }">
          <div class="nav-link">
            <img
              class="filter-orange"
              src="./../../assets/images/icon_cog.svg"
              alt=""
            />
            <p class="nav-link_text">設定</p>
          </div>
        </router-link>
      </li>

      <li class="nav-link">
        <button @click="handleShowModalClick">推文</button>
      </li>
    </ul>
    <div class="logout" @click="logout">
      <router-link to="#">
        <div class="nav-link">
          <img
            class="filter-orange"
            src="./../../assets/images/icon_logout.svg"
            alt=""
          />
          <p class="nav-link_text">登出</p>
        </div>
      </router-link>
    </div>
  </div>
</template>
<script>
import socket from "../../main";

import { mapActions, mapGetters } from "vuex";
import { REVOKE_AUTHENTICATION } from "@/store/store-types";
import currentUserAPI from "@/apis/currentUserAPI";
import { GET_COMMUNITY_NOTIFICATION } from "../../store/store-types";

import { mixinHandleUnreadNotification } from "@/utils/mixin.js";

import errorHandler from "../../utils/errorHandler";

export default {
  name: "Sidebar",
  mixins: [mixinHandleUnreadNotification],
  props: {
    initialShowModal: {
      type: Boolean,
      required: true,
    },
  },
  sockets: {
    displayUnreadNotification(unreadNotificationCounts) {
      this.$store.dispatch(
        "SET_COMMUNITY_NOTIFICATION_UNREAD",
        unreadNotificationCounts
      );
    },
    unreadNotificationPublicMessageAddOne() {
      // 修改畫面
      this.$store.dispatch(
        "INCREMENT_COMMUNITY_NOTIFICATION_UNREAD_PUBLIC_MESSAGE"
      );
    },
    displayAllUnreadPrivateMessages(myAllUnreadPrivateMessages) {
      const sum = myAllUnreadPrivateMessages
        .map((msg) => msg.unread)
        .reduce((prev, now) => prev + now, 0);
      this.$store.dispatch("SET_SUM_OF_UNREAD_PRIVATE_MESSAGES", sum);
    },
    allUnreadPrivateMessagesSumAddOne() {
      this.$store.dispatch(
        "SET_SUM_OF_UNREAD_PRIVATE_MESSAGES",
        this.sumUpOfUnreadPrivateMessages + 1
      );
    },
  },
  data() {
    return {
      showModal: "",
      currentUserId: "",
      sum: 0,
    };
  },
  async created() {
    try {
      await this.getCurrentUser();

      // @params userId:String
      // @return socket event displayUnreadNotification
      await socket.emit("getUnreadNotification", this.currentUserId.toString());
      // 進入元件

      await socket.emit("getAllUnreadPrivateMessages", this.currentUserId);
    } catch (err) {
      errorHandler.generalErrorHandler("無法取得資料，請稍後再試")(this);
    }
  },
  computed: {
    ...mapGetters({
      communityNotification: GET_COMMUNITY_NOTIFICATION,
      notificationUnread: "GET_COMMUNITY_NOTIFICATION_UNREAD",
      sumUpOfUnreadPrivateMessages: "GET_SUM_OF_UNREAD_PRIVATE_MESSAGES",
    }),
  },
  methods: {
    ...mapActions({
      revokeAuthentication: REVOKE_AUTHENTICATION,
    }),
    logout() {
      this.revokeAuthentication();
      this.$router.push("/login");
    },
    handleShowModalClick() {
      this.showModal = true;
      this.$emit("show-modal");
    },
    async getCurrentUser() {
      try {
        const res = await currentUserAPI.getCurrentUser();
        const { data, statusText } = res;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.currentUserId = data.id;
      } catch (err) {
        console.log(err);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./../../assets/scss/main.scss";

.active .filter-orange {
  filter: invert(43%) sepia(89%) saturate(2516%) hue-rotate(1deg)
    brightness(102%) contrast(106%);
}

.active .nav-link_text {
  color: $orange-100;
}

.nav-link {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin-left: 15px;
  margin-top: 25px;
}

.nav-link img {
  max-width: 22px;
  margin-right: 17px;
}

.nav-link_text {
  font-weight: var(--fw-bold);
  color: $gray-900;
  letter-spacing: 1px;
}

.sidebar-wrapper {
  // border: 2px solid $orange-200;
  width: 100%;
  //supposedly 375px
  font-size: 16px;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-between;
  // padding-left: 40px;
}

.logo {
  max-height: 50px;
  max-width: 50px;
  margin-bottom: 30px;
}

button {
  background-color: $orange-100;
  // font-weight: var(--fw-normal);
  color: $white;
  font-size: 16px;
  width: 190px;
  height: 36px;
  border-radius: 50px;
}

.logout {
  margin-bottom: 20px;
}

.community {
  &__icon {
    position: relative;
  }
  &__notification {
    position: absolute;
    right: 30%;
    top: -30%;
    width: 15px;
    height: 15px;
    line-height: 15px;
    text-align: center;
    border-radius: 50%;
    font-size: 0.7rem;
    background-color: red;
    color: white;
  }
}
</style>
