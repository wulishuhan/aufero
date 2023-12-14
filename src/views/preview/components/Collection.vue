<template>
  <div>
    <el-dialog :visible.sync="outerDialog">
      <h2>Collect to</h2>
      <el-checkbox-group v-model="checkList" @change="change">
        <p v-for="item in collectList" :key="item.id">
          <el-checkbox :label="item"> {{ item.name }}</el-checkbox>
        </p>
      </el-checkbox-group>

      <div
        style="
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        "
      >
        <div @click="innerDialog = true">
          <span class="el-icon-plus"></span>
          New Collection
        </div>
        <div>
          <el-button @click="closeOuterDialog">Cancel</el-button>
          <el-button type="primary" @click="outerComfirm">Confirm</el-button>
        </div>
      </div>
      <el-dialog :visible.sync="innerDialog" append-to-body>
        <h2>{{ $t("collection.create new collection") }}</h2>
        <el-input v-model="newFolderName"></el-input>
        <div
          style="
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          "
        >
          <el-button @click="closeInnerDialog">Cancel</el-button>
          <el-button type="primary" @click="innerComfirm">Confirm</el-button>
        </div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
// more module style...
// 用来预览组件
// eslint-disable-next-line
import {
  getCollectionList,
  addCollection,
  getResourceInCollection,
  addResourceToCollection,
  deleteResourceInCollection,
} from "@/api/collection.js";
export default {
  name: "Collection",
  components: {},
  props: {
    resourceId: {
      type: Number,
      default: 83,
    },
    visiable: { type: Boolean, default: false },
  },
  computed: {
    outerDialog: {
      get() {
        return this.visiable;
      },
      set(value) {
        this.$emit("update:visiable", value);
      },
    },
  },
  watch: {
    visiable(val) {
      //eslint-disable-next-line
      if (val == false) {
        //eslint-disable-next-line
      } else {
      }
    },
  },
  data() {
    return {
      innerDialog: false,
      newFolderName: "",
      checkList: [],
      preCheckList: [],
      collectList: [],
      isAdd: undefined,
    };
  },
  methods: {
    change() {},
    diff(preList, currentList) {
      let addList = currentList.filter((item) => {
        if (!preList.includes(item)) {
          return item;
        }
      });
      let deleteList = preList.filter((item) => {
        if (!currentList.includes(item)) {
          return item;
        }
      });
      return { addList, deleteList };
    },
    closeOuterDialog() {
      this.$emit("close");
    },
    closeInnerDialog() {
      this.newFolderName = "";
      this.innerDialog = false;
    },
    outerComfirm() {
      let { addList, deleteList } = this.diff(
        this.preCheckList,
        this.checkList
      );
      addList.forEach((item) => {
        addResourceToCollection({
          collectionId: item.id,
          resourceId: this.resourceId,
        });
      });
      deleteList.forEach((item) => {
        deleteResourceInCollection({
          collectionId: item.id,
          resourceId: this.resourceId,
        });
      });
      this.getCollectionList();
      this.closeOuterDialog();
    },
    innerComfirm() {
      addCollection({
        userId: this.$store.getters.userInfo.user_id,
        name: this.newFolderName,
      }).then(() => {
        this.$message.success("ok");
        this.getCollectionList();
        this.closeInnerDialog();
      });
    },
    getCollectionList() {
      getCollectionList({
        userId: this.$store.getters.userInfo.user_id,
      })
        .then((res) => {
          this.collectList = res.data.data;
          return this.collectList;
        })
        .then((collectList) => {
          for (const item of collectList) {
            getResourceInCollection({
              collectionId: item.id,
              userId: this.$store.getters.userInfo.user_id,
            }).then((res) => {
              if (res.data.total > 0) {
                let flag = res.data.rows.some((r) => {
                  return r.id == this.resourceId;
                });
                if (flag) {
                  console.log(this.checkList, 176);
                  this.checkList.push(item);
                  this.preCheckList.push(item);
                }
              }
            });
          }
        });
    },
  },
  mounted() {
    this.getCollectionList();
    this.$store.dispatch("user/getMyCollectionList", {
      userId: this.$store.getters.userInfo.user_id,
    });
  },
};
</script>
<style lang="scss" scoped></style>
