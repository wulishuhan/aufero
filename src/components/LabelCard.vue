<template>
  <div v-show="LabelArr.length > 0">
    <div class="tag">{{ $t("thing.Tags") }}</div>
    <div class="labelCard">
      <BaseButton
        class="button"
        @click="onBaseButtonClick(tag)"
        v-for="(tag, index) in LabelArr"
        :key="index"
      >
        {{ tag }}
      </BaseButton>
    </div>
  </div>
</template>

<script>
import BaseButton from "./BaseButton.vue";
export default {
  props: {
    LabelArr: {
      type: Array,
      default: () => {
        return ["标签一", "标签二", "标签三", "标签四"];
      },
    },
  },
  components: {
    BaseButton,
  },
  methods: {
    // eslint-disable-next-line
    onBaseButtonClick(tag) {
      this.$router.push("/search?w=" + tag);
    },
  },
};
</script>

<style></style>
<style lang="scss" scoped>
.tag {
  font-size: 20px;

  font-weight: 400;
  color: #1a1a1a;
}
.labelCard {
  display: flex;
  flex-wrap: wrap;
  .button {
    margin-right: 24px;
    margin-top: 16px;
    font-size: 20px;

    font-weight: 400;
    color: #999999;
    margin-left: unset;
    /* width: 120px; */
    height: 48px;
  }
}
</style>
