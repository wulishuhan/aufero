<template>
  <div @mouseover="enterFollowing" @mouseleave="leaveFollowing">
    <el-button
      type="primary"
      @click="changeFollowState"
      :class="{ white: isFollow }"
    >
      {{ followText }}
    </el-button>
  </div>
</template>
<script>
import { follow, unFollow } from "@/api/design";
export default {
  name: "FollowButton",
  props: {
    userId: [String, Number],
    follow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      isEnterFollowingBox: false,
      isFollow: false,
    };
  },
  watch: {
    follow: function () {
      this.isFollow = this.follow;
    },
  },
  mounted() {
    this.isFollow = this.follow;
  },
  computed: {
    followText() {
      return this.isFollow
        ? this.isEnterFollowingBox
          ? this.$t("design.unFollow")
          : this.$t("design.myFollowing")
        : this.$t("design.follow");
    },
  },
  methods: {
    changeFollowState() {
      if (!this.isFollow) {
        follow({ userId: this.userId }).then(() => {
          this.isFollow = !this.isFollow;
          this.$message({
            type: "success",
            message: this.$t("design.followSuccess"),
          });
        });
      } else {
        unFollow({ userId: this.userId }).then(() => {
          this.isFollow = !this.isFollow;
          this.$message({
            type: "success",
            message: this.$t("design.unFollowSuccess"),
          });
        });
      }
      this.$emit("listenFollowButtonEvent");
    },
    enterFollowing() {
      if (this.isFollow) this.isEnterFollowingBox = true;
    },
    leaveFollowing() {
      if (this.isFollow) this.isEnterFollowingBox = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.white {
  background-color: #fff;
  color: #000;
  width: 102px;
}
.el-button--primary {
  width: 102px;
}
</style>
