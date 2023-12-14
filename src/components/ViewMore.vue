<template>
  <div class="more-container" ref="more-container">
    <el-row class="row">
      <div v-for="item in resources" :key="item.thingId">
        <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
          <resource-card :thing="item"></resource-card>
        </el-col>
      </div>
    </el-row>
    <p v-if="loading">loading...</p>
    <p v-if="noMore">no more</p>
  </div>
</template>
<script>
import ResourceCard from "@/components/ResourceCard";
import { throttle } from "@/utils/cache.js";
import { getThingList } from "@/api/thing";
export default {
  name: "ViewMore",
  components: { ResourceCard },
  data() {
    return {
      pagination: {
        pageSize: 10,
        currentPage: 1,
      },
      load: () => {},
      resources: [],
      loading: false,
      resourcesTotal: 0,
      noMore: false,
    };
  },
  mounted() {
    getThingList(this.pagination).then((res) => {
      this.resources.push(...res.data.data);
    });
    let container = this.$refs["more-container"];
    this.load = throttle(() => {
      // 距离底部200px时加载一次
      let bottomOfWindow =
        container.scrollHeight - container.offsetHeight - container.scrollTop <=
        100;
      if (bottomOfWindow && !this.loading && !this.noMore) {
        this.pagination.currentPage++;
        getThingList(this.pagination)
          .then((res) => {
            this.resources.push(...res.data.data);
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
            this.noMore = true;
          });
      }
    }, 1000);
    container.addEventListener("scroll", this.load);
  },
  beforeDestroy() {
    this.$refs["more-container"].removeEventListener("scroll", this.load);
  },
};
</script>
<style lang="scss" scoped>
.more-container {
  overflow-y: auto;
  height: 672px;
}
</style>
