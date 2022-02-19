<template>
  <div class="container">
    <div class="user">
      <div class="sidebar"><Sidebar /></div>
      <div class="main">
        <div class="header">
          <img
            src="./../assets/images/icon_back.png"
            alt=""
            @click="redirect"
          />
          <div class="header-info">
            <p>通知</p>
          </div>
        </div>

        <CommunityNotifications :initialShowReplyModal="showReplyModal" />
      </div>
      <div class="popular"><Popular /></div>
    </div>
  </div>
</template>
<script>
import Popular from "../modules/user/Popular.vue";
import Sidebar from "../modules/user/Sidebar.vue";

import CommunityNotifications from "../modules/user/CommunityNotifications.vue";

import { mapGetters } from "vuex";

import usersAPI from "../apis/usersAPI";

import { GET_CURRENT_USER } from "../store/store-types";
export default {
  components: {
    Popular,
    Sidebar,

    CommunityNotifications,
  },
  data() {
    return {
      showEditModal: false,
      showReplyModal: false,

      userId: "",
      userObj: {},
    };
  },
  created() {
    this.userId = this.$route.params.id;
    this.fetchUser(this.userId);
  },
  methods: {
    redirect() {
      this.$router.push("/usermain");
    },
    async fetchUser(userId) {
      try {
        this.isLoading = true;

        const res = await usersAPI.getUser(userId);
        const { data, statusText } = res;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.userObj = { ...data };

        this.isLoading = false;
      } catch (err) {
        this.isLoading = false;

        console.log(err);
      }
    },
    editModalToggle() {
      if (!this.showEditModal) {
        this.showEditModal = true;
      } else {
        this.showEditModal = false;
      }
    },
  },

  computed: {
    ...mapGetters({
      getCurrentUser: GET_CURRENT_USER,
    }),
  },
  beforeRouteUpdate(to, from, next) {
    this.$store.dispatch("SET_CURRENT_USER_FOLLOWINGS");

    next();
  },
};
</script>

<style lang="scss" scoped>
@import "./src/assets/scss/main.scss";

.user-edit-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  height: 100%;
}
.tabs {
  border-left: 1px solid $gray-75;
  border-right: 1px solid $gray-75;
}
.header {
  display: flex;
  align-items: center;
  height: 50px;
  padding-left: 15px;
  font-weight: var(--fw-bolder);
  border-left: 1px solid $gray-75;
  border-right: 1px solid $gray-75;
  .header-info {
    :nth-child(2) {
      font-size: 13px;
      color: $gray-600;
      font-weight: var(--fw-normal);
    }
  }

  img {
    width: 20px;
    height: 20px;
    margin-right: 40px;
  }
  img:hover {
    cursor: pointer;
  }
}
.user {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  height: 100vh;
  overflow-y: scroll;
}
.container {
  overflow: hidden;
}
.main {
  width: 42%;
  height: 100%;
  margin: 0 30px;
}

.popular {
  width: 25%;
  height: 100%;
  position: sticky;
  position: -webkit-sticky;
  // top: 0;
}
.sidebar {
  width: 18%;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
}

.follow-tab {
  height: 100vh;
}
</style>
