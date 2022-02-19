// this will be merged into usersAPI
import { apiHelper } from "../apis/apiHelper";

export default {
  signUp({ account, name, email, password, checkPassword }) {
    return apiHelper.post("/users", {
      account,
      name,
      email,
      password,
      checkPassword,
    });
  },
  update(id, { account, name, email, password, checkPassword }) {
    return apiHelper.put(`/users/${id}/setting`, {
      account,
      name,
      email,
      password,
      checkPassword,
    });
  },
};
