<template>
  <span>
    <el-button
      :style="{ color: isStar ? 'red' : 'black' }"
      class="baseButton button"
      :disabled="disabled"
      @click="click"
    >
      <svg-icon
        v-show="!isStar"
        icon-class="213喜欢-线性"
        class-name="icon-213喜欢-线性"
      ></svg-icon>
      <svg-icon
        v-show="isStar"
        icon-class="已喜欢"
        class-name="icon-已喜欢"
      ></svg-icon>
      <!-- <i :class="isStar ? 'el-icon-star-on' : 'el-icon-star-off'"></i> -->
      <span class="num">{{ numText }}</span>
    </el-button>
  </span>
</template>

<script>
export default {
  methods: {
    click() {
      this.$emit("click");
    },
  },
  props: {
    starNum: {
      type: Number,
      default: 0,
    },
    isStar: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    numText() {
      let numText = "";
      if (this.starNum < 0) {
        numText = "0";
      } else if (this.starNum < 1000) {
        numText = "" + this.starNum;
      } else {
        numText = Math.floor(this.starNum / 1000) + "k";
      }
      return numText;
    },
  },
};
</script>

<style></style>
<style lang="scss" scoped>
.button {
  width: 96px;
  height: 48px;
  /* margin-left: 24px; */
  .num {
    color: #000;
    font-size: 16px;
    margin-left: 15px;
  }
  i {
    font-size: 20px;
  }
}
</style>
