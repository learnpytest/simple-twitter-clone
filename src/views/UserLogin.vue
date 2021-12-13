<template>
  <div>
    <LoginForm>
      <template v-slot:header> 登入Alphitter </template>
      <template v-slot:register>
        <router-link class="link--login" :to="{ name: 'register' }"
          >註冊 Alphitter <span class="dot">&bull;</span></router-link
        ></template
      >
      <template v-slot:login>
        <router-link class="link--login" :to="{ name: 'admin-login' }"
          >後台登入</router-link
        >
      </template>
      <template v-slot:button
        ><PrimaryButtonLarge
          @click.native.prevent.stop="login"
          :disabled="isProcessing"
          >{{ isProcessing ? "登入中..." : "登入" }}
        </PrimaryButtonLarge>
      </template>
    </LoginForm>
  </div>
</template>

<script>
import LoginForm from "@/components/LoginForm";
import PrimaryButtonLarge from "@/components/Buttons/PrimaryButtonLarge.vue";
import { mapActions, mapGetters } from "vuex";
import { POST_USER_LOGIN, GET_IS_PROCESSING } from "../store/store-types";

export default {
  name: "UserLogin",
  components: {
    LoginForm,
    PrimaryButtonLarge,
  },
  methods: {
    login() {
      this.postUserLogin();
    },
    ...mapActions({
      postUserLogin: POST_USER_LOGIN,
    }),
  },
  computed: {
    ...mapGetters({
      isProcessing: GET_IS_PROCESSING,
    }),
  },
};
</script>
<style lang="scss" scoped>
.dot {
  font-weight: var(--fw-normal);
  width: 0.5rem;
  display: inline-block;
  text-align: center;
  color: var(--b-1000);
}
.link--login {
  color: #0099ff;
}
a {
  color: #0099ff;
}
</style>
