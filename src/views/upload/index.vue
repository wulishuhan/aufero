<!-- eslint-disable prettier/prettier -->
<template>
  <div class="upload-container" id="upload-container">
    <h1 class="header-title">{{ headerTitle }}</h1>
    <el-form
      ref="resourceForm"
      :model="resourceForm"
      :rules="resourceFormRules"
      label-position="top"
      label-width="80px"
      style="margin: 20px auto"
    >
      <el-form-item>
        <document v-model="resourceForm">
          <el-form-item prop="images" v-if="resourceForm.files.length > 0">
            <div class="list-area">
              <el-divider></el-divider>
              <div class="list-wrapper">
                <h5 class="list-wrapper-title">
                  {{ $t("upload.resourceCover") }}
                </h5>
                <draggable-swiper
                  v-model="resourceForm.images"
                  swiper-name="coverSwiper"
                  :on-add-success="onCoverAddSuccess"
                  :on-edit-success="onCoverEditSuccess"
                  :remove="handleRemoveCover"
                  :currentKeyList.sync="currentEditKeyList"
                ></draggable-swiper>
              </div>
            </div>
          </el-form-item>
        </document>
      </el-form-item>
      <el-form-item class="ref-resource-info" v-if="isRefSource">
        <h4>Source</h4>
        <el-divider></el-divider>
        <div class="resource-info-wrapper">
          <div class="resource-info-intro">
            <img :src="refResource.image" />
            <div class="resource-info">
              <span class="ref-title" :title="refResource.title">{{
                refResource.title
              }}</span>
              <span class="ref-author">By {{ refResource.creator.name }}</span>
            </div>
          </div>
          <div class="copyright">
            <img
              :src="iconUrl"
              v-for="(iconUrl, IconKey) in refResource.licenseIcon"
              :key="IconKey"
            />
          </div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('upload.title')" prop="title">
        <el-input v-model="resourceForm.title"></el-input>
      </el-form-item>
      <el-form-item :label="$t('upload.tags')" prop="tags">
        <template v-slot:label>
          {{ $t("upload.tags") }}
          <span style="font-size: 12px; color: #aaa">
            ({{ $t("upload.tagTip") }})</span
          >
        </template>
        <div class="tag-input-wrapper">
          <el-tag
            :key="index"
            v-for="(tag, index) in resourceForm.tags"
            closable
            :disable-transitions="true"
            @close="handleCloseTag(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-autocomplete
            style="width: 80px"
            class="inline-input"
            ref="autoInput"
            v-model="inputValue"
            :fetch-suggestions="querySearch"
            value-key="name"
            placeholder="New tag"
            size="small"
            :trigger-on-focus="false"
            @select="handleSelect"
            @keyup.enter.native="handleInputConfirm"
          ></el-autocomplete>
        </div>
      </el-form-item>
      <el-form-item :label="$t('upload.license')" prop="license">
        <license-select v-model="resourceForm.license"></license-select>
      </el-form-item>
      <el-form-item :label="$t('upload.engravingProp')" prop="engravingProp">
        <div class="engraving-property">
          <div class="property-item-wrapper">
            <div class="property-icon">
              <svg-icon
                icon-class="material"
                class-name="icon-material"
              ></svg-icon>
            </div>
            <div class="property-select-wrapper">
              <span class="property-name">Material</span>
              <div>
                <el-select
                  v-model="resourceForm.material"
                  placeholder="please choose"
                  class="property-selecter"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="property-item-wrapper">
            <div class="property-icon">
              <svg-icon icon-class="speed" class-name="icon-speed"></svg-icon>
            </div>
            <div class="property-select-wrapper">
              <span class="property-name">Speed</span>
              <div>
                <el-input
                  placeholder=""
                  v-model="resourceForm.speed"
                  class="property-selecter"
                >
                  <span slot="suffix">mm/s</span>
                </el-input>
              </div>
            </div>
          </div>
          <div class="property-item-wrapper" style="position: relative">
            <div class="property-icon">
              <svg-icon
                icon-class="quality"
                class-name="icon-quality"
              ></svg-icon>
            </div>
            <div class="property-select-wrapper">
              <span class="property-name">Mode</span>
              <div>
                <el-select
                  v-model="resourceForm.mode"
                  placeholder="请选择"
                  class="property-selecter"
                >
                  <el-option
                    v-for="item in options1"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="property-item-wrapper">
            <div class="property-icon">
              <svg-icon icon-class="mode" class-name="icon-mode"></svg-icon>
            </div>
            <div class="property-select-wrapper">
              <span class="property-name">Quality</span>
              <div style="display: flex; position: relative">
                <div
                  class="select-suffix"
                  style="position: absolute; left: 180px; color: #aaa"
                >
                  row/mm
                </div>
                <el-select
                  v-model="resourceForm.quality"
                  placeholder="please choose"
                  class="property-selecter"
                >
                  <el-option v-for="value in 20" :key="value" :value="value">
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>
          <div class="property-item-wrapper">
            <div class="property-icon">
              <svg-icon icon-class="power" class-name="icon-power"></svg-icon>
            </div>
            <div class="property-select-wrapper">
              <span class="property-name">Power</span>
              <div>
                <el-input
                  placeholder=""
                  v-model="resourceForm.power"
                  class="property-selecter"
                >
                  <span slot="suffix">%</span>
                </el-input>
              </div>
            </div>
          </div>
          <div class="property-item-wrapper"></div>
        </div>
      </el-form-item>
      <el-form-item :label="$t('upload.description')" prop="description">
        <el-input
          type="textarea"
          autosize
          v-model="resourceForm.description"
        ></el-input>
      </el-form-item>
      <el-form-item :label="$t('upload.tutorial')" style="position: relative">
        <span
          v-if="tutorialForm.length == 0"
          class="ortur-icon-plus tutorial-handle-icon"
          @click="addTutorialItem(false)"
        >
          <span class="path1"></span>
          <span class="path2"></span>
        </span>
        <span
          v-if="tutorialForm.length > 0"
          class="ortur-icon-minus tutorial-handle-icon"
          @click="removeTutorialItem(false)"
        >
          <span class="path1"></span>
          <span class="path2"></span>
        </span>
        <el-divider v-if="tutorialForm.length <= 0"></el-divider>
        <draggable
          v-else
          class="tutorial"
          draggable=".tutorial-item"
          handle=".drag-btn"
          v-model="tutorialForm"
        >
          <div
            class="tutorial-item"
            v-for="(tutorialItem, tutorialKey) in tutorialForm"
            :key="tutorialItem.id"
          >
            <el-form
              ref="tutorialForm"
              :model="tutorialItem"
              :rules="tutorialFormRules"
            >
              <el-form-item prop="title" style="margin-bottom: 20px">
                <el-input
                  v-model="tutorialItem.title"
                  :placeholder="$t('upload.addStepTitle')"
                ></el-input>
              </el-form-item>
              <el-form-item style="margin: 20px auto">
                <draggable-swiper
                  v-model="tutorialItem.images"
                  :swiper-name="tutorialSwiper + tutorialKey"
                  :on-add-success="onTutorialAddSuccess"
                  :on-edit-success="onTutorialEditSuccess"
                  :remove="removeTutorialImg"
                  :currentKeyList.sync="currentEditKeyList"
                  :group-key="tutorialKey"
                ></draggable-swiper>
              </el-form-item>
              <el-form-item label="" prop="description">
                <el-input
                  type="textarea"
                  autosize
                  v-model="tutorialItem.description"
                  :placeholder="$t('upload.addStepDesc')"
                ></el-input>
              </el-form-item>
              <el-button class="drag-btn"
                ><i class="ortur-icon-settings-gray"></i
              ></el-button>

              <el-button class="add-btn" @click="addTutorialItem(tutorialKey)">
                <i class="el-icon-plus"></i>
              </el-button>
              <el-button
                class="remove-btn"
                @click="removeTutorialItem(tutorialKey)"
                v-if="tutorialForm.length != 1"
                ><i class="el-icon-delete"></i
              ></el-button>
            </el-form>
          </div>
        </draggable>
      </el-form-item>
      <el-form-item>
        <div class="action-btn">
          <el-button type="primary" @click="handleSave()">
            {{ $t("upload.save") }}
          </el-button>
          <el-button @click="previewDialogVisible = true">
            {{ $t("upload.preview") }}
          </el-button>
          <el-button @click="resetForm()">
            {{ $t("upload.reset") }}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
    <Preview
      :dialogVisible="previewDialogVisible"
      :close="closePreviewDialog"
      :preview-data="previewData"
    ></Preview>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import Preview from "@/components/Preview";
import { mapState } from "vuex";
import {
  saveResource,
  getResource,
  updateResource,
  getResourceTags,
} from "@/api/resource";

import draggableSwiper from "@/views/upload/draggableSwiper";
import document from "@/views/upload/document";
import licenseSelect from "@/views/upload/licenseSelect";
import { throttle } from "@/utils/common";
export default {
  // eslint-disable-next-line
  name: "upload",
  components: {
    draggable,
    Preview,
    draggableSwiper,
    document,
    licenseSelect,
  },
  data() {
    return {
      radio1: "",
      currentEditKeyList: [0, 0],
      previewDialogVisible: false,
      sourceId: 0,
      parentId: 0,
      isRefSource: false,
      acceptType: ".jpg,.png,.svg,.dxf,.gc,.nc,.jpeg,.gcode",
      tutorialValidateResult: true,
      tutorialSwiper: "tutorialSwiper",
      showFile: false,
      inputValue: "",
      searchSuggestions: "",
      dialogVisible: false,

      options: [
        {
          value: "",
          label: "Not set",
        },
        {
          value: "Wood",
          label: "Wood",
        },
        {
          value: "Material",
          label: "Material",
        },
        {
          value: "Plastic",
          label: "Plastic",
        },
        {
          value: "Leather",
          label: "Leather",
        },
        {
          value: "Glass",
          label: "Glass",
        },
        {
          value: "Stone",
          label: "Stone",
        },
        {
          value: "Paper",
          label: "Paper",
        },
        {
          value: "Ceramic",
          label: "Ceramic",
        },
        {
          value: "Cloth",
          label: "Cloth",
        },
        {
          value: "Food",
          label: "Food",
        },
        {
          value: "Other",
          label: "Other",
        },
      ],
      options1: [
        {
          value: "",
          label: "Not set",
        },
        {
          value: "Scan",
          label: "Scan",
        },
        {
          value: "Dot matrix",
          label: "Dot matrix",
        },
        {
          value: "Vector(Contour)",
          label: "Vector(Contour)",
        },
        {
          value: "Vector(Fill)",
          label: "Vector(Fill)",
        },
        {
          value: "Vector(Contour+Fill)",
          label: "Vector(Contour+Fill)",
        },
        {
          value: "Vector(Centerline)",
          label: "Vector(Centerline)",
        },
      ],
      options2: [
        {
          value: "",
          label: "Not set",
        },
        {
          value: "middle",
          label: "middle",
        },
        {
          value: "high",
          label: "high",
        },
      ],
      refResource: {
        title: "",
        images: [
          {
            url: "",
          },
        ],
        creator: {
          name: "",
        },
        licenseIcon: [],
      },
      resourceFormRules: {
        files: [
          {
            required: true,
            message: this.$t("upload.sourceNotEmpty"),
          },
        ],
        images: [{ required: true, message: this.$t("upload.coverNotEmpty") }],
        title: [
          { required: true, message: this.$t("upload.titleNotEmpty") },
          {
            range: true,
            min: 1,
            max: 32,
            message: this.$t("upload.titleLengthError", [1, 32]),
          },
        ],
        tags: [
          {
            required: true,
            message: this.$t("upload.tagNotEmpty"),
            trigger: "blur",
          },
        ],
        license: [
          {
            required: true,
            message: this.$t("upload.notEmpty"),
            trigger: "change",
          },
        ],
        description: [{ required: true, message: this.$t("upload.notEmpty") }],
      },
      resourceForm: {
        images: [],
        files: [],
        title: "",
        tags: [],
        license: "",
        material: "",
        speed: "",
        mode: "",
        power: "",
        quality: "",
        description: "",
      },
      tutorialFormRules: {
        title: [
          { required: true, message: this.$t("upload.titleNotEmpty") },
          {
            range: true,
            min: 1,
            max: 32,
            message: this.$t("upload.titleLengthError", [1, 32]),
          },
        ],
        description: [
          { required: true, message: this.$t("upload.descNotEmpty") },
        ],
      },
      tutorialForm: [],
      swiperOptions: {
        observer: true,
        slidesPerView: 5,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
      tutorialSwiperOptions: {
        observer: true,
        slidesPerView: 5,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
      },
    };
  },
  computed: {
    ...mapState({
      headers: (state) => state.user.headers,
      config: (state) => state.user.config,
    }),
    headerTitle() {
      if (this.sourceId != 0) {
        return this.$t("upload.editProject");
      } else {
        return this.$t("upload.createProject");
      }
    },
    previewData() {
      return {
        ...this.resourceForm,

        tutorials: this.tutorialForm,
        editDatetime: this.$t("upload.editOn") + this.$d(new Date(), "short"),
      };
    },
  },
  created() {
    this.sourceId = this.$route.params.sourceId || 0;
    this.parentId = this.$route.query.refId || 0;
    //refId不为空则为POST Remix
    if (this.sourceId != 0) {
      //调用详解接口
      getResource(parseInt(this.sourceId)).then((res) => {
        let detail = res.data.data;
        this.resourceForm.description = detail.description;
        this.resourceForm.title = detail.title;
        this.resourceForm.files = detail.files;
        this.resourceForm.files.forEach((item) => {
          item.percent = 100;
          item.upStatus = 0; //0:ok,1:等待上传,2:失败，3:文件超出大小
        });
        this.resourceForm.images = detail.images;
        this.resourceForm.tags = detail.tags;
        this.resourceForm.license = detail.license;
        this.resourceForm.material = detail.material;
        this.resourceForm.mode = detail.mode;
        this.resourceForm.power = detail.power;
        this.resourceForm.quality = detail.quality;
        this.resourceForm.speed = detail.speed;
        this.tutorialForm = detail.tutorials;
        if (Object.keys(detail.ancestor).length > 0) {
          this.isRefSource = true;
          this.refResource = detail.ancestor;
          for (const item of this.config.licenseSelectList) {
            if (item.value == this.refResource.license) {
              this.refResource.licenseIcon = item.icon;
              break;
            }
          }
        }
      });
    }
    if (this.parentId != 0) {
      //调用详解接口
      this.isRefSource = true;
      getResource(parseInt(this.parentId)).then((res) => {
        var resData = res.data.data;
        this.refResource = {
          image: resData.images.length > 0 ? resData.images[0].url : "",
          title: resData.title,
          license: resData.license,
          id: resData.id,
          creator: resData.creator,
        };
        for (const item of this.config.licenseSelectList) {
          if (item.value == this.refResource.license) {
            this.refResource.licenseIcon = item.icon;
            break;
          }
        }
      });
    }
    this._throttle = throttle((swiperArrow) => {
      //滚动
      this.$refs[swiperArrow].click();
    }, 500);

    this._throttle_tutorial = throttle((swiperArrow, curIndex) => {
      //滚动
      this.$refs[swiperArrow][curIndex].click();
    }, 500);
  },
  methods: {
    handleSelect() {
      this.$refs["autoInput"].focus();
    },
    querySearch(queryString, cb) {
      getResourceTags({ name: queryString }).then((res) => {
        var restaurants = res.data.data;
        cb(restaurants);
      });
    },
    closePreviewDialog() {
      this.previewDialogVisible = false;
    },
    resetForm() {
      this.$refs["resourceForm"].resetFields();
      this.resourceForm.images = [];
      this.tutorialForm = [];
    },
    handleCloseTag(tag) {
      this.resourceForm.tags.splice(this.resourceForm.tags.indexOf(tag), 1);
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (this.resourceForm.tags.length >= 12) {
        this.$message.error(this.$t("upload.tagNumError"));
        return;
      }

      if (inputValue.length > 32) {
        this.$message.error(this.$t("upload.charNumError"));
        return;
      }
      if (inputValue) {
        this.resourceForm.tags.push(inputValue);
        this.resourceForm.tags = Array.from(new Set(this.resourceForm.tags));
      }
      this.inputVisible = false;
      this.inputValue = "";
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
      this.$refs["resourceForm"].validateField("images");
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
    currentTutorialEditIndex(tutorialKey, tutorialImgKey) {
      this.currentTutorialKey = tutorialKey;
      this.currentTutorialImgKey = tutorialImgKey;
    },
    removeTutorialImg(tutorialImgKey, tutorialKey) {
      this.tutorialForm[tutorialKey].images.splice(tutorialImgKey, 1);
    },
    onTutorialAddSuccess(response) {
      let imgInfo = {
        id: response.id,
        url: response.url,
        name: response.name,
        size: response.size,
      };
      this.tutorialForm[this.currentEditKeyList[1]].images.push(imgInfo);
    },
    onTutorialEditSuccess(response) {
      let imgInfo = {
        id: response.id,
        url: response.url,
        name: response.name,
        size: response.size,
      };
      this.tutorialForm[this.currentEditKeyList[1]].images.splice(
        this.currentEditKeyList[0],
        1,
        imgInfo
      );
    },

    currentEditIndex(coverEditIndex) {
      this.coverEditIndex = coverEditIndex;
    },
    addTutorialItem(tutorialKey) {
      var index = tutorialKey;
      if (tutorialKey === false) {
        index = 0;
      } else {
        index += 1;
      }

      this.$nextTick(() => {
        this.tutorialForm.splice(index, 0, {
          id: Date.now(),
          description: "",
          title: "",
          images: [],
        });
      });
      console.log(this.tutorialForm);
    },
    removeTutorialItem(tutorialKey) {
      console.log("tutorialKey=======", tutorialKey, this.tutorialForm);
      if (tutorialKey !== false) {
        this.tutorialForm.splice(tutorialKey, 1);
      } else {
        this.tutorialForm = [];
      }
    },

    handleSave() {
      this.$refs["resourceForm"].validate((valid) => {
        const tutorialFormList = this.$refs["tutorialForm"] ?? [];
        this.tutorialValidateResult = true;
        for (let i = 0; i < tutorialFormList.length; i++) {
          tutorialFormList[i].validate((valid) => {
            this.tutorialValidateResult &&= valid;
          });
        }
        if (valid && this.tutorialValidateResult) {
          if (this.sourceId != 0) {
            //调用详解接口
            updateResource({
              id: this.sourceId,
              ...this.resourceForm,
              tutorials: this.tutorialForm,
            })
              .then(() => {
                this.$message.success(this.$t("upload.updateOk"));
                this.$router.push("/design/fromProfile");
              })
              .catch((res) => {
                this.$message.error(res.msg);
              });
          } else {
            saveResource({
              ...this.resourceForm,
              tutorials: this.tutorialForm,
              parentId: this.parentId,
            })
              .then((res) => {
                if (res.data.code == 0) {
                  this.$message.success(this.$t("upload.saveOk"));
                  this.$router.push("/design/fromProfile");
                } else {
                  this.$message.error(this.$t("upload.saveFail"));
                }
              })
              .catch((e) => {
                console.log(e);
                this.$message.error(this.$t("upload.validateError"));
              });
          }
        } else {
          this.$message.error(this.$t("upload.validateError"));
        }
      });
    },
  },
};
</script>

<style lang="scss">
.header-title {
  font-size: 30px;
  margin: 50px auto 30px;
  font-weight: 300;
  text-align: center;
}

.swiper-button-next,
.swiper-button-prev {
  width: 0;
}
.swiper-button-next {
  right: 12px;
}
.swiper-button-prev {
  left: 12px;
}

.upload-container {
  width: 1136px;
  margin: 0px auto;
}

.tutorial-handle-icon {
  position: absolute;
  right: 0;
  top: -24px;
  font-size: 20px;
  cursor: pointer;
}
.tutorial {
  // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 8px;

  .tutorial-item {
    position: relative;
    // box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 8px;
    margin: 0px auto 16px;
    border: 1px solid #cccccc;
    border-radius: 6px;
    background: #e8ebf4;

    .el-button {
      position: absolute;
      border: none;
      background: none;
    }
    .drag-btn {
      left: -80px;
      top: 50%;
    }
    .add-btn {
      width: 32px;
      height: 32px;
      right: -70px;
      bottom: 10px;
      padding: unset;
      background: rgba(232, 235, 244, 0.3);
      border-radius: 6px;
    }
    .add-btn:hover {
      background: #e8ebf4;
      color: #aaa;
    }
    .remove-btn {
      right: -70px;
      border-radius: 6px;
      top: 50%;
      width: 32px;
      height: 32px;
      background: rgba(255, 94, 94, 0.3);
      padding: unset;
    }
    .remove-btn:hover {
      color: #fff;
      background: #ff5e5e;
    }
  }
}
.action-btn {
  display: flex;
  justify-content: flex-end;
  .el-button {
    width: 120px;
    margin-left: 20px;
  }
}

.el-form {
  .el-form-item label {
    font-weight: 400;
    font-size: 16px;
  }
  .el-form-item input,
  .el-form-item textarea {
    font-size: 12px;
  }
  .el-input .el-input__inner {
    background: none;
  }
  .el-textarea .el-textarea__inner {
    background: none;
  }
  .tag-input-wrapper {
    border: 1px solid #dcdfe6;
    padding: 0 5px;
    border-radius: 5px;
  }
  .engraving-property {
    min-height: 224px;
    background: #f0f3fa;
    border: 1px solid #cccccc;
    border-radius: 10px;
    display: flex;
    padding: 20px;
    justify-content: space-between;
    flex-wrap: wrap;
    align-content: space-between;
    .property-item-wrapper {
      display: flex;
      width: 330px;
      .property-icon {
        margin-right: 14px;
        font-size: 30px;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 2px 0px;
      }
      .property-select-wrapper {
        display: flex;
        flex-direction: column;
        .property-name {
          font-weight: 400;
          color: #1a1a1a;
          font-size: 16px;
        }
        .property-selecter {
          .el-input__inner {
            line-height: 32px;
            height: 32px;
            width: 280px;
          }
        }
        .el-radio-button {
          margin-right: 18px;
        }
        .el-radio-button__inner {
          padding: 7px 20px;
        }
      }
    }
  }
  .ref-resource-info {
    padding: 10px;
    background: #e8ebf4;
    border-radius: 10px;
    h4 {
      line-height: 24px;
      font-size: 16px;
      font-weight: 400;
      color: #1a1a1a;
    }
    .el-divider--horizontal {
      margin: 10px 0;
      background: #999 !important;
      border-top: unset !important;
    }
    .resource-info-wrapper {
      line-height: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .resource-info-intro {
        display: flex;
        justify-content: space-between;
        align-content: center;
        img {
          width: 88px;
          height: 56px;
          object-fit: cover;
        }
        .resource-info {
          margin-left: 20px;
          display: flex;
          flex-direction: column;
          .ref-title {
            font-size: 16px;
            max-width: 600px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
          .ref-author {
            font-size: 14px;
            color: #999999;
            max-width: 600px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }
      .copyright img {
        height: 46px;
        width: auto;
      }
      .copyright img + img {
        margin-left: 20px;
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
        }
      }
    }
  }
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.el-tag {
  color: #1a1a1a;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
