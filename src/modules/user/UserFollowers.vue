<template>
  <div class="follow-wrapper">
    <div
      class="follow-card"
      v-for="follower in getCurrentUserFollowers"
      :key="follower.followerId"
    >
      <!-- 沒有上傳照片產生空圖 -->
      <img :src="follower.avatar | emptyImage" alt="user avatar" />
      <div class="follow-card_info">
        <p class="user-name">{{ follower.name }}</p>
        <p class="user-info">@{{ follower.account }}</p>
        <p class="user-intro">{{ follower.introduction }}</p>
      </div>
      <div class="follow-btn" v-if="follower.isFollowed">
        <button
          class="following-btn"
          @click.stop.prevent="cancel(follower.followerId)"
        >
          正在跟隨
        </button>
      </div>
      <div class="follow-btn" v-else>
        <button
          class="follower-btn"
          @click.stop.prevent="post(follower.followerId)"
        >
          跟隨
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import { mixinEmptyImage } from "../../utils/mixin";

import {
  GET_CURRENT_USER_FOLLOWERS,
  SET_CURRENT_USER_FOLLOWERS,
  // SET_CURRENT_USER_FOLLOWINGS,
  POST_FOLLOWSHIP,
  DELETE_FOLLOWSHIP,
} from "../../store/store-types";
export default {
  name: "UserFollowers",
  mixins: [mixinEmptyImage],
  created() {
    const userId = this.$route.params.id;

    this.$store.dispatch(SET_CURRENT_USER_FOLLOWERS, userId);
  },
  methods: {
    cancel(followingId) {
      const userId = this.$route.params.id;
      this.cancelFollow({ followingId, userId });
      // this.$store.dispatch(SET_CURRENT_USER_FOLLOWERS, userId);
    },
    post(followingId) {
      const userId = this.$route.params.id;
      this.postFollowship({ followingId, userId });
      // this.$store.dispatch(SET_CURRENT_USER_FOLLOWINGS, userId);
    },
    ...mapActions({
      // setCurrentUserFollowers: SET_CURRENT_USER_FOLLOWERS,
      postFollowship: POST_FOLLOWSHIP,
      cancelFollow: DELETE_FOLLOWSHIP,
    }),
  },
  computed: {
    ...mapGetters({
      getCurrentUserFollowers: GET_CURRENT_USER_FOLLOWERS,
    }),
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
  flex-flow: row nowrap;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid $gray-75;
}

.follow-card img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
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
.user-name {
  font-weight: var(--fw-bold);
}
.user-intro {
  word-break: break-all;
}
</style>
