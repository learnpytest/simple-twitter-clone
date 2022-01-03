<template>
  <div class="profile-wrapper">
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
        <div class="noti-btn">
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
              @click.stop.prevent="cancel(userObj.UserId)"
            >
              正在跟隨
            </button>
          </div>
          <div class="follow-btn" v-else>
            <button
              class="follower-btn"
              @click.stop.prevent="post(userObj.UserId)"
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
</template>
<script>
import { mixinEmptyImage } from "@/utils/mixin";
import currentUserAPI from "@/apis/currentUserAPI";

import { mapActions } from "vuex";

import { POST_FOLLOWSHIP, DELETE_FOLLOWSHIP } from "@/store/store-types";

export default {
  mixins: [mixinEmptyImage],
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
    };
  },
  created() {
    this.fetchData();
    this.getCurrentUser();
  },
  methods: {
    fetchData() {
      this.showEditModal = this.initialEditModal;
      this.userObj = this.initialUserObj;
    },
    cancel(followingId) {
      this.cancelFollow({ followingId, userId: this.userObj.UserId });

      this.userObj.FollowingsCount = this.userObj.FollowingsCount - 1;
      this.userObj.isFollowed = false;
    },
    post(followingId) {
      this.postFollowship({ followingId, userId: this.userObj.UserId });

      this.userObj.FollowingsCount = this.userObj.FollowingsCount + 1;
      this.userObj.isFollowed = true;
    },
    ...mapActions({
      cancelFollow: DELETE_FOLLOWSHIP,
      postFollowship: POST_FOLLOWSHIP,
    }),
    handleShowModalClick() {
      this.showEditModal = false;
      this.$emit("show-edit-modal");
      // edit
      // this.$router.push(`/users/${this.initialUserObj.UserId}`);
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
