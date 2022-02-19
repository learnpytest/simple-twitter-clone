<template>
  <menu class="menu">
    <div class="menu__item menu__item--logo">
      <img
        class="menu__logo"
        src="@/assets/images/Icon_logo_self.png"
        alt="logo"
      />
    </div>
    <router-link class="menu__item" :to="{ name: 'admin-tweet-list' }">
      <img
        src="@/assets/images/icon_index.svg"
        class="menu__image filter-orange"
      />
      <span class="menu__txt"> 推文清單 </span>
    </router-link>
    <!-- todo will need to adjust icon with svg to fit different usage case such as hover or active -->
    <router-link class="menu__item" :to="{ name: 'admin-users-list' }">
      <img
        class="menu__image filter-orange"
        src="@/assets/images/icon_user.svg"
      />
      <span class="menu__txt"> 使用者列表 </span>
    </router-link>

    <div class="menu__item menu__action" @click="logout">
      <img
        class="menu__image filter-orange"
        src="@/assets/images/icon_logout.svg"
        alt=""
      />
      <span>登出</span>
    </div>
  </menu>
</template>
<script>
import { mapActions } from "vuex";
import { REVOKE_AUTHENTICATION } from "@/store/store-types";

export default {
  name: "AdminSidebar",
  methods: {
    ...mapActions({
      revokeAuthentication: REVOKE_AUTHENTICATION,
    }),
    logout() {
      this.revokeAuthentication();
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/mixins/_colors.scss";
@import "@/assets/scss/utils/_variables.scss";

.menu {
  padding: 0.7rem 0;
  min-width: fit-content;
  width: fit-content;
  margin: 0 auto;

  @include grays(color, g-900);

  font-weight: var(--fw-bold);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
  &__icon {
    width: 1.3rem;
    height: 1.3rem;
    background-image: url("../../assets/images/icon_index.svg");
    background-size: cover;
  }

  &__item {
    display: flex;
    gap: 1.4rem;
    align-items: flex-end;
    padding: 0.1rem;

    &.active {
      .menu__txt {
        @include theme-colors(color, primary);
      }
      .filter-orange {
        filter: invert(43%) sepia(89%) saturate(2516%) hue-rotate(1deg)
          brightness(102%) contrast(106%);
      }
    }
    &:hover {
      cursor: pointer;
      color: $orange-200;
      .menu__txt {
        color: $orange-200;
      }
      .filter-orange {
        filter: invert(35%) sepia(86%) saturate(4434%) hue-rotate(5deg)
          brightness(105%) contrast(106%);
      }
    }
    &--logo {
      margin-bottom: 1.2rem;
    }
  }
  &__logo {
    width: 1.8rem;
    height: 1.8rem;
  }
  &__image {
    width: 1.3rem;
    height: 1.3rem;
  }
  &__txt {
    line-height: 1.2rem;
    height: 1.2rem;
    @include grays(color, g-900);
  }
  &__action {
    margin-top: auto;
  }
}
</style>
