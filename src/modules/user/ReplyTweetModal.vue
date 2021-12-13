<template>
  <form
    class="new-tweet-modal"
    @click.stop.prevent="handleCommentSubmit(tweet.TweetId)"
  >
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
      <div class="to-reply-user">
        <div class="to-reply-user_pic">
          <img
            class="user-pic"
            :src="tweet.User && tweet.User.avatar | emptyImage"
            alt=""
          />
          <div class="connecting-line"></div>
        </div>
        <div class="to-reply-user-info">
          <div class="to-reply-user-info_info">
            <p class="to-reply-user-name">
              {{ tweet.User && tweet.User.name }}
              <span>@{{ tweet.User && tweet.User.account }} • </span
              ><span>{{ tweet && tweet.createdAt | fromNow }}</span>
            </p>
          </div>
          <div class="to-reply-user-tweet_text">
            {{ tweet && tweet.description }}
          </div>
          <p class="reply-to">
            回覆給 <span>@{{ tweet.User && tweet.User.account }}</span>
          </p>
        </div>
      </div>

      <div class="text-box">
        <div class="user-info">
          <img
            class="user-pic"
            :src="currentUser && currentUser.avatar | emptyImage"
            alt=""
          />
        </div>
        <div class="text-area">
          <textarea
            class="form-control"
            rows="3"
            v-model="text"
            maxlength="141"
            placeholder="推你的回覆"
            @click.stop.prevent="resetEmpty"
          /><span class="limiter">{{ charactersLeft }}</span>
        </div>
      </div>

      <div class="tweet-btn">
        <p class="error-txt" v-if="text.length >= 140">字數不可超過 140 字</p>
        <p class="error-txt" v-if="submitEmptyField">內容不可空白</p>
        <button type="submit" class="save-btn" :disabled="isProcessing">
          {{ isProcessing ? "發送中..." : "推文" }}
        </button>
      </div>
    </div>
  </form>
</template>
<script>
// need to take targeted user
import { mapGetters } from "vuex";
import { GET_IS_PROCESSING } from "../../store/store-types";
import { mixinEmptyImage, mixinFromNowFilters } from "../../utils/mixin";
import tweetsAPI from "./../../apis/tweets";
import currentUserAPI from "@/apis/currentUserAPI";
export default {
  name: "ReplyTweetModal",
  mixins: [mixinEmptyImage, mixinFromNowFilters],
  props: {
    initialShowReplyModal: {
      type: Boolean,
      required: true,
    },
    initialTweetId: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      showReplyModal: false,
      text: "",
      tweetId: "",
      tweet: {},
      submitEmptyField: false,
      currentUser: {},
    };
  },
  created() {
    this.fetchData();
    this.getCurrentUser();
  },
  methods: {
    fetchData() {
      this.showReplyModal = this.initialShowReplyModal;
      this.tweetId = this.initialTweetId;
      this.fetchTweet(this.tweetId);
    },
    async fetchTweet(tweetId) {
      try {
        const response = await tweetsAPI.getTweet(tweetId);
        const { data } = response;
        this.tweet = { ...data };
      } catch (error) {
        console.log("error", error);
      }
    },
    async handleCommentSubmit(tweetId) {
      if (!this.text.length) {
        this.submitEmptyField = true;

        return;
      }
      if (this.text.length > 140) {
        return;
      }

      try {
        const { data } = await tweetsAPI.replyTweet({
          tweetId: this.tweetId,
          comment: this.text,
        });

        if (data.status !== "success") {
          throw new Error(data.message);
        }
        this.handleShowModalClick();

        if (this.$route.path.startsWith("/reply")) {
          this.$router.push(`/usermain`);
          return;
        }
        this.$router.push(`/reply/${tweetId}`);
      } catch (err) {
        console.log(err);
      }
    },
    async getCurrentUser() {
      try {
        const res = await currentUserAPI.getCurrentUser();
        const { data, statusText } = res;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }

        this.currentUser = data;
      } catch (err) {
        console.log(err);
      }
    },
    handleShowModalClick() {
      this.showReplyModal = false;
      this.$emit("show-reply-modal");
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
      isProcessing: GET_IS_PROCESSING,
    }),
  },
};
</script>
<style lang="scss" scoped>
@import "./src/assets/scss/main.scss";
.error-txt {
  display: inline-block;
  margin-right: 20px;
  color: $red;
  font-size: 13px;
}

.limiter {
  color: $gray-700;
  font-size: 12px;
  font-weight: var(--bold);
  margin-right: 10px;
}
.connecting-line {
  margin: 5px auto;
  border: 1px solid $gray-200;
  height: 60%;
  width: 1px;
  background-color: $gray-200;
}
.reply-to {
  font-size: 12px;
  margin-top: 10px;
  color: $gray-600;
  span {
    color: $orange-100;
  }
}

.to-reply-user-name {
  font-weight: var(--fw-bold);
  font-size: 15px;
  margin-bottom: 5px;
  span {
    color: $gray-600;
    font-weight: var(--fw-normal);
  }
}
.to-reply-user-tweet_text {
  font-weight: var(--fw-thin);
  word-break: break-all;
}

.to-reply-user {
  display: flex;
  flex-flow: row nowrap;
  padding: 10px;
}
.to-reply-user_pic {
  width: 10%;
  margin-right: 7px;
  img {
    width: 50px;
    height: 50px;
  }
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
}

.tweet-info p {
  color: $gray-700;
  letter-spacing: 1px;
}
.user-pic {
  border-radius: 50%;
}
.save-btn {
  border-radius: 25px;
  padding: 3px 12px;
  color: $white;
  background-color: $orange-100;
}
</style>
