<template>
  <div class="container post">
    <div class="post-wrapper">
      <h3 style="text-align: center">{{ $t("community.Start Post") }}</h3>
      <el-form :model="resourceForm">
        <el-form-item>
          <el-input
            type="textarea"
            :rows="8"
            placeholder="请输入内容"
            v-model="textarea"
          >
          </el-input>
        </el-form-item>

        <el-form-item>
          <div class="label">
            {{ $t("community.Photos") }}
            <span style="font-size: 12px; color: #999">
              {{ $t("community.supported") }}
            </span>
          </div>

          <draggable-swiper
            v-model="resourceForm.images"
            swiper-name="coverSwiper"
            :on-add-success="onCoverAddSuccess"
            :on-edit-success="onCoverEditSuccess"
            :remove="handleRemoveCover"
            :currentKeyList.sync="currentEditKeyList"
            ref="draggableSwiper"
          ></draggable-swiper>
        </el-form-item>

        <el-form-item>
          <div class="label">{{ $t("community.Related Resources") }}</div>
          <div class="resource" v-if="selectRes">
            <div class="resource-box">
              <div class="resource-info">
                <el-image
                  class="resource-image"
                  :src="selectRes.image"
                  fit="contain"
                ></el-image>
                <div class="info">
                  <div class="title">{{ selectRes.title }}</div>
                  <div class="username">
                    <el-avatar
                      :size="20"
                      :src="selectRes.creator.avatar"
                    ></el-avatar>
                    <span>{{ selectRes.creator.name }}</span>
                  </div>
                </div>
              </div>
              <el-button
                @click="
                  () => {
                    selectRes = null;
                  }
                "
                >删除
              </el-button>
            </div>
          </div>
          <div class="related-resource" @click="dialogVisible = true">
            <i class="el-icon-plus"></i>
          </div>
          <el-input
            v-model="keywords"
            @keyup.enter.native="search"
            v-show="false"
          >
          </el-input>
          <el-dialog
            :visible.sync="dialogVisible"
            @before-close="handleClose"
            @open="openDialog"
          >
            <div
              id="search-container"
              style="height: 300px; overflow-y: auto"
              @scroll="handleScroll"
            >
              <div slot="title" class="dialog-title">
                <span>{{ $t("community.Related Resources") }}</span>
                <div class="resource-search">
                  <el-input
                    :placeholder="$t('community.Search item')"
                    prefix-icon="el-icon-search"
                    v-model="keywords"
                    class="el-input-search input-with-select"
                    clearable
                    @keyup.enter.native="search()"
                  >
                  </el-input>
                </div>
              </div>

              <!-- 搜索结果 -->
              <div
                class="search-resource-box"
                :class="[selectRes && item.id == selectRes.id ? 'select' : '']"
                v-for="item in resList"
                @click="selectResource(item)"
                :key="item.id"
              >
                <div class="resource-info">
                  <el-image
                    :src="item.image"
                    class="resource-image"
                    fit="contain"
                  ></el-image>
                  <div class="info">
                    <div class="title">{{ item.title }}</div>
                    <div class="username">
                      <el-avatar
                        :size="20"
                        :src="item.creator.avatar"
                      ></el-avatar>
                      <span>{{ item.creator.name }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="loading" class="loading">Loading...</div>
              <!-- <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">
                  {{ $t("community.Submit") }}
                </el-button>
              </span> -->
            </div>
          </el-dialog>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addCommunity">
            {{ $t("community.Submit") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import draggableSwiper from "@/views/community/DraggableSwiper";
import { getResourceList } from "@/api/resource";
import { addCommunity } from "@/api/community";
import { generatorDefaultAvator } from "@/utils/generateImage";
export default {
  data() {
    return {
      keywords: "",
      textarea: "",
      dialogVisible: false,
      resourceForm: {
        images: [],
        files: [],
        refResource: null,
      },
      currentEditKeyList: [0, 0],
      resList: [],
      selectRes: null,
      loading: false,
      pageNum: 1,
      pageSize: 5,
      total: 0,
    };
  },
  components: { draggableSwiper },
  methods: {
    handleScroll() {
      const container = document.querySelector("#search-container");
      if (
        container.scrollTop + container.clientHeight >=
          container.scrollHeight - 2 &&
        !this.loading
      ) {
        this.pageNum++;
        if (this.total > 0 && this.pageNum * this.pageSize >= this.total)
          return;
        this.search(false);
      }
    },
    openDialog() {
      this.search();
    },
    addCommunity() {
      addCommunity({
        content: this.textarea,
        resourceId: this.selectRes.id,
        images: this.resourceForm.images,
      })
        .then((res) => {
          console.log("addcommunity", res);
          this.$message.success(this.$t("community.Post success"));
          this.reset();
        })
        .catch((err) => {
          console.log(err);
          this.$message.err(this.$t("community.Post fail"));
          this.reset();
        });
    },
    selectResource(item) {
      this.selectRes = item;
      this.dialogVisible = false;
    },
    reset() {
      this.textarea = "";
      this.resList = [];
      this.selectRes = null;
      this.$refs["draggableSwiper"].itemList = [];
      this.resourceForm = { images: [], files: [], refResource: null };
    },
    search(isSearch = true) {
      if (isSearch) {
        this.pageNum = 1;
        this.pageSize = 5;
        this.resList = [];
      }
      this.loading = true;
      getResourceList({
        keywords: this.keywords,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
      }).then((res) => {
        this.loading = false;
        this.total = res.data.total;
        const addList = res.data.rows.map((item) => {
          item.creator.avatar =
            item.creator.avatar == ""
              ? generatorDefaultAvator(item.creator.name)
              : item.creator.avatar;
          return item;
        });
        this.resList.push(...addList);
      });
    },
    handleClose() {
      this.pageNum = 1;
      this.pageSize = 5;
      this.keywords = "";
      this.total = 0;
      this.resList = [];
      this.dialogVisible = false;
    },
    handleRemoveCover(removeKey) {
      this.resourceForm.images.splice(removeKey, 1);
    },
    onCoverAddSuccess(response) {
      let imgInfo = {
        id: response.id,
        url: response.url,
        name: response.name,
        size: response.size,
        thumbnail: response.thumbnail,
      };
      this.resourceForm.images.push(imgInfo);
      // this.$refs["resourceForm"].validateField("images");
    },
    onCoverEditSuccess(response) {
      let imgInfo = {
        id: response.id,
        url: response.url,
        name: response.name,
        size: response.size,
        thumbnail: response.thumbnail,
      };
      this.resourceForm.images.splice(this.currentEditKeyList[0], 1, imgInfo);
    },
  },
};
</script>
<style lang="scss" scoped>
.post-wrapper {
  width: 1100px;
  margin: 0 auto;
  h3 {
    margin: 32px 0;
  }

  .el-textarea {
    color: #333;
    font-size: 14px;
  }
  .label {
    color: #1a1a1a;
  }

  .related-resource {
    cursor: pointer;
    width: 184px;
    height: 112px;
    border: 1px solid #cccccc;
    border-radius: 6px;
    font-size: 34px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    margin-left: 16px;
  }

  .resource {
    background: #e8ebf4;
    padding: 16px;
    border-radius: 6px;
  }
  .resource-image {
    width: 56px;
    height: 80px;
  }
  .loading {
    text-align: center;
  }
  .resource-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    padding: 12px 24px;
    border-radius: 8px;
    .resource-info {
      display: flex;

      .info {
        margin-left: 12px;
        display: flex;
        flex-direction: column;
        .username {
          display: flex;
          align-items: center;
          .el-avatar {
            margin-right: 12px;
          }
        }
      }
    }
  }
  .select {
    border: solid 1px #000;
  }
  .search-resource-box {
    display: flex;
    background-color: #f5f5f5;
    border-radius: 8px;
    padding: 4px 12px;
    cursor: pointer;
    .resource-info {
      display: flex;
      .info {
        margin-left: 12px;
        display: flex;
        flex-direction: column;
        .username {
          display: flex;
          align-items: center;
          .el-avatar {
            margin-right: 12px;
          }
        }
      }
    }
  }

  .search-resource-box + .search-resource-box {
    margin-top: 20px;
  }

  ::v-deep .el-dialog {
    border-radius: 12px;
    width: 628px;
  }

  .dialog-title {
    display: flex;
  }
  .resource-search {
    margin-left: 80px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    .el-input-search {
      width: 240px;

      ::v-deep .el-input__inner {
        font-size: 14px;
        height: 36px;
        border-radius: 6px;
        background: #ffffff;
        border: 1px solid #999999;
      }
    }

    .el-select-search {
      max-width: 120px;
      ::v-deep .el-input__inner {
        border: 1px solid #999 !important;
        border-left: transparent !important;
        border-radius: 0px 6px 6px 0px;
        margin-left: -1px;
        background: none;
      }
    }
    .input-with-select .el-input-group__prepend {
      background-color: #fff;
    }
  }
}
</style>
