<template>
  <button class="button button--large">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "PrimaryButtonLarge",
};
</script>

<style lang="scss" scoped>
@import "@/assets/scss/utils/_variables.scss";
.button--large {
  width: 540px;
  max-width: 70%;
  font-family: var(--ff-primary);
}
.button {
  border: 1px solid var(--primary);
  line-height: 1rem;
  background: var(--primary);
  height: fit-content;
  font-size: 1rem;
  padding: 0.65rem 1rem;
  border-radius: 100px;
  font-weight: 700;
  color: white;
  &:hover {
    cursor: pointer;
    background: var(--button-hover-color);
  }
  &:focus {
    outline: 2px solid var(--button-focus-outline-color);
  }
}
</style>
