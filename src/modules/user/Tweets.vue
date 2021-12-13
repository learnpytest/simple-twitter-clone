<template>
  <!-- todo need to correct all detail for tweets after server provide fulfill tweet data -->
  <div class="tweets-wrapper">
    <div
      class="tweet"
      v-for="(tweet, index) in tweets"
      :key="index"
      @click.stop.prevent="
        () =>
          $router.push({
            name: 'reply-list',
            params: { id: tweet.TweetId },
          })
      "
    >
      <div
        class="user-pic"
        @click.stop.prevent="
          () => $router.push({ name: 'user', params: { id: tweet.User.id } })
        "
      >
        <img :src="tweet.User.avatar | emptyImage" alt="" />
      </div>

      <div class="tweet-info">
        <div class="info">
          <p class="user-name">
            {{ tweet.User.name }}
            <span class="user-id">@{{ tweet.User.account }} • </span
            ><span class="time">{{ tweet.createdAt | fromNow }}</span>
          </p>
        </div>
        <div class="tweet-text">{{ tweet.description }}</div>
        <div class="tweet-buttons-control">
          <div class="tweet-buttons">
            <img
              src="./../../assets/images/icon_reply.svg"
              alt=""
              @click.stop.prevent="handleShowModalClick(tweet.TweetId)"
            />

            <p class="reply-num">{{ tweet.RepliesCount }}</p>
          </div>
          <div class="tweet-buttons">
            <img
              id="liked-btn"
              src="./../../assets/images/icon_like_fill.svg"
              alt=""
              @click.stop.prevent="unLike(tweet.TweetId)"
              v-if="tweet.isLiked"
            />
            <img
              src="./../../assets/images/icon_like.svg"
              alt=""
              @click.stop.prevent="addLike(tweet.TweetId)"
              v-else
            />

            <p class="liked-num" :class="{ liked: tweet.isLiked }">
              {{ tweet.LikesCount }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import likeshipAPI from "./../../apis/likeshipAPI";
import { mixinEmptyImage, mixinFromNowFilters } from "../../utils/mixin";

export default {
  mixins: [mixinEmptyImage, mixinFromNowFilters],
  props: {
    initialTweets: {
      type: Array,
      required: true,
    },
    initialShowReplyModal: {
      type: Boolean,
      //test need to set required on true
      // required: true,
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
      this.tweets = [...newValue];
    },
  },

  created() {
    this.fetchData();
  },
  methods: {
    fetchData() {
      this.showReplyModal = this.initialShowReplyModal;
      this.tweets = this.initialTweets;
    },
    async addLike(tweetId) {
      try {
        const { data } = await likeshipAPI.postLike(tweetId);
        if (data.status !== "success") {
          throw new Error(data.message);
        }

        this.tweets = this.tweets.map((tweet) => {
          if (tweet.TweetId === Number(tweetId)) {
            return {
              ...tweet,
              isLiked: true,
              LikesCount: tweet.LikesCount + 1,
            };
          } else {
            return { ...tweet };
          }
        });
      } catch (error) {
        console.log("error", error);
      }
    },
    async unLike(tweetId) {
      try {
        const { data } = await likeshipAPI.deleteLike(tweetId);
        if (data.status !== "success") {
          throw new Error(data.message);
        }
        this.tweets = this.tweets.map((tweet) => {
          if (tweet.TweetId === Number(tweetId)) {
            return {
              ...tweet,
              isLiked: false,
              LikesCount: tweet.LikesCount - 1,
            };
          } else {
            return { ...tweet };
          }
        });
      } catch (error) {
        console.log("error", error);
      }
    },
    handleShowModalClick(tweetId) {
      this.showReplyModal = true;
      this.$emit("show-reply-modal", tweetId);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./../../assets/scss/main.scss";
@import "./../../assets/scss/tweet.scss";
.tweets-wrapper {
  width: 100%;
}

.tweet {
  display: flex;
  padding: 15px 10px 15px 10px;
  font-size: 14px;
  border-bottom: 1px solid $gray-75;
  cursor: pointer;
}

.tweet-text {
  word-break: break-all;
}
</style>
