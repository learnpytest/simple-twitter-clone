<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<!-- eslint-disable prettier/prettier -->
<template>
  <div id="simple-twitter-app">
    <router-view />
    <notificationMessage />
  </div>
</template>
<script>
import notificationMessage from "@/components/Notifications/notificationMessage";
import currentUserAPi from "./apis/currentUserAPI";
import { SET_NEW_NOTIFICATION } from "./store/store-types";
import socket from "./main";

export default {
  name: "simpleTwitterApp",
  components: {
    notificationMessage,
  },
  async created() {
    const res = await currentUserAPi.getCurrentUser();
    const { data } = res;
    await socket.emit("newCurrentOnlineUser", data);
  },
  sockets: {
    getCommunityNotification(formatedNofitication) {
      if (formatedNofitication) {
        this.$store.dispatch(SET_NEW_NOTIFICATION, formatedNofitication);
      }
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/scss/main.scss";
#simple-twitter-app {
  max-width: 1920px;
  margin: 0 auto;
  height: 100%;
}
</style>
