<template>
  <div class="container">
    <div class="new-tweet-modal" v-if="showModal">
      <NewTweetModal :initialShowModal="showModal" @show-modal="modalToggle" />
    </div>
    <div class="usermain">
      <div class="sidebar">
        <Sidebar :initialShowModal="showModal" @show-modal="modalToggle" />
      </div>
      <div class="main">
        <div class="tweets">
          <AccountForm class="form" :isSettingExistingAccount="true">
            <template v-slot:title>
              <span class="form__txt">帳號設定</span>
            </template>
            <template v-slot:button>
              <div class="to-right">
                <PrimaryButtonSmall
                  class="form__btn"
                  @click.native.prevent.stop="saveUserSetting"
                  >儲存
                </PrimaryButtonSmall>
              </div>
            </template>
          </AccountForm>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Sidebar from "../modules/user/Sidebar.vue";
import AccountForm from "@/components/AccountForm";
import PrimaryButtonSmall from "@/components/Buttons/PrimaryButtonSmall.vue";
import NewTweetModal from "../modules/user/NewTweetModal.vue";
import { mapActions } from "vuex";
import { PUT_ACCOUNT } from "../store/store-types";

export default {
  name: "UserSetting",
  components: {
    AccountForm,
    PrimaryButtonSmall,
    Sidebar,
    NewTweetModal,
  },
  data() {
    return {
      showModal: false,
    };
  },
  methods: {
    saveUserSetting() {
      this.putAccount();
    },
    ...mapActions({
      putAccount: PUT_ACCOUNT,
    }),
    modalToggle() {
      if (!this.showModal) {
        this.showModal = true;
      } else {
        this.showModal = false;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
@import "./src/assets/scss/main.scss";

.new-tweet-modal {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  height: 100%;
}
.usermain {
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  height: 100vh;
  overflow-y: scroll;
}
.container {
  height: 100%;
  overflow: hidden;
}
.sidebar {
  width: 18%;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
}
.main {
  width: 42%;
  height: 100%;
  margin: 0 30px;
  margin-right: calc(25% + 30px);
  border-left: 1px solid $gray-75;
}
.form {
  max-width: 642px;

  margin: 0;
  &__txt {
    @include grays(color, g-900);
    font-weight: var(--fw-bold);
  }
  &__group {
    width: 642px;
  }
}

.to-right {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
