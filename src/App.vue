<template>
  <div id="simple-twitter-app">
    <router-view />
    <notificationMessage />
  </div>
</template>
<script>
import notificationMessage from "@/components/Notifications/notificationMessage";

export default {
  name: "simpleTwitterApp",
  components: {
    notificationMessage,
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
