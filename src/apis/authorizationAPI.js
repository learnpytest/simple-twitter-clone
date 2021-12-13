import {
  apiHelper
} from "../apis/apiHelper";

export default {
  signIn({
    account,
    password
  }) {
    return apiHelper.post("/admin/signin", {
      account,
      password,
    });
  },
  usersSignIn({
    account,
    password
  }) {
    return apiHelper.post("/users/signin", {
      account,
      password,
    });
  },
};