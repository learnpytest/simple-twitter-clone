<template>
  <div class="tweet">
    <div class="tweet__img">
      <img class="tweet__avatar" :src="tweet.User.avatar | emptyImage" alt="" />
    </div>
    <div class="tweet__txt">
      <div class="tweet__control">
        <div class="tweet__info">
          <div class="tweet__username">{{ tweet.User.name }}</div>
          <div class="tweet__account">
            @{{ tweet.User.account }}<span class="dot">&bull;</span>
          </div>
          <div class="tweet__created">{{ tweet.CreatedAt | fromNow }}</div>
        </div>
        <div class="tweet__delete" @click="verifyDeleteTweet(tweet.TweetId)">
          <img
            class="filter-orange"
            src="@/assets/images/icon_close_gray.svg"
            alt="delete tweet button"
          />
        </div>
      </div>
      <div class="tweet__content">
        {{ tweet.description }}
      </div>
    </div>
  </div>
</template>

<script>
import { mixinFromNowFilters, mixinEmptyImage } from "../../utils/mixin";
import { mapActions } from "vuex";
import { VERIFY_DELETE_TWEET } from "../../store/store-types";

export default {
  name: "AdminTweet",
  props: ["tweet"],
  mixins: [mixinFromNowFilters, mixinEmptyImage],
  methods: {
    ...mapActions({
      verifyDeleteTweet: VERIFY_DELETE_TWEET,
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/mixins/_colors.scss";
@import "@/assets/scss/utils/_variables.scss";

.tweet {
  display: flex;
  width: 100%;
  padding: 0.5rem;
  border-bottom: 1px solid $gray-75;
  align-items: center;
  &__img {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    margin-right: 10px;
    // margin-top: 0.3rem;
    border-radius: 50%;
    overflow: hidden;
  }
  &__txt {
    flex: 1;
  }
  &__control,
  &__info {
    display: flex;
  }
  &__info {
    align-items: flex-end;
  }
  &__control {
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  &__delete {
    width: 1.5rem;
    height: 1.5rem;
    &:hover {
      .filter-orange {
        filter: invert(35%) sepia(86%) saturate(4434%) hue-rotate(5deg)
          brightness(105%) contrast(106%);
      }
    }
  }

  &__content {
    line-height: 1.5;
    font-weight: var(--fw-normal);
    @include grays(color, g-900);
    // todo leave only 50 words
    overflow: hidden;
    width: 45%;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &__username {
    font-weight: var(--fw-bold);
    margin-right: 0.5rem;
    @include grays(color, g-900);
  }
  &__account,
  &__created {
    font-size: 0.9rem;
    font-weight: var(--fw-normal);
    @include grays(color, g-600);
    .dot {
      margin: 0 0.3em;
    }
  }
  &__delete {
    cursor: pointer;
  }
}
</style>
