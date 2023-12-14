<template>
  <div>
    <div class="remix-link-box">
      <!-- Remixes 的总数 -->
      <!-- <div
        style="
          font-size: 20px;
          
          font-weight: 400;
          color: #1a1a1a;
        "
      >
        Remixes {{ remixes.length }}
      </div> -->
      <a class="more-font post-remix" @click="toUpload">
        <i class="el-icon-plus"></i>
        {{ $t("thing.Post a Remix") }}
      </a>
      <a class="view-more" @click="dialogRemixes = true">
        {{ $t("thing.View all") }}
      </a>
    </div>

    <el-row>
      <el-col :span="8" v-for="item in remixes" :key="item.id">
        <el-image
          class="more-image"
          :src="item.image"
          @click="toRemix(item.id)"
        >
        </el-image>
        <div class="card-box-bottom-left-name">
          <el-tooltip
            effect="light"
            placement="bottom-start"
            :open-delay="1000"
            :visible-arrow="false"
          >
            <div slot="content">{{ item.title }}</div>
            <div class="item-title" @click="viewAuthorInfo(item.id)">
              {{ item.title }}
            </div>
          </el-tooltip>
          <div
            style="display: flex; margin: 11px 0"
            @click="viewCreatorInfo(item.creator.id)"
          >
            <img class="img" :src="avatar(item)" />
            <el-tooltip
              effect="light"
              placement="bottom-start"
              :open-delay="1000"
              :visible-arrow="false"
            >
              <div slot="content">
                {{ item.creator && item.creator.name }}
              </div>
              <span class="author">
                {{ item.creator && item.creator.name }}
              </span>
            </el-tooltip>
          </div>
        </div>
      </el-col>
    </el-row>

    <el-dialog :visible.sync="dialogRemixes" width="1136px">
      <!-- Remixes 的总数 -->
      <div
        style="
          font-size: 20px;

          font-weight: 400;
          color: #1a1a1a;
        "
      >
        Remixes • {{ remixes.length }}
      </div>
      <el-tabs class="more-dialog" v-model="viewMoreActive" :stretch="true">
        <el-tab-pane label="Remixes" name="Remixes">
          <view-more
            v-if="viewMoreActive === 'Remixes'"
            :isRemixes="true"
          ></view-more>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>
<script>
import ViewMore from "../ViewMore.vue";
import { getResourceListById } from "@/api/resource";
import { generatorDefaultAvator } from "@/utils/generateImage";
export default {
  components: {
    ViewMore,
  },
  mounted() {
    this.getResourceList();
  },
  data() {
    return {
      dialogRemixes: false,
      viewMoreActive: "Remixes",
      remixes: [],
      creator: {
        avatar: "",
      },
    };
  },
  methods: {
    avatar(item) {
      return item.creator.avatar
        ? item.creator.avatar
        : generatorDefaultAvator(item.creator.name, item.creator.id);
    },
    viewAuthorInfo(id) {
      this.$router.push(`/thing/${id}`);
    },
    viewCreatorInfo(id) {
      this.$router.push(`/design/${id}`);
    },
    toUpload() {
      if (!this.$store.getters.isLogin) {
        this.showLoginDialog();
        return;
      }
      this.$router.push(`/upload?refId=${this.$route.params.thingId}`);
    },
    showLoginDialog() {
      let payload = { loginDialogVisible: true, isLoginForm: true };
      this.$store.dispatch("user/switchLoginRegisteForm", payload);
    },
    getResourceList() {
      let parameters = {
        pageSize: 6,
        pageNum: 1,
        type: "remix",
        resId: this.$route.params.thingId,
      };
      getResourceListById(parameters)
        .then((res) => {
          this.remixes = res.data.rows;
          console.log(this.remixes, 131);
        })
        .catch(() => {
          this.loading = false;
          this.noMore = true;
        });
    },
    toRemix(id) {
      this.$router.push(`/thing/${id}`);
    },
  },
};
</script>
<style scoped lang="scss">
.remix-link-box {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
}
.more-font {
  font-size: 20px;
  color: #1a1a1a;
  font-weight: 400;
}
.post-remix {
  cursor: pointer;
}
.more-image {
  width: 184px;
  height: 138px;
  margin-top: 5px;
  cursor: pointer;
}
.more-dialog {
  ::v-deep .el-tabs__header .is-top {
    width: 520px;
  }
}
.img {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
}
.view-more {
  font-size: 16px;
  cursor: pointer;
  color: #1e78f0;
}
.card-box-bottom-left-name {
  position: relative;
  top: -3px;
  background: #ffffff;
  width: 184px;
  padding-left: 5px;
  border-radius: 0px 0px 10px 10px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}
.author {
  padding-top: 2px;
  margin-left: 8px;
  color: #5c5959;
  border-bottom: solid 1px #f0f3fa;
  font-size: 12px;

  font-weight: 400;
  color: #999999;
  width: 81px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.author:hover {
  border-bottom: solid 1px #000;
  color: #000;
  cursor: pointer;
}
.item-title {
  font-size: 14px;

  font-weight: 400;
  color: #1a1a1a;
  width: 81px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
</style>
