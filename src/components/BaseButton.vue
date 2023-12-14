<template>
  <el-button @click="click" class="baseButton">
    <slot></slot>
  </el-button>
</template>

<script>
export default {
  props: {},
  methods: {
    click() {
      this.$emit("click");
    },
  },
};
</script>

<style></style>
<style lang="scss" scoped></style>
