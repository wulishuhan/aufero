<template>
  <div class="pagination">
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize"
      :layout="layout"
      :total="total"
      :small="isSmall"
    >
    </el-pagination>
  </div>
</template>
<script>
import { throttle } from "@/utils/cache.js";
export default {
  name: "Pagination",
  props: {},
  created() {
    this.changePagination();
    this.formatWidth = throttle(() => {
      this.changePagination();
    }, 400);
    window.addEventListener("resize", this.formatWidth);
    this.getData();
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.formatWidth);
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      layout: "total, sizes, prev, pager, next, jumper",
      isSmall: false,
      total: 50,
      formatWidth: () => {},
    };
  },
  methods: {
    changePagination() {
      let clientWidth = document.body.clientWidth;
      console.log("pagination:", clientWidth);
      if (clientWidth <= 768) {
        this.layout = "prev, pager, next";
        this.isSmall = true;
      } else {
        this.layout = "total, sizes, prev, pager, next, jumper";
        this.isSmall = false;
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    getData() {
      this.$emit("getData", {
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  width: 100%;
}
</style>
