<template>
  <div class="container--horizontal">
    <!-- this side bar will need to be replaced with actual one -->
    <div class="sidebar sidebar--admin">
      <AdminSidebar />
    </div>
    <div class="panel--data">
      <div class="panel--data__title">使用者列表</div>
      <div class="cards">
        <AdminUserCard
          v-for="user in getAllUsers"
          :key="user.id"
          :user="user"
        />
      </div>
    </div>
  </div>
</template>

<script>
import AdminSidebar from "@/modules/Admin/AdminSidebar.vue";
import AdminUserCard from "@/views/Admin/AdminUserCard.vue";

// todo remove comment use this code after backend complete api
import { mapGetters, mapActions } from "vuex";

import { SET_ALL_USERS, GET_ALL_USERS } from "@/store/store-types";

export default {
  name: "AdminUsers",
  components: {
    AdminSidebar,
    AdminUserCard,
  },
  created() {
    this.setAllUser();
  },

  methods: {
    ...mapActions({
      setAllUser: SET_ALL_USERS,
    }),
  },
  computed: {
    ...mapGetters({
      getAllUsers: GET_ALL_USERS,
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
}
.sidebar {
  width: 25%;
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.panel--data {
  height: 100vh;
  overflow: scroll;
  flex: 1;
  border-left: 1px solid #e6ecf0;
  &__title {
    height: 3.5rem;
    line-height: 3.5rem;
    min-height: 3rem;
    margin-bottom: 1rem;
    padding: 0 1.6rem;
    font-size: 1.3rem;
    font-weight: var(--fw-bold);
    @include grays(color, g-900);
    border-bottom: 1px solid #e6ecf0;
    border-color: var(--g-75);
  }
}
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  padding: 1rem;
}
</style>
