<template>
  <div class="upload-wrapper">
    <div class="select-area">
      <el-upload
        action=""
        :show-file-list="showFile"
        :file-list="resourceForm.files"
        multiple
        :limit="config.fileLimit"
        :on-exceed="handleExceed"
        drag
        :on-progress="handleSourceProgress"
        :on-success="handleSourceSuccess"
        :on-error="handleSourceError"
        :headers="headers"
        :accept="config.sourceAcceptType"
        :before-upload="beforeUploadSource"
        :http-request="handleRequest"
        ref="uploadFile"
      >
        <i class="ortur-icon-file" style="font-size: 60px"></i>
        <div>
          <div style="font-size: 20px; color: #ccc">
            {{ $t("upload.dragFileTip") }}
          </div>
          <div style="font-size: 16px; color: #ccc">
            {{
              $t("upload.draFileTipDesc", [
                config.fileLimit,
                formatFileSize(config.maxFileSize, 0),
              ])
            }}
          </div>
        </div>
        <span style="font-size: 20px; color: #ccc">
          {{ $t("upload.or") }}
        </span>
        <el-button size="small" type="primary">
          <i class="el-icon-plus"></i> &nbsp;
          {{ $t("upload.selectFile") }}
        </el-button>
      </el-upload>
    </div>
    <el-form-item prop="files">
      <div class="list-area" v-if="resourceForm.files.length > 0">
        <el-divider></el-divider>
        <div class="list-wrapper">
          <h5 class="list-wrapper-title">
            {{ $t("upload.resourceList") }}
          </h5>
          <ul>
            <li
              v-for="(source, sourceIndex) in resourceForm.files"
              :key="sourceIndex"
            >
              <div class="fileinfo-wrapper">
                <div class="fileicon">
                  <i class="ortur-icon-file" style="font-size: 36px"></i>
                </div>
                <div class="fileinfo">
                  <span class="filename" :title="source.name">
                    {{ source.name }}
                  </span>
                  <div class="fileinfo-tag">
                    <span class="filesize">
                      {{ formatFileSize(source.size) }}
                    </span>
                    <span
                      class="filetype"
                      :title="
                        source.name.substring(source.name.lastIndexOf('.') + 1)
                      "
                      >{{
                        source.name.substring(source.name.lastIndexOf(".") + 1)
                      }}</span
                    >
                  </div>
                </div>
              </div>
              <el-progress
                :percentage="source.percent"
                :format="format"
                v-if="source.percent != 100 && source.upStatus < 2"
              ></el-progress>
              <div class="upload-error-tip" v-if="source.upStatus >= 2">
                <i class="el-icon-warning"></i>
                <span class="error-tip-text">
                  {{
                    source.upStatus == 3
                      ? $t("upload.fileSizeTipError")
                      : $t("upload.uploadfailed")
                  }}
                </span>
              </div>
              <div
                v-if="source.upStatus >= 2 || source.upStatus == 0"
                class="fileinfo-remove-icon"
              >
                <span
                  class="ortur-icon-minus"
                  @click="handleRemoveSource(sourceIndex)"
                >
                  <span class="path1"></span>
                  <span class="path2"></span>
                </span>
              </div>
              <div v-else class="fileinfo-abort-icon">
                <span
                  class="el-icon-close"
                  style="font-size: 24px; cursor: pointer"
                  @click="handleabortUpload(sourceIndex)"
                >
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </el-form-item>
    <slot></slot>
    <div class="support-file-area">
      <el-divider></el-divider>
      <div class="support-file-area__text">
        <span>
          {{
            $t("upload.supportedFiles") +
            ": " +
            config.sourceAcceptType.replace(/,/g, "、")
          }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getResouceUploadS3Url } from "@/api/resource";
import axios from "axios";
import { generatorThumbnail } from "@/utils/generateImage";
import { formatFileSize } from "@/utils/common";
export default {
  model: {
    prop: "data",
    // 随便命名事件，对应下面$emit即可
    event: "changeData",
  },
  data() {
    return {
      showFile: false,
      resourceForm: {
        files: [],
        images: [],
      },
    };
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {
          files: [],
          images: [],
        };
      },
    },
  },
  watch: {
    resourceForm: function (val) {
      this.$emit("changeData", val);
    },
  },
  created() {
    this.resourceForm = this.data;
  },
  computed: {
    ...mapState({
      headers: (state) => state.user.headers,
      config: (state) => state.user.config,
    }),
  },
  methods: {
    beforeUploadSource(file) {
      let extension = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      var accept =
        this.config.sourceAcceptType.indexOf(extension) < 0 ? false : true;
      if (file.name.length > 50) {
        this.$message({
          message: this.$t("upload.filenameTooLong"),
          type: "warning",
        });
        return false;
      }

      if (!accept) {
        this.$message({
          message: this.$t("upload.supportedFilesError", [
            this.config.sourceAcceptType,
          ]),
          type: "warning",
        });
        return false;
      }
      var fileInfo = {
        uid: file.uid,
        url: "",
        id: 0,
        name: file.name,
        size: file.size,
        percent: 0,
        file: file,
        thumbnail: "",
        upStatus: 1, //0:ok,1:等待上传,2:失败，3:文件超出大小
      };

      //校验文件大小
      if (file.size > this.config.maxFileSize) {
        this.$message({
          message: this.$t("upload.fileTooLarge", [
            this.formatFileSize(this.config.maxFileSize, 0),
          ]),
          type: "warning",
        });
        accept = false;
        fileInfo.upStatus = 3;
      }
      this.resourceForm.files.push(fileInfo);

      this.$parent.$parent.$parent.$refs["resourceForm"].validateField("files");
      return accept;
    },
    handleExceed() {
      this.$message({
        message: this.$t("upload.fileExceed", [this.config.fileLimit]),
        type: "warning",
      });
    },
    format(percentage) {
      return `${percentage}%`;
    },
    handleRequest({ file, onProgress, onSuccess }) {
      var data;
      var tmpFile;
      getResouceUploadS3Url({
        name: file.name,
        size: file.size,
        type: file.type,
      })
        .then((res) => {
          if (res.data.code == 0) {
            let presignUrl = res.data.data.presignUrl;

            data = res.data.data;
            return axios.put(presignUrl, file, {
              headers: {
                "Content-Type": file.type,
              },
              onUploadProgress: (progressEvent) => {
                onProgress(progressEvent);
              },
            });
          }
        })
        .then(() => {
          return generatorThumbnail(file, 400, 300);
        })
        .then((thumbFile) => {
          console.log("捕获文件", thumbFile);
          tmpFile = thumbFile;
          //上传缩略图
          return getResouceUploadS3Url({
            name: thumbFile.name,
            size: thumbFile.size,
            type: thumbFile.type,
          });
        })
        .catch(() => {
          // 不是图片格式的文件处理
          tmpFile = file;
          return getResouceUploadS3Url({
            name: file.name,
            size: file.size,
            type: file.type,
          });
        })
        .then((res) => {
          if (res.data.code == 0) {
            let presignUrl = res.data.data.presignUrl;
            data.thumbnail = res.data.data.url;
            return axios.put(presignUrl, tmpFile, {
              headers: {
                "Content-Type": tmpFile.type,
              },
            });
          } else {
            return Promise.reject("error");
          }
        })
        .then(() => {
          onSuccess(data);
        });
    },
    handleSourceProgress(event, file) {
      file.percent = parseInt(((event.loaded / event.total) * 100).toFixed(0));
    },
    handleSourceSuccess(response, file) {
      file.upStatus = 0;
      file.url = response.url;
      file.thumbnail = response.thumbnail;
      file.percent = 100;
      file.id = response.id;
      file.percentage = 0;
    },
    handleSourceError(err, file) {
      file.upStatus = 2;
    },
    //中止上传
    handleabortUpload(sourceIndex) {
      this.$refs.uploadFile.abort(this.resourceForm.files[sourceIndex].file);
      this.resourceForm.files.splice(sourceIndex, 1);
    },
    handleRemoveSource(sourceIndex) {
      this.resourceForm.files.splice(sourceIndex, 1);
    },
    formatFileSize,
  },
};
</script>

<style lang="scss" scoped>
.upload-wrapper {
  padding: 40px;
  min-height: 568px;
  background: #e8ebf4;
  border-radius: 12px;
  .select-area {
    font-size: 24px;
    color: #777;
    ::v-deep .el-upload {
      width: 100%;
      .el-upload-dragger {
        height: 300px;
        width: 100%;
        border: none;
        background: none;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        .el-button {
          width: 144px;
          height: 56px;
          font-size: 20px;
          color: #1a1a1a;
          border-color: #999;
          border-radius: 8px;
          background: unset;
        }
      }
      .el-upload-dragger:hover {
        border: 1px dashed #409eff;
      }
    }
  }

  .list-area {
    .list-wrapper {
      .list-wrapper-title {
        line-height: 16px;
        color: #777;
        margin-bottom: 28px;
        font-weight: 300;
      }
      ul {
        li {
          display: flex;
          margin-bottom: 20px;
          align-items: center;
          flex-direction: row;
          .fileinfo-wrapper {
            display: flex;
            align-items: center;
            margin-right: 32px;
            .fileicon i {
              vertical-align: middle;
            }
            .fileinfo {
              width: 120px;
              margin-left: 10px;
              display: flex;
              flex-direction: column;
              .filename {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                font-size: 14px;
                line-height: 24px;
              }
              .fileinfo-tag {
                width: 100%;
                display: flex;
                align-items: center;
                font-size: 12px;
                line-height: 22px;
                justify-content: space-around;
                .filesize {
                  color: #777;
                }
                .filetype {
                  max-width: 60px;
                  padding: 0 8px;
                  margin-left: 10px;
                  background: #000;
                  color: #fff;
                  border-radius: 4px;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  overflow: hidden;
                }
              }
            }
          }

          ::v-deep .el-progress {
            width: 60%;
            margin-right: 32px;
          }
          .upload-error-tip {
            margin-right: 32px;
            color: #ff5e5e;
            font-size: 14px;
            font-weight: 400;
            .error-tip-text {
              margin-left: 10px;
            }
          }
          .fileinfo-remove-icon {
            margin-right: 32px;
            .ortur-icon-minus {
              font-size: 24px;
              cursor: pointer;
              vertical-align: middle;
            }
          }
        }
      }
    }
  }
  .support-file-area {
    .support-file-area__text {
      font-size: 16px;
      text-align: center;
      color: #cccccc;
    }
  }
}
</style>
