<template>
  <form class="form">
    <div class="form__header">
      <img
        class="form__logo"
        src="../assets/images/Logo_small.png"
        alt="logo"
      />
      <slot name="header"></slot>
    </div>
    <div class="form__group">
      <label for="account">帳號</label>
      <input
        type="text"
        id="account"
        name="account"
        :class="['form__input']"
        v-model="account"
        @input="updateLoginInfo"
      />
      <div>
        <!-- todo error message -->
      </div>
    </div>
    <div class="form__group">
      <label for="password">密碼</label>
      <input
        type="password"
        id="password"
        name="password"
        :class="['form__input']"
        v-model="password"
        @input="updateLoginInfo"
      />
      <div>
        <!-- todo error message -->
      </div>
    </div>

    <slot name="button"></slot>
    <div class="form__links">
      <slot name="register"></slot>
      <slot name="login"></slot>
    </div>
  </form>
</template>

<script>
import { mapActions } from "vuex";
import { SET_LOGIN_INFO } from "../store/store-types";
export default {
  name: "LoginForm",
  data() {
    return {
      account: "",
      password: "",
    };
  },

  methods: {
    // need to rename email to account and change vuex rename email to account
    updateLoginInfo() {
      this.setLoginInfo({ account: this.account, password: this.password });
    },
    ...mapActions({
      setLoginInfo: SET_LOGIN_INFO,
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/mixins/_colors.scss";
@import "@/assets/scss/utils/_variables.scss";

.form {
  font-family: var(--ff-primary);
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;
  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-bottom: 2.5rem;
    @include grays(color, g-900);
    font-size: 1.5rem;
    font-weight: var(--fw-bold);
  }
  &__logo {
    width: 3rem;
    height: 3rem;
  }
  &__group,
  &__links {
    width: 540px;
    max-width: 70%;
  }
  &__group {
    margin-bottom: 1.9rem;
    @include grays(color, g-600);
    font-size: 1rem;
    background-color: $gray-50;
    font-weight: var(--fw-normal);
  }
  label {
    font-size: 12px;
    margin: 5px;
  }
  &__group + &__group {
    margin-bottom: 2.7rem;
  }
  &__input {
    width: 100%;
    border: none;
    padding: 5px;
    border-bottom: 1.5px solid $gray-600;
    @include grays(border-color, g-600);
    background-color: $gray-50;
  }

  &__links {
    margin-top: 1.25rem;
    display: flex;
    justify-content: flex-end;
    .link--login {
      @include grays(color, b-1000);
      font-weight: var(--fw-bold);
    }
  }
}

.form__input:focus,
.form__input:hover {
  border-bottom: 1.5px solid $blue-800;
}
</style>
