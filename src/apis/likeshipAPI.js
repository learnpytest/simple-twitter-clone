import {
  apiHelper
} from "../apis/apiHelper";

export default {
  // 取得使用者like的推文
  getLikes(userId) {
    return apiHelper.get(`/users/${userId}/likes`);
  },
  // 對推文新增Like
  postLike(tweetId) {
    return apiHelper.post(`/tweets/${tweetId}/like`);
  },
  // 取消喜歡
  deleteLike(tweetId) {
    return apiHelper.post(`/tweets/${tweetId}/unlike`);
  },
};