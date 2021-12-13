<template>
  <div v-show="isNotificationOpen" class="notification" role="alert">
    <div
      class="notification--inner"
      :class="typeClass"
      @click="removeNotification"
    >
      {{ notification.message }}
      <template>
        <div v-show="isNotificationConfirm">
          <button @click="deleteTweet">確定</button>
          <button @click="cancelDelete">取消</button>
        </div>
      </template>

      <span class="notification__circle">
        <span class="icon"></span>
      </span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import {
  REMOVE_NOTIFICATION,
  GET_NOTIFICATION,
  IS_NOTIFICATION_OPEN,
  IS_NOTIFICATION_CONFIRM,
  DELETE_TWEET,
  CANCEL_DELETE,
} from "../../store/store-types";

export default {
  computed: {
    typeClass() {
      return `notification--${this.notification.type}`;
    },
    ...mapGetters({
      notification: GET_NOTIFICATION,
      isNotificationOpen: IS_NOTIFICATION_OPEN,
      isNotificationConfirm: IS_NOTIFICATION_CONFIRM,
    }),
  },

  methods: mapActions({
    removeNotification: REMOVE_NOTIFICATION,
    deleteTweet: DELETE_TWEET,
    cancelDelete: CANCEL_DELETE,
  }),
};
</script>
<style lang="scss" scoped>
@import "@/assets/scss/main.scss";

.notification {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 15px;
  width: 30%;
  max-width: 394px;
  max-height: 96px;
  height: 6rem;
  display: flex;
  box-shadow: 0px 4px 4px rgba(51, 51, 51, 0.04),
    0px 4px 16px rgba(51, 51, 51, 0.08);
  @include grays(background-color, g-0);
  border-radius: 8px;
  &--inner {
    width: 100%;
    padding: 0 1.2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    @include grays(color, black);
    font-weight: var(--fw-bold);
  }
  &__circle {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    z-index: -1;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .icon {
      width: 1rem;
      height: 0.8rem;
      outline: none;
    }
  }
}

.notification--success {
  .notification__circle {
    background-color: rgba(130, 196, 60, 0.12);
  }

  .icon {
    background-image: url("../../assets/images/icon_notification_success.svg");
  }
}

.notification--error {
  .notification__circle {
    background-color: rgba(252, 90, 90, 0.12);
  }
  .icon {
    background-size: cover;
    background-image: url("../../assets/images/icon_notification_error.svg");
    height: 1rem;
  }
}
</style>
