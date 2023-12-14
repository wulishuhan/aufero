<template>
  <div class="Profile">
    <div class="Profilehead">{{ $t("profile.Profile") }}</div>
    <el-divider></el-divider>
    <div>
      <div>
        <div>
          <el-upload
            class="upload-demo"
            :headers="headers"
            :on-success="handleImgUploadSuccess"
            :on-error="handleImgUploadErr"
            :before-upload="handleBeforeImgUpload"
            ref="upload"
            :action="baseURL + '/system/user/avatar'"
            :auto-upload="true"
            :show-file-list="false"
          >
          </el-upload>
        </div>
        <div class="imgEdit">
          <i class="ortur-icon-pen"></i>
        </div>
        <img class="img" :src="userInfo.avatar" />
      </div>
      <el-form :model="registerForm" ref="registerForm" :rules="rules">
        <el-form-item class="name" prop="nick_name">
          <div class="nickName" @click="EditnickName" v-show="!isEdit">
            {{ userInfo.nick_name }}
          </div>
          <div style="margin-left: 56px" v-show="isEdit">
            <el-input
              ref="editnickNameRef"
              class="editnickName"
              v-model="registerForm.nick_name"
              autocomplete="off"
              placeholder=""
              maxlength="32"
            ></el-input>
            <el-button class="closeButton" @click="close()">
              <i class="el-icon-close"></i>
            </el-button>
            <el-button
              class="changenickName"
              @click="changenickName('registerForm')"
            >
              <i class="el-icon-check"></i>
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-form ref="form" :rules="rules" :model="form" label-width="123px">
        <div class="BASICINFO">{{ $t("profile.BASIC INFO") }}</div>
        <el-divider class="divider"></el-divider>
        <el-form-item>
          <div class="Description">{{ $t("profile.Description") }}</div>
          <el-input
            v-model="form.description"
            class="DescriptionInput"
            type="textarea"
            :rows="6"
            resize="none"
            :placeholder="$t('profile.Please enter the content')"
            maxlength="500"
            :show-word-limit="true"
          >
          </el-input>
        </el-form-item>
        <div class="SOCIALPROFILES">{{ $t("profile.SOCIAL PROFILES") }}</div>
        <el-divider class="divider"></el-divider>
        <el-form-item prop="facebook">
          <div style="display: flex">
            <div>
              <svg-icon
                class="svgicon"
                icon-class="脸书"
                class-name="icon-脸书"
              ></svg-icon>
            </div>
            <div style="line-height: 31px; margin-left: 17px">
              <span class="svgiconText"> Facebook</span>
            </div>
          </div>
          <el-input
            v-model="form.facebook"
            class="iconInput"
            placeholder="https://facebook.com/xxx"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="tiktok">
          <div style="display: flex">
            <div>
              <svg-icon
                class="svgicon"
                icon-class="tiktok-share-icon-black-1"
                class-name="icon-tiktok-share-icon-black-1"
              ></svg-icon>
            </div>
            <div style="line-height: 31px; margin-left: 17px">
              <span class="svgiconText"> Tik Tok</span>
            </div>
          </div>
          <el-input
            v-model="form.tiktok"
            class="iconInput"
            placeholder="https://tiktok.com/xxx"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="twitter">
          <div style="display: flex">
            <div>
              <svg-icon
                class="svgicon"
                icon-class="推特"
                class-name="icon-推特"
              ></svg-icon>
            </div>
            <div style="line-height: 31px; margin-left: 17px">
              <span class="svgiconText"> Twitter</span>
            </div>
          </div>
          <el-input
            v-model="form.twitter"
            class="iconInput"
            placeholder="https://twitter.com/xxx"
          >
          </el-input>
        </el-form-item>
        <el-form-item prop="instagram">
          <div style="display: flex">
            <div>
              <svg-icon
                class="svgicon"
                icon-class="ins2"
                class-name="icon-ins2"
              ></svg-icon>
            </div>
            <div style="line-height: 31px; margin-left: 17px">
              <span class="svgiconText"> Instagram </span>
            </div>
          </div>
          <el-input
            v-model="form.instagram"
            class="iconInput"
            placeholder="https://instagram.com/xxx"
          >
          </el-input>
        </el-form-item>
        <div class="CONTACTINFO">{{ $t("profile.CONTACT INFO") }}</div>
        <el-divider class="divider"></el-divider>
        <div class="items">
          <div v-for="(item, index) in diyArr" :key="item.index">
            <div style="display: flex">
              <div
                class="item"
                @click="editDiy(item, index)"
                v-show="!item.isEdits && item.text != '' && !item.isAddInput"
                :class="[{ NoDesc: !item.text }, { descHover: isContact }]"
              >
                <a
                  target="_blank"
                  style="color: #1e78f0"
                  v-if="item.text.startsWith('http')"
                  :href="item.text"
                >
                  {{ item.text }}
                </a>
                <div v-else>{{ item.text || "Email/Phone number/..." }}</div>
              </div>
              <div
                v-show="!item.isEdits && item.text != '' && !item.isAddInput"
                @click="delurltext(item, index)"
                class="iconDelete"
              >
                <i class="el-icon-delete"></i>
              </div>
              <div
                class="add"
                v-show="
                  !item.isEdits &&
                  item.text != '' &&
                  !item.isAddInput &&
                  !isThird &&
                  item.isShowAdd
                "
                @click="addDiy(item, index)"
              >
                +
              </div>
            </div>
            <el-input
              class="itemInput"
              ref="diyRef"
              v-on:keyup.enter.native="editChange(item, index)"
              @blur="editChange(item, index)"
              v-show="item.isEdits && !item.isAddInput"
              v-model="item.text"
              placeholder="Email/Phone number/..."
              maxlength="32"
            ></el-input>
          </div>
          <div
            v-show="
              form.url1 == '' &&
              form.url2 == '' &&
              form.url3 == '' &&
              !diyArr[0].isEdits
            "
            style="display: flex"
          >
            <div>
              <el-input
                class="itemInput"
                v-model="ItemIndex0.text"
                v-on:keyup.enter.native="editChanges(ItemIndex0)"
                @blur="editChanges(ItemIndex0)"
                placeholder="Email/Phone number/..."
                maxlength="32"
              ></el-input>
            </div>
            <div class="add">+</div>
          </div>
          <div>
            <el-input
              ref="inputRef"
              class="itemInput"
              v-model="tsetItem.text"
              v-show="tsetItem.isAddInput"
              v-on:keyup.enter.native="editChange(tsetItem)"
              @blur="editChange(tsetItem)"
              placeholder="Email/Phone number/..."
              maxlength="32"
            ></el-input>
          </div>
        </div>
        <el-form-item style="margin: 153px 0 0 773px">
          <el-button type="primary" @click="onSubmit">{{
            $t("profile.Save")
          }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
  getProfileList,
  updateProfileList,
  changeName,
} from "@/api/setting.js";
import { updateDiy } from "@/api/design";
import { getToken } from "@/utils/auth";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");

export default {
  data() {
    let checknick_name = (rule, value, callback) => {
      if (this.registerForm.nick_name != "") {
        this.registerForm.nick_name = this.registerForm.nick_name.trim();
        if (this.registerForm.nick_name == "") {
          this.nameShow = true;
          return callback(new Error("The nickname cannot be blank - only"));
        } else {
          if (this.registerForm.nick_name.length == 1) {
            this.nameShow = true;
            return callback(new Error("Nicknames are 2-32 in length"));
          }
        }
        this.nameShow = false;
        return;
      }
      this.nameShow = true;
      return callback(new Error("Nicknames are 2-32 in length"));
    };
    let checkfacebook = (rule, value, callback) => {
      if (this.form.facebook != "") {
        let a = this.form.facebook.includes("https://");
        let b = this.form.facebook.includes(".");
        if (!a && !b) {
          this.rulesShow = true;
          return callback(new Error("Link validation failed"));
        }
      }
      this.rulesShow = false;
    };
    let checktiktok = (rule, value, callback) => {
      if (this.form.tiktok != "") {
        let a = this.form.tiktok.includes("https://");
        let b = this.form.tiktok.includes(".");
        if (!a && !b) {
          this.rulesShow = true;
          return callback(new Error("Link validation failed"));
        }
      }
      this.rulesShow = false;
    };
    let checktwitter = (rule, value, callback) => {
      if (this.form.twitter != "") {
        let a = this.form.twitter.includes("https://");
        let b = this.form.twitter.includes(".");
        if (!a && !b) {
          this.rulesShow = true;
          return callback(new Error("Link validation failed"));
        }
      }
      this.rulesShow = false;
    };
    let checkinstagram = (rule, value, callback) => {
      if (this.form.instagram != "") {
        let a = this.form.instagram.includes("https://");
        let b = this.form.instagram.includes(".");
        if (!a && !b) {
          this.rulesShow = true;
          return callback(new Error("Link validation failed"));
        }
      }
      this.rulesShow = false;
    };
    return {
      ItemIndex0: { isAddInput: false },
      tsetItem: { isAddInput: false },
      arr2: [],
      diyArr: [],
      isContact: false,
      isDescEdit: false,
      isEdit: false,
      isShowAdd: false,
      form: {},
      textarea: "",
      third_user: [],
      user: {
        avatar: "",
      },

      registerForm: {
        nick_name: "",
      },
      loading: true,
      nameShow: false,
      rulesShow: false,
      //validateField 可校验单个规则
      //正则InternetURL：[a-zA-z]+://[^\s]* 或 ^http://([\w-]+\.)+[\w-]+(/[\w-./?%&=]*)?$
      rules: {
        nick_name: [
          {
            validator: checknick_name,
            min: 2,
            max: 32,
            trigger: "blur",
          },
        ],
        facebook: [
          {
            validator: checkfacebook,
            trigger: "blur",
          },
        ],
        tiktok: [
          {
            validator: checktiktok,
            trigger: "blur",
          },
        ],
        twitter: [
          {
            validator: checktwitter,
            trigger: "blur",
          },
        ],
        instagram: [
          {
            validator: checkinstagram,
            trigger: "blur",
          },
        ],
      },
      headers: {
        Authorization: getToken(),
      },
    };
  },
  mounted() {
    this.showPanel();
  },
  computed: {
    ...mapState(["userInfo"]),
    // 命名一个isThird，用计算属性监控它，
    // 当所有的url都有数据时，isThird为true，再利用isThird控制“+”的显示
    isThird() {
      let arr = this.diyArr.filter((item) => {
        if (item.text.length > 0) {
          return item;
        }
      });
      return arr.length >= this.diyArr.length ? true : false;
    },
  },
  methods: {
    editDiy(item, index) {
      item.isEdits = true;
      this.isDescEdit = false;
      setTimeout(() => {
        this.$refs.diyRef[index].focus();
      }, 0);
    },
    showPanel() {
      getProfileList(this.userInfo.user_id).then((response) => {
        this.form = response.data.data;
        console.log(this.form, 311);
        this.registerForm.nick_name = response.data.data.name;
        let res = response.data.data;
        document.title = res.name + " | " + "AlgoLaser Library";
        Object.assign(this.user, res);
        this.diyArr = [];
        this.diyArr.push({
          isEdits: false,
          isShowAdd: false,
          text: res.url1,
          id: 1,
        });

        this.diyArr.push({
          isEdits: false,
          isShowAdd: false,
          text: res.url2,
          id: 2,
        });

        this.diyArr.push({
          isEdits: false,
          isShowAdd: false,
          text: res.url3,
          id: 3,
        });
        // 获取只有数据的url，生成数组
        this.arr2 = [];
        res.url1 &&
          this.arr2.push({
            isEdits: false,
            isShowAdd: false,
            text: res.url1,
            id: 1,
          });
        res.url2 &&
          this.arr2.push({
            isEdits: false,
            isShowAdd: false,
            text: res.url2,
            id: 2,
          });
        res.url3 &&
          this.arr2.push({
            isEdits: false,
            isShowAdd: false,
            text: res.url3,
            id: 3,
          });
        // 通过数组arr2得到最后一个有数据的url对象，
        // 并在diyArr数组中把对应的对象中的isShowAdd改为true，最后用于“+”的判断
        for (let i = 0; i < this.diyArr.length; i++) {
          if (this.diyArr[i]?.id === this.arr2[this.arr2.length - 1]?.id) {
            this.diyArr[i].isShowAdd = true;
          }
        }
      });
    },
    // 点击当前的"+"放出下一个item的编辑框
    addDiy() {
      setTimeout(() => {
        this.$refs.inputRef.focus();
      }, 0);
      for (let i = 0; i < this.diyArr.length; i++) {
        if (this.diyArr[i].text == "") {
          this.tsetItem = this.diyArr[i];
          this.tsetItem.isAddInput = true;
          return;
        }
      }
    },
    delurltext(item) {
      item.text = "";
      updateDiy({ ["url" + item.id]: item.text }).then(() => {
        item.isEdits = false;
        this.showPanel();
      });
    },
    editChange(item) {
      if (item.text.length <= 0) {
        this.delurltext(item);
      }
      updateDiy({ ["url" + item.id]: item.text }).then(() => {
        item.isEdits = false;
        item.isAddInput = false;
        this.showPanel();
      });
    },
    editChanges(ItemIndex0) {
      console.log("视角");
      updateDiy({ ["url" + 1]: ItemIndex0.text }).then(() => {
        ItemIndex0.isEdits = false;
        ItemIndex0.isAddInput = false;
        this.ItemIndex0.text = "";
        this.showPanel();
      });
    },
    EditnickName() {
      this.isEdit = true;
      setTimeout(() => {
        this.$refs.editnickNameRef.focus();
      }, 0);
    },
    close() {
      this.isEdit = false;
    },
    changenickName() {
      if (!this.nameShow) {
        // 去除首尾空格
        this.registerForm.nick_name = this.registerForm.nick_name.trim();
        console.log(this.registerForm.nick_name, 194);
        changeName({ nickName: this.registerForm.nick_name }).then(() => {
          this.$store.dispatch("user/getUserInfo").catch((e) => {
            console.log(e);
            this.$message({
              message: this.$t("setting.changeNickNameSucess"),
              type: "success",
            });
          });
          this.handleClose();
          this.isEdit = false;
        });
      }
    },
    handleClose() {
      this.$emit("handleClose");
    },
    handleBeforeImgUpload(file) {
      const isJPG = file.type.includes("image");
      if (!isJPG) {
        this.$message.error(this.$t("design.onlyImg"));
      }
      return isJPG;
    },
    handleImgUploadSuccess() {
      this.$store.dispatch("user/getUserInfo").catch((e) => {
        console.log(e);
      });
      this.$message.success(this.$t("design.uploadSuccess"));
    },
    handleImgUploadErr(err) {
      this.$message.error(this.$t("design.uploadFail") + err);
    },
    // 确认按钮
    onSubmit: function () {
      console.log("确认");
      setTimeout(() => {
        if (!this.rulesShow) {
          console.log(this.form, 558);
          updateProfileList(this.form).then(() => {
            this.$message({
              message: this.$t("Modified successfully"),
              type: "success",
            });
          });
          return;
        }
        this.$message({
          message: this.$t("Link validation failed"),
          type: "error",
        });
      }, 1000);
    },
  },
};
</script>

<style scoped lang="scss">
.Profile {
  width: 1200px;
  height: 1594px;
  background: #ffffff;
  border-radius: 8px;
}
.Profilehead {
  padding-top: 34px;
  margin-left: 36px;
  // width: 61px;
  // height: 17px;
  font-size: 20px;

  font-weight: 500;
  color: #1a1a1a;
}
::v-deep .el-dialog__header {
  text-align: center;
}
::v-deep .el-divider--horizontal {
  width: 1144px;
  height: 1px;
  background: #e6e6e6;
  margin: 17px 0 17px 32px;
}
::v-deep .divider {
  width: 912px;
  height: 1px;
  background: #e6e6e6;
  margin-left: 120px;
}
::v-deep .el-form-item {
  margin-bottom: 23px;
}
::v-deep .el-button--primary {
  width: 136px;
  height: 56px;
  border-radius: 8px;
}
.name {
  display: flex;
  justify-content: center;
  ::v-deep .el-form-item__error {
    margin-left: 56px;
  }
}
.img {
  margin-top: 31px;
  width: 120px;
  height: 119px;
  margin-left: 535px;
  border-radius: 50%;
}
.upload-demo {
  position: absolute;
  top: 126px;
  left: 535px;
  background-color: black;
  line-height: 119px;
  color: white;
  opacity: 0;
  display: inline-block;
  width: 120px;
  height: 119px;
  border-radius: 50%;
  // overflow: hidden;

  ::v-deep .el-upload--text {
    width: 120px;
    height: 119px;
    cursor: pointer;
    border-radius: 50%;
  }
}
::v-deep .el-textarea .el-input__count {
  right: 25px;
  bottom: 1px;
}
.imgEdit {
  position: absolute;
  top: 126px;
  left: 535px;
  font-size: 0px;
  line-height: 119px;
  text-align: center;
  color: white;
  width: 120px;
  height: 119px;
  border-radius: 50%;
  cursor: pointer;
  // pointer-events: none;
  // display: none;
}
.imgEdit:hover {
  position: absolute;
  top: 126px;
  left: 535px;
  font-size: 36px;
  line-height: 119px;
  text-align: center;
  color: white;
  width: 120px;
  height: 119px;
  border-radius: 50%;
  background: #000;
  opacity: 0.4;
  cursor: pointer;
  pointer-events: none;
}
.svgicon {
  width: 32px;
  height: 31px;
}
.nickName {
  text-align: ce;
  font-size: 20px;
  cursor: pointer;

  font-weight: 500;
  color: #1a1a1a;
}
::v-deep .editnickName {
  width: 352px;
  height: 48px;
  font-size: 20px;
  // margin-left: 408px;
  border-radius: 6px;
  margin-right: 16px;
}
.closeButton {
  width: 40px;
  height: 40px;
  padding: 0px;
  font-size: 24px;
  border: 1px solid #cccccc;
  border-radius: 6px;
}
.changenickName {
  width: 40px;
  height: 40px;
  padding: 0px;
  font-size: 24px;
  background: #1278f3;
  color: #ffffff;
  border-radius: 6px;
}
.BASICINFO {
  margin-left: 123px;
  margin-top: 25px;
  font-size: 20px;

  font-weight: 500;
  color: #999999;
}
.Description {
  font-size: 16px;

  font-weight: 500;
  color: #1a1a1a;
}
.DescriptionInput {
  width: 912px;
  margin-top: 8px;
  margin-bottom: 38px;
}
.SOCIALPROFILES {
  margin-left: 122px;
  font-size: 20px;

  font-weight: 500;
  color: #999999;
}
.iconInput {
  width: 912px;
  display: block;
}
.CONTACTINFO {
  margin-left: 122px;
  font-size: 20px;

  font-weight: 500;
  color: #999999;
}
.items {
  margin-left: 120px;
  margin-top: 16px;
  width: 912px;
  height: 48px;
  background: #ffffff;
  border-radius: 6px;
}
.item {
  width: 810px;
  height: 48px;
  margin-bottom: 16px;
  background: #ffffff;
  border-radius: 6px;
  padding-left: 18px;
  line-height: 48px;
  font-size: 16px;

  font-weight: 400;
  border: 1px solid #cccccc;
}
.itemInput {
  width: 810px;
  margin-bottom: 18px;
}
::v-deep .el-input__inner {
  height: 48px;
}
::v-deep .el-textarea__inner {
  padding: 5px 53px 5px 15px;
}
.add {
  margin: 7px;
  width: 36px;
  height: 32px;
  line-height: 32px;
  background: #e8ebf4;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
}
.svgiconText {
  font-size: 16px;

  font-weight: 400;
  color: #1a1a1a;
}
.NoDesc {
  font-size: 14px;

  font-weight: 400;
  color: #cccccc !important;
}
.descHover:hover {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 6px;
  cursor: pointer;
}
.iconDelete {
  width: 32px;
  height: 32px;
  background: #ff5e5e;
  border-radius: 6px;
  color: #ffffff;
  margin: 7px;
  padding: 5px 7px 9px 8px;
  cursor: pointer;
}
</style>
