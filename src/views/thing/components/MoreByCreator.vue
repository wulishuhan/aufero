<template>
  <div v-show="moreList.length > 0">
    <div class="more-by-creator-container">
      <h2 class="more-font">{{ $t("thing.More by this creator") }}</h2>
      <a class="view-more" @click="openViewAllDialog('view-creator')">
        {{ $t("thing.View all") }}
      </a>
    </div>
    <div class="more-image-box">
      <el-image
        v-for="item in list"
        :key="item.id"
        class="more-image"
        :src="item.image"
        @click="toMore(item.id)"
        fit="contain"
      ></el-image>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    moreList: {
      type: Array,
      default: () => {
        return [];
      },
      required: true,
    },
  },
  computed: {
    list() {
      return this.moreList;
    },
  },
  methods: {
    openViewAllDialog(name) {
      this.$emit("openViewAllDialog", name);
    },
    toMore(id) {
      this.$router.push(`/thing/${id}`);
    },
  },
};
</script>
<style scoped lang="scss">
.more-by-creator-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 42px;

  .more-font {
    font-size: 20px;
    color: #1a1a1a;
    font-weight: 400;
  }
  .view-more {
    font-size: 16px;
    cursor: pointer;
    color: #1e78f0;
  }
}
.more-image-box {
  margin-top: 31px;
  display: grid;
  grid-template-columns: repeat(3, 184px);
  justify-content: space-between;
}
.more-image {
  width: 184px;
  height: 138px;
  margin-top: 5px;
  border-radius: 4px;
  cursor: pointer;
  background: #e8ebf4;
}
</style>
