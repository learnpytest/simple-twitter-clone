<template>
  <div>
    <Spinner v-if="isLoading" />
    <div class="profile-wrapper" v-else>
      <!-- 沒cover產生空圖 -->
      <img :src="userObj.cover | emptyImage" alt="" class="background-pic" />
      <div class="profile-pic">
        <!-- 沒有上傳照片產生空圖 -->
        <img id="avatar" :src="userObj.avatar | emptyImage" alt="" />
        <button
          @click="handleShowModalClick"
          v-if="currentUserId === userObj.UserId"
        >
          編輯個人資料
        </button>
        <div class="other-user-btns" v-if="currentUserId !== userObj.UserId">
          <router-link
            class="msg-btn"
            :to="{
              name: 'private-room',
              query: {
                to: userObj.UserId,
                room:
                  userObj.UserId < currentUserId
                    ? `${userObj.UserId}${currentUserId}`
                    : `${currentUserId}${userObj.UserId}`,
              },
            }"
          >
            <img
              src="./../../assets/images/btn_messege.svg"
              alt=""
              class="msg-icon"
            />
          </router-link>
          <div
            class="noti-btn"
            v-if="isSubscribingThisUser"
            @click="cancelSubscribeUser"
          >
            <img
              src="./../../assets/images/btn_noti_active.svg"
              alt=""
              class="msg-icon"
            />
          </div>
          <div class="noti-btn" v-else @click="subscribeUser">
            <img
              src="./../../assets/images/btn_noti.svg"
              alt=""
              class="msg-icon"
            />
          </div>
          <div class="followship-btn">
            <div class="follow-btn" v-if="userObj.isFollowed">
              <button
                class="following-btn"
                @click.stop.prevent="cancel(userObj.UserId, userObj)"
              >
                正在跟隨
              </button>
            </div>
            <div class="follow-btn" v-else>
              <button
                class="follower-btn"
                @click.stop.prevent="post(userObj.UserId, userObj)"
              >
                跟隨
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="profile-details">
        <p class="profile-name">{{ userObj.name }}</p>
        <p class="profile-id">@{{ userObj.account }}</p>
        <p class="description">
          {{ userObj.introduction }}
        </p>
        <!-- todo api 沒有跟隨者與跟隨中使用者 -->
        <router-link
          :to="{ name: 'user-followings', params: { id: userObj.UserId } }"
          class="profile-follow"
          >{{ userObj.FollowingsCount }}個<span>跟隨中</span></router-link
        >
        <router-link
          :to="{ name: 'user-followers', params: { id: userObj.UserId } }"
          class="profile-follow"
          >{{ userObj.FollowersCount }}位<span>跟隨者</span></router-link
        >
      </div>
    </div>
  </div>
</template>
<script>
import socket from "../../main";

import Spinner from "@/components/Loaders/Spinner.vue";

import {
  mixinEmptyImage,
  mixinHandleCommunityNotification,
} from "@/utils/mixin";
import currentUserAPI from "@/apis/currentUserAPI";

import { mapActions } from "vuex";

import { POST_FOLLOWSHIP, DELETE_FOLLOWSHIP } from "@/store/store-types";

import errorHandler from "../../utils/errorHandler";

export default {
  sockets: {
    subscribingStatus(status) {
      if (status === "success") {
        this.$store.dispatch("ADD_NOTIFICATION", {
          type: "success",
          message: "已成功訂閱",
        });
        this.isSubscribingThisUser = true;
      } else if (status === "isSubscribing") {
        this.isSubscribingThisUser = true;
      } else if (status === "isNotSubscribing") {
        this.isSubscribingThisUser = false;
      } else if (status === "cancelSubscribing") {
        this.$store.dispatch("ADD_NOTIFICATION", {
          type: "success",
          message: "已取消訂閱",
        });
        this.isSubscribingThisUser = false;
      } else if (status === "error") {
        errorHandler.generalErrorHandler("伺服器忙碌中，請稍後再試")(this);
      }
    },
  },
  mixins: [mixinEmptyImage, mixinHandleCommunityNotification],
  components: {
    Spinner,
  },
  props: {
    initialEditModal: {
      type: Boolean,
      required: true,
    },
    initialUserObj: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      showEditModal: false,
      text: "",
      userObj: {},
      currentUserId: "",
      currentUser: {},
      isSubscribingThisUser: false,
      isLoading: true,
    };
  },
  async created() {
    try {
      this.isLoading = true;
      await this.fetchData();
      await this.getCurrentUser();
      await socket.emit("getSubscribingStatus", {
        subscriber: this.currentUser,
        subscribed: this.userObj,
      });
      this.isLoading = false;
    } catch (err) {
      errorHandler.generalErrorHandler("無法取得資料，請稍後再試")(this);
    }
  },
  methods: {
    cancelSubscribeUser() {
      socket.emit("cancelSubscribeUser", {
        subscriber: this.currentUser,
        subscribed: this.userObj,
      });
    },
    subscribeUser() {
      socket.emit("subscribeUser", {
        subscriber: this.currentUser,
        subscribed: this.userObj,
      });
    },
    fetchData() {
      this.showEditModal = this.initialEditModal;
      this.userObj = this.initialUserObj;
    },
    cancel(followingId, follower) {
      this.cancelFollow({ followingId, userId: this.userObj.UserId });

      this.userObj.FollowingsCount = this.userObj.FollowingsCount - 1;
      this.userObj.isFollowed = false;

      // 通知訂閱人，追蹤減少一個，type 4
      this.socketSendCommunityOneNotification("4", this.currentUser, follower);
    },
    post(followingId, follower) {
      this.postFollowship({ followingId, userId: this.userObj.UserId });

      this.userObj.FollowingsCount = this.userObj.FollowingsCount + 1;
      this.userObj.isFollowed = true;

      // 通知訂閱人，追蹤增加一個，type 3
      this.socketSendCommunityOneNotification("3", this.currentUser, follower);
    },
    ...mapActions({
      cancelFollow: DELETE_FOLLOWSHIP,
      postFollowship: POST_FOLLOWSHIP,
    }),
    handleShowModalClick() {
      this.showEditModal = false;
      this.$emit("show-edit-modal");
    },
    async getCurrentUser() {
      try {
        const res = await currentUserAPI.getCurrentUser();
        const { data, statusText } = res;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.currentUserId = data.id;
        this.currentUser = data;
      } catch (err) {
        console.log(err);
      }
    },
  },

  watch: {
    initialUserObj: {
      handler(newValue) {
        this.userObj = {
          ...newValue,
        };
      },
      deep: true,
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./src/assets/scss/main.scss";
.other-user-btns {
  display: flex;
  flex-flow: row nowrap;
  justify-content: right;
  .following-btn {
    color: $white;
    background-color: $orange-100;
  }
  .noti-btn {
    margin: 0 10px;
  }
}
.background-pic {
  max-width: auto;
  height: 170px;
  object-fit: cover;
}

.profile-pic {
  position: relative;
  text-align: right;
  padding: 10px;

  #avatar {
    position: absolute;
    width: 140px;
    height: 140px;
    object-fit: cover;
    top: -70px;
    left: 10px;
    border-radius: 50%;
  }
  button {
    font-weight: var(--fw-bold);
    border-radius: 25px;
    padding: 8px 14px;
    color: $orange-100;
    border: 1.5px solid $orange-100;
  }
}
.profile-details {
  padding: 10px;
  margin-top: 15px;
  word-break: break-all;
  .profile-name {
    font-weight: var(--fw-bolder);
    font-size: 18px;
  }
  .profile-id {
    font-size: 15px;
    color: $gray-600;
  }
  .description {
    margin: 10px 0;
  }
  .profile-follow {
    display: inline-block;
    font-size: 14px;
    margin-right: 20px;
    color: $black;
    span {
      color: $gray-600;
      margin-left: 2px;
    }
  }
}
</style>
