<template>
  <div class="container">
    <div class="new-tweet-modal" v-if="showModal">
      <NewTweetModal
        :initialShowModal="showModal"
        @show-modal="modalToggle"
        @updateData="updateTweetsData"
      />
    </div>
    <div class="new-tweet-modal" v-if="showReplyModal">
      <ReplyTweetModal
        :initialShowReplyModal="showReplyModal"
        :initialTweetId="replyTweetId"
        @show-reply-modal="replyModalToggle"
      />
    </div>
    <div class="usermain">
      <div class="sidebar">
        <Sidebar :initialShowModal="showModal" @show-modal="modalToggle" />
      </div>

      <div class="main">
        <div class="addtweet">
          <AddTweet :initialShowModal="showModal" @show-modal="modalToggle" />
        </div>

        <div class="tweets">
          <Tweets
            :initialShowReplyModal="showReplyModal"
            @show-reply-modal="replyModalToggle"
            :initialTweets="userTweets"
          />
        </div>
      </div>
      <div class="popular"><Popular /></div>
    </div>
  </div>
</template>

<script>
import AddTweet from "../modules/user/AddTweet.vue";
import Tweets from "../modules/user/Tweets.vue";
import Popular from "../modules/user/Popular.vue";
import Sidebar from "../modules/user/Sidebar.vue";
import NewTweetModal from "../modules/user/NewTweetModal.vue";
import ReplyTweetModal from "../modules/user/ReplyTweetModal.vue";

import tweetsApi from "./../apis/tweets";
export default {
  components: {
    AddTweet,
    Tweets,
    Popular,
    Sidebar,
    NewTweetModal,
    ReplyTweetModal,
  },
  data() {
    return {
      showModal: false,
      showReplyModal: false,
      userTweets: [],
      replyTweetId: "",
    };
  },
  created() {
    this.getTweets();
  },

  methods: {
    async updateTweetsData() {
      await this.getTweets();
    },
    modalToggle() {
      if (!this.showModal) {
        this.showModal = true;
      } else {
        this.showModal = false;
      }
    },
    async getTweets() {
      try {
        const response = await tweetsApi.getAllTweet();
        const { data } = response;
        this.userTweets = [...data];

        this.showModal = false;
      } catch (error) {
        console.log(error);
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
.usermain {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  height: 100%;
  overflow-y: scroll;
}
.container {
  height: 100vh;
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
}

.addtweet,
.tweets {
  border: 1px solid $gray-75;
}

.popular {
  width: 25%;
  height: 100%;
  position: sticky;
  position: -webkit-sticky;
  bottom: 0;
}
</style>
