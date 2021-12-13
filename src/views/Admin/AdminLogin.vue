<template>
  <LoginForm>
    <template v-slot:header> 後台登入 </template>
    <template v-slot:login>
      <router-link class="link--login" :to="{ name: 'user-login' }"
        >前台登入</router-link
      >
    </template>
    <template v-slot:button
      ><PrimaryButtonLarge @click.native.prevent.stop="login"
        >登入
      </PrimaryButtonLarge>
    </template>
  </LoginForm>
</template>

<script>
import LoginForm from "@/components/LoginForm";
import PrimaryButtonLarge from "@/components/Buttons/PrimaryButtonLarge.vue";
import { mapActions } from "vuex";
import { POST_LOGIN } from "@/store/store-types";

export default {
  name: "AdminLogin",
  components: {
    LoginForm,
    PrimaryButtonLarge,
  },
  methods: {
    login() {
      this.postLogin();
    },
    ...mapActions({
      postLogin: POST_LOGIN,
    }),
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/utils/mixins/_colors.scss";
@import "@/assets/scss/utils/_variables.scss";

.link--login {
  color: #0099ff;
}
a {
  color: #0099ff;
}
</style>
