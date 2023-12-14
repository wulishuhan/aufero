<template>
  <el-select v-model="license" placeholder="Select license" style="width: 100%">
    <el-option
      v-for="(licenseItem, licenseKey) in config.licenseSelectList"
      :label="licenseItem.label"
      :value="licenseItem.value"
      :key="licenseKey"
    ></el-option>
  </el-select>
</template>

<script>
import { mapState } from "vuex";
export default {
  model: {
    prop: "data",
    // 随便命名事件，对应下面$emit即可
    event: "changeData",
  },
  data() {
    return {
      license: "",
    };
  },
  computed: {
    ...mapState({
      config: (state) => state.user.config,
    }),
  },
  mounted() {
    this.license = this.data;
  },
  watch: {
    license: function (val) {
      this.$emit("changeData", val);
    },
    data: function (val) {
      this.license = val;
    },
  },
  props: {
    data: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
.el-select-dropdown {
  .el-scrollbar {
    .el-select-dropdown__wrap {
      .el-select-dropdown__item.selected {
        background: #8ab5ef !important;
        color: #fff !important;
      }
      .el-select-dropdown__item.hover {
        background: #8ab5ef !important;
        color: #fff !important;
      }
    }
  }
}
</style>
