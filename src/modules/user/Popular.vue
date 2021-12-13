<template>
  <div class="popular-wrapper">
    <div class="popular-header">Popular</div>
    <div class="popular-card" v-for="user in getTopUsers" :key="user.UserId">
      <!-- 沒有上傳照片產生空圖 -->
      <img
        :src="user.avatar | emptyImage"
        alt="user avatar"
        @click.stop.prevent="redirectToUser(user.UserId)"
        class="hoverStyle"
      />
      <div class="popular-card_info">
        <p class="user-name">{{ user.name }}</p>
        <p class="user-info">@{{ user.account }}</p>
      </div>
      <div class="follow-btn" v-if="user.isFollowed">
        <button
          class="following-btn"
          :class="{ disabled: currentUserId === user.UserId }"
          @click.stop.prevent="cancel(user.UserId)"
          :disabled="currentUserId === user.UserId"
        >
          正在跟隨
        </button>
      </div>
      <div class="follow-btn" v-else>
        <button
          class="follower-btn"
          :class="{ disabled: currentUserId === user.UserId }"
          @click.stop.prevent="post(user.UserId)"
          :disabled="currentUserId === user.UserId"
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
import currentUserAPI from "@/apis/currentUserAPI";

import {
  GET_TOP_USERS,
  SET_TOP_USERS,
  POST_FOLLOWSHIP,
  DELETE_FOLLOWSHIP,
} from "../../store/store-types";
export default {
  name: "Popular",
  mixins: [mixinEmptyImage],
  data() {
    return {
      currentUserId: "",
    };
  },
  created() {
    this.setTopUsers();
    this.getCurrentUser();
  },
  methods: {
    cancel(followingId) {
      const userId = this.$route.params.id;
      this.cancelFollow({ followingId, userId });
      this.$emit("updateCancelView", followingId);
    },
    post(followingId) {
      const userId = this.$route.params.id;
      this.postFollowship({ followingId, userId });
      this.$emit("updateFollowView", followingId);
    },
    ...mapActions({
      setTopUsers: SET_TOP_USERS,
      postFollowship: POST_FOLLOWSHIP,
      cancelFollow: DELETE_FOLLOWSHIP,
    }),

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

    redirectToUser(userId) {
      this.$router.push({ name: "user", params: { id: userId } });
    },
  },
  computed: {
    ...mapGetters({
      getTopUsers: GET_TOP_USERS,
    }),
  },
};
</script>
<style lang="scss" scoped>
@import "./../../assets/scss/main.scss";
.popular-wrapper {
  background-color: $gray-50;
  border-radius: 10px;
  margin-top: 10px;
  font-weight: var(--fw-bold);
  width: 100%;
}
.popular-header {
  padding: 10px;
}

.popular-card {
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 15px;
  border-top: 1px solid $gray-75;
}

.popular-card img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.popular-card_info {
  font-size: 14px;
  margin-left: 10px;
}

.user-info {
  color: $gray-600;
}
.user-name {
  word-break: break-all;
}

.follow-btn {
  width: 100%;
  text-align: right;
}

.follow-btn button {
  font-weight: var(--fw-bold);
  border-radius: 25px;
  padding: 8px 14px;
}
.following-btn {
  color: $white;
  background-color: $orange-100;
}
.user-name {
  word-break: break-all;
}
.follower-btn {
  background-color: $gray-50;
  color: $orange-100;
  border: 1.5px solid $orange-100;
}
.disabled {
  border-color: $disabled-second;
  color: $white;
  background-color: $disabled-second;
}
.hoverStyle {
  cursor: pointer;
}
</style>
