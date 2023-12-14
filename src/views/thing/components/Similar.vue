<template>
  <div v-show="similars.length > 0">
    <div class="similar-container">
      <h2 class="more-font">{{ $t("thing.Similar with this") }}</h2>
      <a class="view-more" @click="openViewAllDialog('view-similar')">
        {{ $t("thing.View all") }}
      </a>
    </div>
    <div class="more-image-box">
      <el-image
        v-for="item in similars"
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
import { getSimilar } from "@/api/resource";
export default {
  data() {
    return {
      similars: [],
    };
  },
  mounted() {
    getSimilar({
      pageSize: 3,
      pageNum: 1,
      resId: this.$route.params.thingId,
    }).then((res) => {
      this.similars = res.data.rows;
      console.log("similars: ", res);
    });
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
.similar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 35px;

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
  background: #e8ebf4;
  cursor: pointer;
}
</style>
