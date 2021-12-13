<template>
  <form class="form">
    <div class="form__title">
      <slot name="title"></slot>
    </div>
    <div class="form__header">
      <slot name="logo"> </slot>
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
        maxlength="20"
        @input="updateAccountInfo"
      />

      <div class="limit-error">
        <!-- todo error message -->
        <span class="warning-text" v-if="account.length >= 20"
          >帳號字數不可超過 20 字</span
        >
        <p>{{ accountCharactersLeft }}</p>
      </div>
    </div>
    <div class="form__group">
      <label for="username">名稱</label>
      <input
        type="text"
        id="username"
        name="username"
        :class="['form__input']"
        maxlength="50"
        v-model="username"
        @input="updateAccountInfo"
      />
      <div class="limit-error">
        <!-- todo error message -->
        <span class="warning-text" v-if="username.length >= 51"
          >名稱字數不可超過 50 字</span
        >
        <p>{{ nameCharactersLeft }}</p>
      </div>
    </div>
    <div class="form__group">
      <label for="email">Email</label>
      <input
        type="email"
        id="email"
        name="email"
        :class="['form__input']"
        v-model="email"
        @input="updateAccountInfo"
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
        @input="updateAccountInfo"
      />
      <div>
        <!-- todo error message -->
      </div>
    </div>
    <div class="form__group">
      <label for="checkPassword">確認密碼</label>
      <input
        type="password"
        id="checkPassword"
        name="checkPassword"
        :class="['form__input']"
        v-model="checkPassword"
        @input="updateAccountInfo"
      />
      <div>
        <!-- todo error message -->
      </div>
    </div>
    <slot name="button"></slot>
    <div class="form__links">
      <slot name="cancel"></slot>
    </div>
  </form>
</template>

<script>
import { SET_ACCOUNT_INFO } from "../store/store-types";
import { mapActions } from "vuex";

import currentUserAPI from "@/apis/currentUserAPI";

export default {
  name: "AccountForm",
  props: {
    isSettingExistingAccount: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      account: "",
      username: "",
      email: "",
      password: "",
      checkPassword: "",
    };
  },
  created() {
    // this.account = this.isSettingExistingAccount
    //   ? this.getCurrentUser.account
    //   : "";
    // this.username = this.isSettingExistingAccount
    //   ? this.getCurrentUser.name
    //   : "";
    // this.email = this.isSettingExistingAccount ? this.getCurrentUser.email : "";
    this.fetchData();
  },
  methods: {
    async fetchData() {
      try {
        const res = await currentUserAPI.getCurrentUser();
        const { data, statusText } = res;
        if (statusText !== "OK") {
          throw new Error(statusText);
        }
        this.currentUser = data;
        this.account = this.isSettingExistingAccount
          ? this.currentUser.account
          : "";
        this.username = this.isSettingExistingAccount
          ? this.currentUser.name
          : "";
        this.email = this.isSettingExistingAccount
          ? this.currentUser.email
          : "";
      } catch (err) {
        console.log(err);
      }
    },
    updateAccountInfo() {
      this.setAccountInfo({
        account: this.account,
        username: this.username,
        email: this.email,
        password: this.password,
        checkPassword: this.checkPassword,
      });
    },
    ...mapActions({
      setAccountInfo: SET_ACCOUNT_INFO,
    }),
  },
  computed: {
    // ...mapGetters({
    //   getCurrentUser: GET_CURRENT_USER,
    // }),
    nameCharactersLeft() {
      let char = this.username.length,
        limit = 50;

      return limit - char + " / " + limit;
    },
    accountCharactersLeft() {
      let char = this.account.length,
        limit = 20;

      return limit - char + " / " + limit;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/mixins/_colors.scss";
@import "@/assets/scss/utils/_variables.scss";

.form {
  font-family: var(--ff-primary);
  margin: 0 auto;
  max-width: 540px;
  // width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 4rem;

  &__title {
    width: 100%;
    padding: 0.8rem 0 0 0;
    padding: 10px;
  }
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

  &__group {
    // width: 540px;
    // max-width: 70%;
    width: 100%;
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
  &__btn {
    margin-bottom: 1.3rem;
  }
  &__links {
    display: flex;
    justify-content: flex-end;
    padding-bottom: 5rem;
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
.limit-error {
  text-align: right;
  background-color: $white;
  color: $gray-600;
  padding: 5px;
  font-size: 13px;
  p {
    display: inline-block;
  }
  .warning-text {
    display: inline-block;
    color: $red;
    margin-right: 10px;
  }
}
</style>
