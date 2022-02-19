import Vue from "vue";
import VueRouter from "vue-router";
import store from "../store";

import {
  // ADD_NOTIFICATION,
  RESET_CURRENT_USER_PROFILE,
} from "../store/store-types";

// const authenticateIsAdmin = async (to, from, next) => {
//   const tokenInLocalStorage = localStorage.getItem("token");
//   const tokenInStore = store.state.token;
//   let isAuthenticated = store.state.isAuthenticated;

//   if (isAuthenticated && currentUserProfile.role !== "admin") {
//     store.dispatch(ADD_NOTIFICATION, {
//       type: "error",
//       message: "無瀏覽權限",
//     });
//     next("/admin/login");
//   } else if (!isAuthenticated) {
//     store.dispatch(ADD_NOTIFICATION, {
//       type: "error",
//       message: "尚未登入，請登入管理員帳號",
//     });
//     next("/admin/login");
//   }
//   next();
// };

// const authenticateIsLoggedinUser = async (to, from, next) => {
//   const tokenInLocalStorage = localStorage.getItem("token");
//   const tokenInStore = store.state.token;
//   let isAuthenticated = store.state.isAuthenticated;
//   if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
//     isAuthenticated = await store.dispatch(RESET_CURRENT_USER_PROFILE);
//   }

//   const currentUserProfile = store.state.userProfile.currentUserProfile;

//   if (isAuthenticated && currentUserProfile.role === "admin") {
//     alert("YOU ARE NOT LOGGEDIN YET");
//     // next("PERSSION DENIED");
//     next("/login");
//   } else if (!isAuthenticated) {
//     alert("YOU ARE NOT LOGGEDIN YET");
//     // next("PERSSION DENIED");
//     next("/login");
//   } else {
//     next();
//   }
// };

Vue.use(VueRouter);

const routes = [
  {
    path: "/community",
    name: "community",
    component: () => import("@/views/Community"),
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("@/views/PublicRoom"),
  },
  {
    path: "/reply/:id",
    name: "reply-list",
    component: () => import("@/views/ReplyList"),
  },
  {
    path: "/login",
    name: "user-login",
    component: () => import("@/views/UserLogin"),
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@/views/UserRegister"),
  },

  {
    path: "/admin/login",
    name: "admin-login",
    component: () => import("@/views/Admin/AdminLogin"),
  },
  {
    path: "/admin/users",
    name: "admin-users-list",
    component: () => import("@/views/Admin/AdminUsers"),
  },
  {
    path: "/admin/tweets",
    name: "admin-tweet-list",
    component: () => import("@/views/Admin/AdminMain"),
  },
  {
    path: "/usermain",
    name: "UserMain",
    component: () => import("@/views/UserMain"),
  },

  {
    path: "/users",
    name: "user-followship",

    component: () => import("@/views/UserFollowship.vue"),
    children: [
      {
        path: ":id/followers",
        name: "user-followers",
      },
      {
        path: ":id/followings",
        name: "user-followings",
      },
    ],
  },
  {
    path: "/public-room",
    name: "public-room",
    component: () => import("@/views/PublicRoom"),
  },
  {
    path: "/private-room",
    name: "private-room",
    component: () => import("@/views/PrivateRoom"),
  },
  {
    path: "/user/setting",
    name: "user-setting",
    component: () => import("@/views/UserSetting"),
  },
  {
    path: "/users/:id",
    name: "user",
    component: () => import("@/views/User"),
  },

  {
    path: "/",
    name: "root",
    redirect: "/login",
  },
];

const router = new VueRouter({
  linkExactActiveClass: "active",
  routes,
});

router.beforeEach(async (to, from, next) => {
  const tokenInLocalStorage = localStorage.getItem("token");
  const tokenInStore = store.state.token;
  let isAuthenticated = store.state.isAuthenticated;
  if (tokenInLocalStorage && tokenInLocalStorage !== tokenInStore) {
    isAuthenticated = await store.dispatch(RESET_CURRENT_USER_PROFILE);
  }
  const pathsWithoutAuthentication = ["user-login", "register", "admin-login"];
  const adminPathsWithoutAuthentication = ["admin-login"];

  if (!isAuthenticated && !pathsWithoutAuthentication.includes(to.name)) {
    next("/login");
    return;
  }

  if (isAuthenticated && pathsWithoutAuthentication.includes(to.name)) {
    next("/usermain");
    return;
  }

  if (
    store.state.user.currentUser.account === "admin" &&
    adminPathsWithoutAuthentication.includes(to.name)
  ) {
    next("/admin/tweets");
    return;
  }

  next();
});

export default router;
