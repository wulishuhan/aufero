<template>
  <div>
    <el-dialog
      :title="$t('thing.Post your make')"
      :visible.sync="visible"
      :width="width"
      :custom-class="customClass"
      @close="close"
      :append-to-body="true"
    >
      <el-form>
        <el-form-item>
          <el-upload
            ref="upload-make-file"
            class="upload-demo"
            :action="'test'"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :on-success="uploadSuccessHandler"
            :before-upload="uploadBefore"
            :on-progress="uploadProgress"
            :headers="headers"
            :limit="9"
            list-type="picture"
            :disabled="isDisabled"
            :multiple="true"
            :http-request="httpRequest"
            :on-exceed="uploadLimitExceed"
          >
            <el-input :placeholder="$t('thing.Add Photo')">
              <i slot="prefix" class="el-input__icon ortur-icon-image-add"></i>
            </el-input>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-input
            :placeholder="$t('thing.Add a description')"
            type="textarea"
            v-model="form.content"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            @click="onSubmit"
            class="post-make-button"
            :disabled="isUploadComplete"
          >
            {{ $t("thing.Post") }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { postComment, getCommentUploadS3Url } from "@/api/user";
import { mapGetters, mapState } from "vuex";
import axios from "axios";
export default {
  name: "PostMakeDialog",
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
      default: "",
    },
    width: {
      type: String,
      default: "840px",
    },
  },
  data() {
    return {
      form: {
        image: "",
        content: "",
        resourceId: this.$route.params.thingId,
        isMake: "1",
        id: 0,
      },
      isDisabled: false,
      isUploadComplete: true,
      images: [],
    };
  },
  computed: {
    visible: {
      get() {
        return this.isShow;
      },
      set(val) {
        console.log("val", val);
        this.$emit("update:isShow", false);
      },
    },
    uploadUrl() {
      return `${process.env.VUE_APP_BASE_API}/library/comment/upload`;
    },
    ...mapGetters(["isLogin"]),
    ...mapState({
      headers: (state) => state.user.headers,
    }),
  },
  methods: {
    uploadProgress(progressEvent) {
      progressEvent.percent = parseInt(
        ((progressEvent.loaded / progressEvent.total) * 100).toFixed(0)
      );
    },
    httpRequest(param) {
      this.getS3Url(param.file, param);
    },
    getS3Url(file, param) {
      getCommentUploadS3Url({
        name: file.name,
        size: file.size,
        type: file.type,
      })
        .then((res) => {
          console.log("preSingedUrl", res);
          // response 可给予handleRemove使用
          file.response = res.data.data.url;
          this.form.image = res.data.data.url;
          this.form.url = res.data.data.url;
          if (this.images.length <= 9) {
            this.images.push(res.data.data.url);
            this.form.image = this.images.join(",");
          }
          return axios.put(res.data.data.presignUrl, file, {
            headers: {
              "Content-Type": file.type,
            },
            // 处理原生进度事件
            onUploadProgress: function (progressEvent) {
              param.onProgress(progressEvent);
            },
          });
        })
        .then(() => {
          param.onSuccess(this.form.url);
        })
        .catch((err) => {
          param.onError(err);
        });
    },
    handleRemove(file) {
      for (let i = 0; i < this.images.length; i++) {
        const image = this.images[i];
        if (image == file.raw.response) {
          this.images.splice(i, 1);
          this.form.image = this.images.join(",");
          console.log("remove", this.images);
          break;
        }
      }
      if (this.images.length < 1) {
        this.isUploadComplete = true;
      }
    },
    handlePreview(file) {
      console.log(file);
    },
    onSubmit() {
      postComment(this.form).then((res) => {
        this.$message({
          message: "post make successfully",
          type: "success",
        });
        this.form.id = res.data.data;
        let resId = parseInt(this.$route.params.thingId);
        this.$store.dispatch("comment/getCommentList", { resId: resId });
        this.$emit("addMake", this.form);
        this.close();
      });
    },
    uploadSuccessHandler(res) {
      console.log("uploadSuccessHandler", res);
      this.isUploadComplete = false;
      this.isDisabled = false;
    },
    uploadBefore(file) {
      console.log("upload before file", file);
      this.isDisabled = true;
      let whiteList = ["png", "jpg", "jpeg", "gif"];
      if (file.name.length > 50) {
        this.$message.error(this.$t("thing.fileNameTooLong"));
        this.isDisabled = false;
        return false;
      } else if (
        !whiteList.includes(file.name.substring(file.name.lastIndexOf(".") + 1))
      ) {
        this.$message.error(this.$t("thing.acceptFileFormat"));
        this.isDisabled = false;
        return false;
      } else if (file.size / 1000 / 1000 >= 10) {
        this.$message.error(this.$t("thing.acceptFileSize"));
        this.isDisabled = false;
        return false;
      }
      return true;
    },
    close() {
      this.$emit("update:isShow", false);
      this.$refs["upload-make-file"].clearFiles();
      this.isDisabled = false;
      this.isUploadComplete = true;
      this.images = [];
      this.form = {
        image: "",
        content: "",
        resourceId: this.$route.params.thingId,
        isMake: "1",
        url: "",
      };
    },
    uploadLimitExceed() {
      this.$message.error(this.$t("thing.fileExceed"));
    },
  },
  watch: {
    visible(val) {
      // 在此做显示与隐藏的交互
      if (val === false) {
        // 重置操作
      } else {
        // 展示时操作
      }
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-input__inner {
  background: #f5f5f5;
  width: 808px;
  height: 40px;
  border-radius: 6px;
  border: 1px solid #ebebeb;
  cursor: pointer;
}

::v-deep .el-textarea__inner {
  background: #f5f5f5;
  width: 808px;
  height: 80px;
  border-radius: 6px;
  border: 1px solid #ebebeb;
}

::v-deep .el-dialog__header {
  padding: 0px 0px 0px 18px;
  height: 56px;
  line-height: 56px;
  font-size: 20px !important;
  font-weight: 500 !important;
  color: #1a1a1a;
}
::v-deep .el-dialog__body {
  padding: 0px;
}
::v-deep .el-form-item {
  margin-bottom: 8px;
}
.el-form {
  background: #f5f5f5;
  padding: 8px;
}
.post-make-button {
  width: 120px;
  font-size: 16px;
  float: right;
  margin-right: 15px;
}
</style>
