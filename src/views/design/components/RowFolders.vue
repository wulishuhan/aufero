<template>
  <div class="container" id="container">
    <div id="folderWrapper" class="folderWrapper">
      <div
        class="folderContainer"
        v-for="(item, index) in folders"
        @mouseenter="handleFolderMouseEnter"
        :key="item.id"
        @click="handleClickFolder(item, index)"
      >
        <div style="text-align: right; height: 25px">
          <!-- 修改默认收藏夹名称 -->
          <!-- <span
            v-show="isYourAccount && item.id !== '0'"
            @click.stop="handleClickMore(item)"
            class="moreMenuIcon"
            id="moreMenuIcon"
          >
            <div class="moreMenu" v-if="item.showMoreMenu">
              <div
                class="moreMenuItem"
                @click.stop="handleRenameClick(item, index)"
              >
                {{ $t("design.Rename") }}
              </div>
            </div>
            ···
          </span> -->
        </div>
        <div class="folder">
          <div class="imgArr">
            <template v-if="item && item.length > 0">
              <div
                class="imgArrItem"
                v-for="subItem in item.slice(0, 4)"
                :key="subItem.index"
              >
                <img :src="subItem.image" alt="" />
              </div>
            </template>
            <div class="noImgItem" v-else>
              <div class="noImg">{{ $t("design.emptyCollection") }}</div>
            </div>
          </div>
          <el-tooltip
            effect="light"
            placement="bottom-start"
            :open-delay="1000"
            :visible-arrow="false"
          >
            <div slot="content">Liked resources</div>
            <div class="title" @click="handleEdit(item)">
              <svg-icon
                class="svgicon"
                icon-class="收藏夹2"
                class-name="icon-收藏夹2"
              ></svg-icon>
              Liked resources
            </div>
          </el-tooltip>
          <div class="title">
            <svg-icon
              class="svgicon"
              icon-class="u580"
              class-name="icon-u580"
            ></svg-icon>
            {{ item ? item.length : 0 }}
          </div>
        </div>
      </div>
    </div>
    <!-- <el-dialog
      title="Create a new collection"
      :visible.sync="renameVisible"
      width="410px"
      center
    >
      <el-input v-model="collectionMessage.name" maxlength="31"></el-input>
      <el-button @click="rename">submit</el-button>
    </el-dialog> -->
  </div>
</template>

<script>
// import { renameCollection } from "@/api/design";
export default {
  props: {
    imgArr: {
      type: Array,
      default: () => {
        return [
          "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F210F2130512J47-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1663124045&t=d288c47a19560c2971d5541c585dea56",
        ];
      },
    },
    value: {
      type: Array,
      default: () => {
        return [];
      },
    },
    isYourAccount: {
      type: Boolean,
      default: () => {
        return true;
      },
    },
    onFolderAdd: {
      type: Function,
      default: () => {},
    },
  },
  computed: {
    folders() {
      return [...this.value];
    },
  },

  data() {
    return {
      isEdit: false,
      isRename: false,
      // renameVisible: false,
      collectionMessage: {
        name: "",
      },
      addFolderMessage: {
        name: "",
      },
    };
  },
  mounted() {},
  methods: {
    handleClickMore(target) {
      if (target.showMoreMenu) {
        target.showMoreMenu = false;
        return;
      }
      for (const item of this.folders) {
        item.showMoreMenu = false;
      }
      target.showMoreMenu = !target.showMoreMenu;
    },
    handleFolderMouseEnter() {
      for (const item of this.folders) {
        item.showMoreMenu = false;
      }
    },
    // rename() {
    //   renameCollection(this.collectionMessage)
    //     .then(() => {
    //       this.collectionMessage.isEdit = false;
    //       this.renameVisible = false;
    //     })
    //     .then(() => {
    //       this.$message({
    //         type: "success",
    //         message: "Name changed successfully",
    //       });
    //     });
    // },
    handleRenameClick(item) {
      this.$emit("Rename", item);
      item.isEdit = true;
      item.showMoreMenu = false;
      this.isRename = true;
      this.renameVisible = true;
      this.collectionMessage = item;
    },
    handleClickFolder(item) {
      console.log("isItem", item.isEdit, item);
      this.$emit("clickFolder", item);
    },

    handleEdit(item) {
      console.log("item: ", item);
    },
  },
};
</script>

<style></style>
<style lang="scss" scoped>
::v-deep ::v-deep .el-dialog {
  border-right: 10px;
}
::v-deep .el-dialog__header {
  text-align: left;
}
::v-deep .el-input {
  margin-bottom: 15px;
}
::v-deep .el-button {
  margin-left: 278px;
  background: #1a77e3;
  color: #fff;
}

.container::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 3px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 0px;
}
.container::-webkit-scrollbar-thumb {
  border-radius: 10px;
  // box-shadow: inset 0 0 5px red;
  background: #ccc;
}

.container::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
.container {
  width: 400px;
  margin: 0px auto;
  display: flex;
  overflow-y: visible;
  // height: 168px;

  .folderWrapper {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    position: absolute;
    z-index: 2;
    top: 122px;
    .folderContainer:hover .moreMenuIcon {
      text-align: right;
      display: inline;
      margin-right: 5px;
    }

    .folderContainer {
      position: relative;
      .moreMenuIcon:hover {
        cursor: pointer;
      }
      .moreMenuIcon {
        display: none;
        text-align: center;
        width: 32px;
        // height: 24px;
        // line-height: 24px;
        border-radius: 4px;
        text-align: right;
        padding: 0 5px;
        background: #e8ebf4;

        // position: absolute;
        // right: 0px;
        // top: 0px;
        .moreMenu {
          position: absolute;
          width: 160px;
          height: 124px;
          background: #ffffff;
          box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.07);
          border-radius: 10px;
          top: 20px;
          right: 10px;
          text-align: left;
          z-index: 500;
          .moreMenuItem {
            width: 144px;
            height: 48px;
            border-radius: 8px;
            line-height: 48px;
            margin: 8px auto;
            padding-left: 25px;
            z-index: 500;
          }
          .moreMenuItem:hover {
            background: #8ab5ef;
          }
        }
      }
      // .folder:hover {
      //   background: #1e78f0;
      //   opacity: 0.5;
      //   border-radius: 12px;
      // }

      .folder {
        overflow: visible;
        display: flex;
        flex-direction: column;
        justify-content: center;
        // align-items: center;
        margin-right: 5px;
        .imgArr:hover {
          cursor: pointer;
        }
        .imgArr {
          display: flex;
          flex-wrap: wrap;
          border: 1px solid #cccccc;
          width: 328px;
          height: 248px;
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          justify-content: space-between;

          .imgArrItem {
            img {
              width: 160px;
              height: 120px;
            }
          }
          .noImgItem {
            margin: auto;
            text-align: center;
            .noImg {
              width: 104px;
              height: 68px;
              line-height: 68px;
            }
          }
        }

        .editInput {
          width: 112px;
          height: 24px;
          background: #f0f3fa;
          border: 1px solid #999999;
          border-radius: 4px;
          margin-bottom: 16px;
          outline-color: #999999;
          padding: 10px;
        }
        .title {
          margin-left: 5px;
          width: 112px;
          height: 19px;
          font-size: 14px;

          font-weight: 400;
          color: #999999;
          margin-top: 8px;

          /* 1.溢出隐藏 */
          overflow: hidden;
          /* 2.用省略号来代替超出文本 */
          text-overflow: ellipsis;
          /* 3.设置盒子属性为-webkit-box  必须的 */
          display: -webkit-box;
          /* 4.-webkit-line-clamp 设置为2，表示超出2行的部分显示省略号，如果设置为3，那么就是超出3行部分显示省略号 */
          -webkit-line-clamp: 1;
          /* 5.字面意思：单词破坏：破坏英文单词的整体性，在英文单词还没有在一行完全展示时就换行  即一个单词可能会被分成两行展示 */
          word-break: break-all;
          // /* 6.盒子实现多行显示的必要条件，文字是垂直展示，即文字是多行展示的情况下使用 */
          -webkit-box-orient: vertical;
        }
      }
    }
    .folderContainer:hover .imgArr {
      background: #e8ebf4;
    }
  }
}
</style>
