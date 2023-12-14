<template>
  <div class="designer-container">
    <div class="content">
      <el-row class="designer-filter-container">
        <el-col :span="8" class="designer-filter-item">
          <el-select v-model="value" placeholder="Number of Followers">
            <el-option
              v-for="item in filters"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8"></el-col>
        <el-col :span="8">
          <!-- <el-select v-model="value" placeholder="Filter By">
            <el-option
              v-for="item in filters"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        </el-col>
      </el-row>
      <el-row>
        <div v-for="item in user" :key="item.id">
          <el-col :xs="24" :sm="12" :md="8" :lg="6" :xl="4">
            <designer-card :designer="item"></designer-card>
          </el-col>
        </div>
      </el-row>
      <pagination ref="designerPagination" @getData="getDesigners"></pagination>
    </div>
  </div>
</template>
<script>
import { getDesignerList } from "@/api/designer";
import DesignerCard from "./components/DesignerCard";
import Pagination from "@/components/Pagination";
export default {
  // eslint-disable-next-line
  name: "Designer",
  components: { DesignerCard, Pagination },
  data() {
    return {
      pagination: {
        total: 100,
        pageSize: 10,
        currentPage: 1,
      },
      filters: [
        {
          value: "followers",
          label: "Number of Followers",
        },
        {
          value: "designs",
          label: "Number of Designs",
        },
        {
          value: "makes",
          label: "Number of Makes",
        },
      ],
      value: "",
      user: {},
    };
  },
  mounted() {
    getDesignerList(this.pagination).then((res) => {
      this.user = res.data.data;
      this.$refs.designerPagination.total = res.data.length;
    });
  },
  methods: {
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.getUserLists();
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.getDesignerLists();
    },
    getDesigners(pagination) {
      getDesignerList(pagination).then((res) => {
        this.pagination.total = res.data.length;
        this.$refs.designerPagination.total = res.data.length;
        this.user = res.data.data;
      });
    },
  },
};
</script>
<style scoped>
.designer-container {
  background-color: #f2f2f2;
  text-align: center;
}
.content {
  width: 90%;
  margin: 0 auto;
}
@media screen and (max-width: 768px) {
  .content {
    width: 100%;
  }
}
</style>
