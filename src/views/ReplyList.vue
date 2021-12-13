<template>
  <div class="container">
    <div class="new-tweet-modal" v-if="showModal">
      <NewTweetModal :initialShowModal="showModal" @show-modal="modalToggle" />
    </div>
    <div class="new-tweet-modal" v-if="showReplyModal">
      <ReplyTweetModal
        :initialShowReplyModal="showReplyModal"
        :initialTweetId="replyTweetId"
        @show-reply-modal="replyModalToggle"
      />
    </div>
    <div class="reply-modal"></div>
    <div class="reply-list">
      <div class="sidebar">
        <Sidebar :initialShowModal="showModal" @show-modal="modalToggle" />
      </div>
      <div class="main">
        <div class="tweet-detail">
          <TweetDetail
            :initialTweet="tweet"
            @show-reply-modal="replyModalToggle"
          />
        </div>

        <div class="tweets">
          <Comments :initialTweets="initialTweetReplies" :parentTweet="tweet" />
        </div>
      </div>
      <div class="popular"><Popular /></div>
    </div>
  </div>
</template>
<script>
import Popular from "../modules/user/Popular.vue";
import Sidebar from "../modules/user/Sidebar.vue";
import TweetDetail from "../modules/user/TweetDetail.vue";
import NewTweetModal from "../modules/user/NewTweetModal.vue";
import tweetsAPI from "./../apis/tweets";
import ReplyTweetModal from "../modules/user/ReplyTweetModal.vue";
import Comments from "@/modules/user/Comments.vue";

export default {
  components: {
    Popular,
    Sidebar,
    TweetDetail,
    NewTweetModal,
    ReplyTweetModal,
    Comments,
  },
  data() {
    return {
      showModal: false,
      showReplyModal: false,
      tweet: {},
      initialTweetReplies: [],
    };
  },
  created() {
    let tweetId = this.$route.params.id;
    this.fetchTweet(tweetId);
    this.fetchTweetReplies(tweetId);
  },
  methods: {
    async fetchTweet(tweetId) {
      try {
        const response = await tweetsAPI.getTweet(tweetId);
        const { data } = response;
        this.tweet = { ...data };
      } catch (error) {
        console.log("error", error);
      }
    },
    async fetchTweetReplies(tweetId) {
      try {
        const response = await tweetsAPI.getTweetReplies(tweetId);
        const { data } = response;
        this.initialTweetReplies = [...data];
      } catch (error) {
        console.log("error", error);
      }
    },
    modalToggle() {
      if (!this.showModal) {
        this.showModal = true;
      } else {
        this.showModal = false;
      }
    },

    replyModalToggle(tweetId) {
      if (!this.showReplyModal) {
        this.replyTweetId = tweetId;
        this.showReplyModal = true;
      } else {
        this.replyTweetId = "";
        this.showReplyModal = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./src/assets/scss/main.scss";
.new-tweet-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  height: 100%;
}
.reply-list {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  height: 100%;
  overflow-y: scroll;
}
.container {
  height: 100%;
  overflow-y: hidden;
}
.sidebar {
  width: 18%;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
}
.main {
  width: 42%;
  height: 100%;
  margin: 0 30px;
  border: 1px solid $gray-75;
}
.popular {
  width: 25%;
  position: sticky;
  position: -webkit-sticky;
  // top: 0;
}
</style>
