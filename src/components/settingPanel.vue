<template>
  <div>
    <el-dialog :visible.sync="dialogFollowersVisible" class="followDialog">
      <el-tabs
        v-model="activeTab"
        @tab-click="handleFollowTapClick"
        class="tabsContent"
      >
        <el-tab-pane
          :label="$t('design.Account')"
          name="first"
          class="followTapPanel"
        >
          <div class="wrapper">
            <div class="left" style="margin-right: 63px">
              <img class="img" alt="" :src="userInfo.avatar" />
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
                <span slot="trigger" class="choose">
                  {{ $t("design.chooseImg") }}
                </span>
              </el-upload>
            </div>
            <div class="right">
              <div class="top">
                <div class="title">{{ $t("design.name") }}</div>
                <div class="name">{{ userInfo.nick_name }}</div>
                <div class="action" @click="handleChangeNameClick">
                  {{ $t("setting.changeName") }}
                </div>
              </div>
              <div class="center">
                <div class="title">{{ $t("design.email") }}</div>
                <div class="email">
                  <div class="name">{{ userInfo.email }}</div>
                  <div class="verify">
                    <el-button
                      type="text"
                      v-show="this.email_active !== '1'"
                      @click="test(email_active)"
                      >Activate now</el-button
                    >
                  </div>
                </div>
                <div class="action" @click="handleChangeEmailClick">
                  {{ $t("setting.changeEmail") }}
                </div>
              </div>
              <div class="bottom">
                <div class="title">{{ $t("design.password") }}</div>
                <div class="name"></div>
                <div class="action" @click="handleChangePasswordClick">
                  {{ $t("setting.changePassword") }}
                </div>
              </div>
              <div class="border"></div>

              <div class="binding" v-show="this.email_active == '1'">
                <div
                  style="
                    font-size: 16px;

                    font-weight: 400;
                    color: #999999;
                    margin-bottom: 30px;
                  "
                >
                  {{ $t("design.accountBinding") }}
                </div>
                <div
                  class="bindItem"
                  v-for="item in bindingInfo"
                  :key="item.id"
                >
                  <div class="left">
                    <span
                      v-if="
                        item.switch1 &&
                        item.catalog !== 'tiktok' &&
                        item.catalog !== 'google'
                      "
                      class="icon"
                      :class="item.iconClassLight"
                    ></span>
                    <span
                      v-if="item.switch1 && item.catalog == 'tiktok'"
                      class="ortur-icon-tiktok-light icon"
                      ><span class="path1"></span><span class="path2"></span
                      ><span class="path3"></span
                    ></span>
                    <span
                      v-if="item.switch1 && item.catalog == 'google'"
                      class="ortur-icon-google-light icon"
                      ><span class="path1"></span><span class="path2"></span
                      ><span class="path3"></span><span class="path4"></span
                    ></span>
                    <span
                      v-else-if="!item.switch1"
                      class="icon"
                      :class="item.iconClass"
                    ></span>
                    <div class="textspan">
                      <span>{{ item.catalog }}</span>
                      <el-tooltip
                        effect="light"
                        placement="bottom"
                        v-if="item.username != ''"
                      >
                        <div slot="content">
                          {{ item.username }}
                        </div>
                        <span class="username">{{
                          item.username ? item.username : ""
                        }}</span>
                      </el-tooltip>
                      <span v-show="item.username && item.email">|</span>
                      <el-tooltip
                        effect="light"
                        placement="bottom"
                        v-if="item.email != ''"
                      >
                        <div slot="content">
                          {{ item.email }}
                        </div>
                        <span class="email" v-if="!item.email">{{
                          item.email
                        }}</span>
                      </el-tooltip>
                    </div>
                  </div>
                  <div class="right">
                    <el-switch
                      v-model="item.switch1"
                      @change="handleSwitch1Change(item.switch1, item)"
                    >
                    </el-switch>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <!-- <el-tab-pane
          :label="$t('design.private')"
          name="second"
          class="followTapPanel"
        >
          222
        </el-tab-pane> -->
      </el-tabs>
      <!-- 發送郵箱提醒 -->
      <el-dialog
        width="400px"
        title="Verify your email"
        :visible.sync="SendVisible"
        append-to-body
        @closed="close"
      >
        <span>We'll sent an email to {{ userInfo.email }} </span>
        <br />
        <span>with veerify your email.</span>
        <br />
        <br />
        <el-button class="Send">Send email</el-button>
      </el-dialog>
      <!-- 驗證郵箱未過期 -->
      <el-dialog
        width="400px"
        title="Verify your email"
        :visible.sync="verifyVisible"
        append-to-body
        @closed="close"
      >
        <span style="font-size: 17px"
          >Click the verifcation link in the email we sent to
          {{ userInfo.email }}. This helps keep your account secure.
        </span>
        <br />
        <span style="font-size: 17px"
          >No email in your inbox or spam folder?</span
        >
        <br />
        <br />
        <a
          style="color: rgb(4, 136, 251); cursor: pointer"
          @click="sendEmail(userInfo.email)"
        >
          Let's resend it.
        </a>
      </el-dialog>
      <!-- 驗證郵箱已過期 -->
      <el-dialog
        width="400px"
        title="Verify your email"
        :visible.sync="ResendVisible"
        append-to-body
        @closed="close"
      >
        <span
          >Your verifcation email has expried, please reaend the verifcation
          email</span
        >
        <br />
        <br />
        <el-button class="Resend">Resend verifcation email</el-button>
      </el-dialog>
    </el-dialog>
    <ChangeEmailPassword
      @handleClose="isChangePasswordVisible = false"
      :visible="isChangePasswordVisible"
      :ChangePasswordOrEmail="ChangePasswordOrEmail"
      :email="userInfo.email"
    ></ChangeEmailPassword>
    <ChangeName
      @handleClose="isChangeNameVisible = false"
      :visible="isChangeNameVisible"
    ></ChangeName>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");
import { getToken } from "@/utils/auth";
import ChangeEmailPassword from "@/components/ChangeEmailPassword.vue";
import ChangeName from "@/components/ChangeName.vue";
import { unbindThird, getUserInfo, activeUserSendEmail } from "@/api/user";

export default {
  components: {
    ChangeEmailPassword,
    ChangeName,
  },
  data() {
    return {
      SendVisible: false,
      verifyVisible: false,
      ResendVisible: false,
      email_active: "",
      third_user: [],
      isChangeNameVisible: false,
      ChangePasswordOrEmail: false,
      isChangePasswordVisible: false,
      bindingInfo: {
        facebook: {
          catalog: "facebook",
          switch1: false,
          username: "",
          email: "",
          user_id: "",
          iconClassLight: "ortur-icon-facebook-light",
          iconClass: "ortur-icon-facebook",
        },
        github: {
          catalog: "github",
          user_id: "",
          switch1: false,
          username: "",
          email: "",
          iconClassLight: "ortur-icon-github-light",
          iconClass: "ortur-icon-github",
        },
        google: {
          catalog: "google",
          user_id: "",
          switch1: false,
          username: "",
          email: "",
          iconClassLight: "ortur-icon-google-light",
          iconClass: "ortur-icon-google",
        },
        // whatsApp: {
        //   catalog: "whatsApp",
        //   user_id: "",
        //   switch1: false,
        //   username: "",
        //   email: "",
        //   iconClassLight: "ortur-icon-whatsapp-light",
        //   iconClass: "ortur-icon-whats-app",
        // },
        twitter: {
          catalog: "twitter",
          user_id: "",
          switch1: false,
          username: "",
          email: "",
          iconClassLight: "ortur-icon-twitter-light",
          iconClass: "ortur-icon-twitter",
        },
        tiktok: {
          catalog: "tiktok",
          user_id: "",
          switch1: false,
          username: "",
          email: "",
          iconClassLight: "ortur-icon-tiktok-light",
          iconClass: "ortur-icon-tiktok",
        },
      },

      dialogFollowersVisible: false,
      activeTab: "first",
      headers: {
        Authorization: getToken(),
      },
    };
  },
  mounted() {
    // getUserInfo().then((e) => {
    //   this.third_user = e.data.data.third_user;
    // });
  },

  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    // 關閉彈窗，刷新頁面數據
    close() {
      this.showPanel();
      this.verifyVisible = false;
    },
    // 判定狀態，打開對應的彈窗
    test(email_active) {
      if (email_active == "0") {
        this.verifyVisible = true;
      } else {
        if (email_active == "2") {
          this.SendVisible = true;
        } else {
          this.ResendVisible = true;
        }
      }
    },
    //驗證郵箱未過期時發送驗證
    sendEmail(email) {
      // this.close();
      activeUserSendEmail({
        email: email,
      }).then((res) => {
        console.log(res);
        this.$message.success("send email successfully");
      });
    },
    thirdPartyLogin(from) {
      let redirectUrl = window.location.href.split("?")[0];
      window.location.href = `https://sso.leadiffer.com/oauth/thirdParty?from=${from}&redirect_url=${redirectUrl}`;
    },
    handleSwitch1Change(willBind, item) {
      if (willBind) {
        sessionStorage.setItem("isBinding", 1);
        console.log(sessionStorage.getItem("isBinding"));
        this.thirdPartyLogin(item.catalog);
        // item.switch1 = false;
      } else {
        unbindThird({ userId: item.user_id, catalog: item.catalog })
          .then(() => {
            this.$message({
              message: this.$t("unbindThird successfully"),
              type: "success",
            });
          })
          .catch(() => {
            this.$message("unbindThird fail");
            item.switch1 = true;
          });
      }
    },
    handleChangeNameClick() {
      this.isChangeNameVisible = true;
    },
    handleChangeEmailClick() {
      this.ChangePasswordOrEmail = true;
      this.isChangePasswordVisible = true;
    },
    handleChangePasswordClick() {
      this.ChangePasswordOrEmail = false;
      this.isChangePasswordVisible = true;
    },
    handleFollowTapClick() {
      getUserInfo().then((res) => {
        getUserInfo.email_active = res.data.data.email_active;
        console.log(res.data.data.email_active);
      });
    },
    showPanel() {
      getUserInfo().then((res) => {
        this.third_user = res.data.data.third_user;
        this.email_active = res.data.data.email_active;
        // console.log(this.email_active, 407);
        for (const item of this.third_user) {
          if (item.catalog) {
            this.bindingInfo[item.catalog].switch1 = true;
            this.bindingInfo[item.catalog].user_id = item.user_id;
            this.bindingInfo[item.catalog].email = item.email;
            this.bindingInfo[item.catalog].username = item.username;
            this.bindingInfo[item.catalog].catalog = item.catalog;
          }
        }
        this.headers.Authorization = getToken();
        this.dialogFollowersVisible = true;
      });
    },
    handleBeforeImgUpload(file) {
      const isJPG = file.type.includes("image");
      // const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error(this.$t("design.onlyImg"));
      }
      // if (!isLt1M) {
      //   this.$message.error("上传头像图片大小不能超过 1MB!");
      // }
      return isJPG;
    },

    handleImgUploadErr(err) {
      //console.log(e)
      this.$message.error(this.$t("design.uploadFail") + err);
    },
    handleImgUploadSuccess() {
      this.$store.dispatch("user/getUserInfo").catch((e) => {
        console.log(e);
      });
      this.$message.success(this.$t("design.uploadSuccess"));
    },
  },
};
</script>

<style scoped lang="scss">
::v-deep .el-dialog__header {
  text-align: center;
}
::v-deep .el-dialog {
  border-radius: 15px;
}
::v-deep .el-dialog__title {
  font-size: 24px;
}
::v-deep .el-dialog__header {
  padding-top: 40px;
}
::v-deep .el-dialog__body {
  padding: 0 35px 50px;
}
::v-deep .el-button--text {
  color: #fff;
}
::v-deep .el-button {
  padding: 4px 10px;
}
::v-deep .Send {
  font-size: 35px;
  text-align: center;
  background: #000;
  color: #fff;
  padding: 5px 50px;
  margin: 10px 25px;
}
::v-deep .Resend {
  font-size: 23px;
  text-align: center;
  background: #000;
  color: #fff;
  padding: 5px 20px;
  margin: 1px 20px;
}
.binding {
  border-top: 1px solid #ccc;
  margin-top: 20px;
  padding-top: 20px;
  width: 410px;
  .bindItem {
    display: flex;
    justify-content: space-between;
    margin-bottom: 21px;
    .left {
      display: flex;
      flex-direction: row;
      .icon {
        margin-right: 18px;
        font-size: 26px;
        width: 30px;
        height: 26px;
      }
      .textspan {
        display: flex;
        width: 311px;
        height: 19px;
        margin-right: 32px;
        font-size: 16px;
        .username {
          flex: 3;
          margin: 0 10px 0 28px;
          color: rgb(153, 153, 153);
          /* 1.溢出隐藏 */
          overflow: hidden;
          /* 2.用省略号来代替超出文本 */
          text-overflow: ellipsis;
          /* 3.设置盒子属性为-webkit-box  必须的 */
          display: -webkit-box;
          /* 4.-webkit-line-clamp 设置为2，表示超出2行的部分显示省略号，如果设置为3，那么就是超出3行部分显示省略号 */
          -webkit-line-clamp: 1;
        }
        .email {
          flex: 2;
          margin-left: 10px;
          color: rgb(153, 153, 153);
          /* 1.溢出隐藏 */
          overflow: hidden;
          /* 2.用省略号来代替超出文本 */
          text-overflow: ellipsis;
          /* 3.设置盒子属性为-webkit-box  必须的 */
          display: -webkit-box;
          /* 4.-webkit-line-clamp 设置为2，表示超出2行的部分显示省略号，如果设置为3，那么就是超出3行部分显示省略号 */
          -webkit-line-clamp: 1;
        }
      }
    }
    .right {
    }
  }
}
.followDialog {
  ::v-deep .el-dialog {
    width: 816px;
    background: #ffffff;
    border-radius: 20px;
    .el-dialog__header {
      padding: 10px;
    }
  }
  ::v-deep.el-tabs__nav-wrap::after {
    background: #ffffff;
  }
  ::v-deep .tabsContent {
    top: -165px;
    padding: 0 64px;
  }
  ::v-deep .el-dialog__body {
    padding: 0 0 30px 0;
  }
  top: -115px;
}
.wrapper {
  width: 100%;
  text-align: left;
  box-sizing: border-box;
  display: flex;
  /* justify-content: space-around; */
}

.left {
  display: flex;
  align-items: center;
  flex-direction: column;
  .upload-demo {
    margin-top: 10px;
    .choose {
      font-size: 16px;

      font-weight: 500;
      color: #999999;
    }
  }
  .img {
    margin-top: 10px;
    width: 129px;
    height: 129px;
    border-radius: 50%;
  }
}
.right {
  .top {
  }
  .center {
    margin-top: 62px;
  }
  .bottom {
    margin-top: 62px;
  }
  .title {
    font-size: 16px;

    font-weight: 400;
    color: #999999;
  }
  .name {
    font-size: 16px;

    font-weight: 400;
    color: #1a1a1a;
  }
  .action {
    font-size: 16px;

    font-weight: 400;
    color: #1e78f0;
    margin-top: 15px;
    cursor: pointer;
  }
  .email {
    display: flex;
    margin-top: 15px;
  }
  .verify {
    font-size: 12px;

    background-color: red;
    color: #ccc;
    margin-left: 20px;
    border-radius: 2px;
  }
}
</style>
