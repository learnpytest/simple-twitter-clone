import { apiHelper } from "../apis/apiHelper";

export default {
  // 取得某使用者跟隨中的人
  getFollowings(userId) {
    return apiHelper.get(`/users/${userId}/followings`);
  },
  // 取得某使用者跟隨者
  getFollowers(userId) {
    return apiHelper.get(`/users/${userId}/followers`);
  },
  // 取消追蹤使用者
  deleteFollowship(id) {
    return apiHelper.delete(`/followships/${id}`);
  },

  // // 追蹤使用者 input userId
  // postFollowships() {
  //   return apiHelper.post(`/followships`);
  // },

  // 追蹤使用者 input userId
  postFollowships(id) {
    return apiHelper.post(`/followships`, {
      id,
    });
  },
};
