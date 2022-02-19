import { apiHelper } from "../apis/apiHelper";

export default {
  all() {
    return apiHelper.get("/admin/users");
  },
  getTop() {
    return apiHelper.get("/users/top");
  },
  getUser(userId) {
    return apiHelper.get(`/users/${userId}`);
  },
  getUserRepliesTweets(userId) {
    return apiHelper.get(`/users/${userId}/replied_tweets`);
  },
  getUserLikes(userId) {
    return apiHelper.get(`/users/${userId}/likes`);
  },
  putUserProfile({ userId, formData }) {
    return apiHelper.put(`/users/${userId}`, formData);
  },
};
