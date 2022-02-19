<template>
  <form class="new-tweet-modal" @submit.stop.prevent="handleTweetSubmit">
    <div class="new-text-box">
      <div class="close-btn">
        <button>
          <img
            src="./../../assets/images/icon_close.svg"
            alt=""
            @click="handleShowModalClick"
          />
        </button>
      </div>
      <div class="text-box">
        <div class="user-info">
          <!-- 沒有上傳照片產生空圖 -->
          <img class="user-pic" :src="currentUserPic | emptyImage" alt="" />
        </div>
        <div class="text-area">
          <textarea
            class="form-control"
            rows="3"
            v-model="text"
            maxlength="141"
            placeholder="有什麽新鮮事？"
            @click.stop.prevent="resetEmpty"
          /><span class="limiter">{{ charactersLeft }}</span>
        </div>
      </div>
      <div class="tweet-btn">
        <p v-if="text.length >= 140">字數不可超過 140 字</p>
        <p v-if="submitEmptyField">內容不可空白</p>
        <button>推文</button>
      </div>
    </div>
  </form>
</template>
<script>
import currentUserAPi from "../../apis/currentUserAPI";
import tweetsAPI from "../../apis/tweets";

import { mapGetters } from "vuex";
import { GET_CURRENT_USER } from "../../store/store-types";
import {
  mixinEmptyImage,
  mixinHandleCommunityNotification,
} from "../../utils/mixin";
export default {
  mixins: [mixinEmptyImage, mixinHandleCommunityNotification],
  props: {
    initialShowModal: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showModal: "",
      limit: -1,
      text: "",
      currentUserId: "",
      submitEmptyField: false,
      currentUserPic: {},
      currentUser: {},
    };
  },
  created() {
    this.fetchData();
    this.fetchCurrentUser();
  },
  methods: {
    fetchData() {
      this.showModal = this.initialShowModal;
    },
    async fetchCurrentUser() {
      try {
        const response = await currentUserAPi.getCurrentUser();
        const { avatar, id } = response.data;
        this.currentUserId = id;
        this.currentUserPic = avatar;
        this.currentUser = response.data;
      } catch (error) {
        console.log("error", error);
      }
    },
    handleShowModalClick() {
      if (!this.showModal) {
        this.showModal = true;

        this.$emit("show-modal");
      } else {
        this.showModal = false;
        this.$emit("show-modal");
      }
    },
    async handleTweetSubmit() {
      if (!this.text.length) {
        this.submitEmptyField = true;
        return;
      }
      if (this.text.length > 140) {
        return;
      }

      try {
        const { data } = await tweetsAPI.postOneUserTweet({
          description: this.text,
        });
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        this.$emit("updateData");
        // 通知訂閱人，增加一個新推文，type 5
        this.socketSendCommunityOneNotification(
          "5",
          this.currentUser,
          null,
          this.text
        );
      } catch (error) {
        console.log("error", error);
      }
    },
    resetEmpty() {
      this.submitEmptyField = false;
    },
  },
  computed: {
    charactersLeft() {
      let char = this.text.length,
        limit = 140;

      return limit - char + " / " + limit + "剩餘字數";
    },
    ...mapGetters({
      getCurrentUser: GET_CURRENT_USER,
    }),
  },
};
</script>
<style lang="scss" scoped>
@import "./src/assets/scss/main.scss";
.limiter {
  color: $gray-700;
  font-size: 12px;
  font-weight: var(--bold);
  margin-right: 10px;
}
.new-tweet-modal {
  background-color: rgba(28, 28, 28, 0.5);
  height: 100%;
  padding-top: 50px;
}

.text-area {
  width: 90%;
  text-align: right;
  textarea {
    border: 0px;
    min-height: 150px;
    resize: none;
    width: 100%;
    margin-top: 10px;
    font-family: "Noto Sans TC", sans-serif;
    font-size: 15px;
  }
}

.new-text-box {
  width: 43%;
  margin: 0 auto;
  background-color: $white;
  border-radius: 10px;
}
.close-btn {
  border-bottom: 1px solid $gray-75;
  padding: 10px;
}
.text-box {
  border-top: 0px;
  padding: 10px;
  display: flex;
  flex-flow: row nowrap;
}

.tweet-btn {
  text-align: right;
  padding: 10px;
  p {
    display: inline-block;
    margin-right: 20px;
    color: $red;
    font-size: 15px;
  }
}

.tweet-btn button {
  background-color: $orange-100;
  // font-weight: var(--fw-normal);
  color: $white;
  font-size: 16px;
  width: 65px;
  height: 36px;
  border-radius: 50px;
}

.user-info {
  color: $gray-700;
  width: 10%;
  img {
    max-width: 50px;
    max-height: 50px;
  }
  .user-pic {
    margin-right: 10px;
    border-radius: 50%;
  }
}

.tweet-info p {
  color: $gray-700;
  letter-spacing: 1px;
}
</style>
