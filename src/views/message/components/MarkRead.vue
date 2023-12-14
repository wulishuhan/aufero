<template>
  <div class="mark-content">
    <span class="active-name">{{ $t(`message.${activeName}`) }}</span>
    <span class="sign-readed" @click="mark"></span>
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line
  name: "MarkRead",
  props: {
    activeName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    mark() {
      this.$emit("markRead");
    },
  },
};
</script>
<style lang="scss" scoped>
.mark-content {
  display: flex;
  justify-content: space-between;
  height: 79px;
  align-items: center;
  border-bottom: 1px solid #e6e6e6;
  .active-name {
    font-size: 20px;
  }
  .sign-readed {
    color: #1e78f0;
    font-size: 16px;
    cursor: pointer;
  }
}
</style>
