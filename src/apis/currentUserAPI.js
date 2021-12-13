import {
  apiHelper
} from "../apis/apiHelper";

// 後端應該有兩道與使用者有關的API，一條用id取得使用者，一條直接取得當前使用者，取得當前使用者不需要帶參數，只要header裡面有token，登入以後才能呼叫，依照token回傳當前使用者，接下來使用vuex action呼叫currentUser api
export default {
  getCurrentUser() {
    return apiHelper.get("/get_current_user");
  },

  // 如果沒有使用helper設定token，會是
  // getCurrentUser() {
  //   return apiHelper.get("/get_current_user", {
  //     headers:{
  //       Authorization:`Bearer ${getToken()}`
  //     }
  //   });
  // },
  //這道之後才用到
  // get({userId}){
  //   return apiHelper.get(`/users/${userId}`, {headers:{
  //     Authorization:`Bearer ${getToken()}`
  //   }})
  // }
};