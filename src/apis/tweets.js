// this will be merged into usersAPI
import { apiHelper } from "../apis/apiHelper";

export default {
  all() {
    return apiHelper.get("/tweets");
  },
  unFilteredForAdmin() {
    return apiHelper.get("/admin/tweets");
  },
  delete(tweetId) {
    return apiHelper.delete(`/admin/tweets/${tweetId}`);
  },
  tweet(tweetId) {
    return apiHelper.get(`/tweets/${tweetId}/replies`);
  },
  getAllTweet() {
    return apiHelper.get(`/tweets/`);
  },
  getTweet(tweetId) {
    return apiHelper.get(`/tweets/${tweetId}`);
  },
  getTweetReplies(tweetId) {
    return apiHelper.get(`/tweets/${tweetId}/replies`);
  },
  getOneUserTweet(userId) {
    return apiHelper.get(`/users/${userId}/tweets`);
  },
  getOneUserReplies(userId) {
    return apiHelper.get(`/users/${userId}/replied_tweets`);
  },
  getOneUserLikes(userId) {
    return apiHelper.get(`/users/${userId}/likes`);
  },
  postOneUserTweet({ description }) {
    return apiHelper.post(`/tweets/`, {
      description,
    });
  },
  replyTweet({ tweetId, comment }) {
    return apiHelper.post(`/tweets/${tweetId}/replies`, { comment });
  },
};
