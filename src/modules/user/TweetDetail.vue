<template>
  <div class="tweet-detail-wrapper">
    <div class="header">
      <img
        src="./../../assets/images/icon_back.png"
        alt=""
        @click="$router.back()"
      />
      <p>推文</p>
    </div>
    <div class="tweet-detail-box">
      <div class="tweet-detail-box_user-info">
        <img
          class="user-pic"
          :src="tweet.User && tweet.User.avatar | emptyImage"
          alt=""
        />
        <div class="nameId">
          <p>{{ tweet.User && tweet.User.name }}</p>
          <p>@{{ tweet.User && tweet.User.account }}</p>
        </div>
      </div>
      <div class="tweet-detail-box_text">
        <p>
          {{ tweet && tweet.description }}
        </p>
        <p class="tweet-detail-box_created-detail">上午 10:05・2020年6月10日</p>
      </div>
      <div class="tweet-detail-box_numbers">
        <p>{{ tweet && tweet.RepliesCount }}<span>回覆</span></p>
        <p>{{ tweet && tweet.LikesCount }}<span>喜歡次數</span></p>
      </div>
      <div class="tweet-detail-box_btn-control">
        <img
          src="./../../assets/images/icon_reply.svg"
          alt=""
          @click.stop.prevent="handleShowModalClick(tweet.TweetId)"
          class="hoverStyle"
        />

        <img
          id="liked-btn"
          src="./../../assets/images/icon_like_fill.svg"
          alt=""
          @click.stop.prevent="unLike(tweet.TweetId)"
          v-if="tweet.isLiked"
          class="hoverStyle"
        />

        <img
          src="./../../assets/images/icon_like.svg"
          alt=""
          @click.stop.prevent="addLike(tweet.TweetId)"
          v-else
          class="hoverStyle"
        />
      </div>
    </div>
  </div>
</template>
<script>
import likeshipAPI from "./../../apis/likeshipAPI";
import { mixinEmptyImage } from "../../utils/mixin";

export default {
  props: {
    // initialShowReplyModal: {
    //   type: Boolean,
    //   //test need to set required on true
    //   required: true,
    // },
    initialTweet: {
      type: Object,
      require: true,
    },
  },
  mixins: [mixinEmptyImage],
  data() {
    return {
      showReplyModal: false,
      tweet: {},
      tweetReplies: [],
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    async addLike(tweetId) {
      try {
        const { data } = await likeshipAPI.postLike(tweetId);
        if (data.status !== "success") {
          throw new Error(data.message);
        }

        this.tweet = {
          ...this.tweet,
          isLiked: true,
          LikesCount: this.tweet.LikesCount + 1,
        };
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
        this.tweet = {
          ...this.tweet,
          isLiked: false,
          LikesCount: this.tweet.LikesCount - 1,
        };
      } catch (error) {
        console.log("error", error);
      }
    },
    fetchData() {
      // this.showReplyModal = this.initialShowReplyModal;
      this.tweet = { ...this.initialTweet };
    },
    handleShowModalClick(tweetId) {
      // this.showReplyModal = true;
      this.$emit("show-reply-modal", tweetId);
    },
  },
  watch: {
    initialTweet() {
      this.fetchData();
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./../../assets/scss/main.scss";
.user-pic {
  border-radius: 50%;
}
.tweet-detail-wrapper {
  border-bottom: 1px solid $gray-75;
}
.header {
  font-weight: var(--fw-bold);
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid $gray-75;
  padding-left: 15px;

  display: flex;
  align-items: center;
  img {
    width: 20px;
    height: 20px;
    margin-right: 40px;
  }
  img:hover {
    cursor: pointer;
  }
}
.tweet-detail-box {
  padding: 10px;
}
.tweet-detail-box_user-info {
  display: flex;
  flex-flow: row nowrap;
  margin: 10px 0;
  font-weight: var(--fw-bold);
  font-size: 15px;
  align-items: center;

  p:nth-child(2) {
    color: $gray-600;
    font-weight: var(--fw-normal);
  }
  img {
    width: 50px;
    height: 50px;
    margin-right: 10px;
  }
}
.tweet-detail-box_text {
  width: 85%;
  font-size: 19px;
  line-height: 28px;
  word-break: break-all;
  .tweet-detail-box_created-detail {
    font-size: 15px;
    color: $gray-600;
    margin: 7px 0;
  }
}
.tweet-detail-box_numbers {
  display: flex;
  padding: 15px 0;
  border-top: 1px solid $gray-75;
  border-bottom: 1px solid $gray-75;
  p {
    margin-right: 30px;
    font-size: 16px;
    font-weight: var(--fw-bold);
  }
  p span {
    font-weight: var(--fw-normal);
    color: $gray-600;
    margin-left: 5px;
  }
}

.tweet-detail-box_btn-control {
  display: flex;
  padding: 15px 0 5px 0;
  img {
    width: 25px;
    margin-right: 130px;
  }
}
.hoverStyle {
  cursor: pointer;
}
</style>
