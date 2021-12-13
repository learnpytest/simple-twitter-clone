<template>
  <div class="comment-wrapper">
    <div class="comment" v-for="tweet in tweets" :key="tweet.ReplyID">
      <div
        class="user-pic"
        @click.stop.prevent="
          () => $router.push({ name: 'user', params: { id: tweet.User.id } })
        "
      >
        <!-- 沒有上傳照片產生空圖 -->
        <img :src="tweet.User && tweet.User.avatar | emptyImage" alt="" />
      </div>

      <div class="tweet-info">
        <div class="info">
          <p class="user-name">
            {{ tweet.User && tweet.User.name }}
            <span class="user-id"
              >@{{ tweet.User && tweet.User.account }} • </span
            ><span class="time">{{ tweet && tweet.createdAt | fromNow }}</span>
          </p>
        </div>
        <p Class="reply-to">
          回覆

          <span
            >@
            {{
              (tweet.Tweet && tweet.Tweet.User.account) ||
              (parentTweet.User && parentTweet.User.name)
            }}</span
          >
        </p>
        <div class="tweet-text">
          {{ tweet && tweet.comment }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mixinEmptyImage, mixinFromNowFilters } from "../../utils/mixin";

export default {
  name: "Comments",
  props: {
    initialTweets: {
      type: Array,
      required: true,
    },
    parentTweet: {
      type: Object,
    },
  },

  data() {
    return {
      showReplyModal: false,
      tweets: [],
    };
  },
  watch: {
    initialTweets(newValue) {
      this.tweets = [...this.tweets, ...newValue];
    },
  },
  methods: {
    fetchData() {
      this.tweets = this.initialTweets;
    },
  },

  created() {
    this.fetchData();
  },
  mixins: [mixinEmptyImage, mixinFromNowFilters],
};
</script>

<style lang="scss" scoped>
@import "./../../assets/scss/main.scss";
@import "./../../assets/scss/tweet.scss";
.comment-wrapper {
  width: 100%;
}

.comment {
  display: flex;
  padding: 15px 10px 15px 10px;
  font-size: 14px;
  border-bottom: 1px solid $gray-75;
  cursor: pointer;
}

.reply-to {
  color: $gray-600;
  padding-bottom: 5px;
  span {
    color: $orange-100;
  }
}
.tweet-text {
  word-break: break-all;
}
</style>
