<template>
  <div class="container--horizontal">
    <!-- this side bar will need to be replaced with actual one -->
    <div class="sidebar sidebar--admin">
      <AdminSidebar />
    </div>
    <div class="panel--data">
      <div class="panel--data__title">推文清單</div>
      <div class="tweets">
        <!-- todo get real tweets and use v-for to render all tweets then pass id as prop to tweet card to run delete function -->
        <!-- <AdminTweet v-for="i in 10" :key="i" /> -->
        <AdminTweet
          v-for="tweet in getUnfilteredTweets"
          :key="tweet.id"
          :tweet="tweet"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AdminTweet from "@/modules/Admin/AdminTweet.vue";
import AdminSidebar from "@/modules/Admin/AdminSidebar.vue";

import { mapActions } from "vuex";
import { mapGetters } from "vuex";

import {
  GET_UNFILTERED_TWEETS_FOR_ADMIN,
  SET_UNFILTERED_TWEETS_FOR_ADMIN,
} from "@/store/store-types";

export default {
  name: "AdminMain",
  components: {
    AdminTweet,
    AdminSidebar,
  },
  created() {
    this.setUnfilteredTweets();
  },
  methods: {
    ...mapActions({
      setUnfilteredTweets: SET_UNFILTERED_TWEETS_FOR_ADMIN,
    }),
  },
  computed: {
    ...mapGetters({
      getUnfilteredTweets: GET_UNFILTERED_TWEETS_FOR_ADMIN,
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/mixins/_colors.scss";
@import "@/assets/scss/utils/_variables.scss";

.container--horizontal {
  display: flex;
  width: 100%;
  height: 100%;
}
.sidebar {
  width: 25%;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.panel--data {
  height: 100%;
  overflow-y: scroll;
  flex: 1;
  border-left: 1px solid #e6ecf0;
  &__title {
    height: 3.5rem;
    line-height: 3.5rem;
    min-height: 3rem;
    padding: 0 1.6rem;
    font-size: 1.3rem;
    font-weight: var(--fw-bold);
    @include grays(color, g-900);
    border-bottom: 1px solid #e6ecf0;
    border-color: var(--g-75);
  }
  .tweets {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
