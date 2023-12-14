<template>
  <div class="manage">
    <div class="followDialog">
      <div class="Manageaccoun">{{ $t("profile.Manage account") }}</div>
      <el-divider></el-divider>
      <div class="managebody">
        <div>
          <div class="ACCOUNTSECURITY">{{ $t("profile.ACCOUNT BINDING") }}</div>
          <el-divider class="divider"></el-divider>
          <div>
            <div class="Email">
              {{ $t("profile.Email") }}
              <div class="verify" v-if="verifyButton">
                <el-button
                  style="
                    line-height: 22px;
                    color: #ff6161;
                    text-decoration: underline;
                  "
                  type="text"
                  @click="test(email_active)"
                  >{{ $t("profile.Activate now") }}</el-button
                >
              </div>
            </div>
            <div style="display: flex; justify-content: space-between">
              <div class="change">
                <div class="lefts">{{ userInfo.email }}</div>
                <div class="rights" @click="handleChangeEmailClick">
                  {{ $t("profile.change") }}
                </div>
              </div>
            </div>
            <div class="password">{{ $t("profile.password") }}</div>
            <div class="change">
              <div class="lefts">•••••••••</div>
              <div class="rights" @click="handleChangePasswordClick">
                {{ $t("profile.change") }}
              </div>
            </div>
          </div>
        </div>
        <div v-if="!verifyButton">
          <div class="ACCOUNTBINDING">{{ $t("profile.ACCOUNT BINDING") }}</div>
          <el-divider class="divider"></el-divider>
          <div class="bindItem" v-for="item in bindingInfo" :key="item.id">
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
                  placement="bottom-start"
                  :open-delay="1000"
                  :visible-arrow="false"
                  v-if="item.username !== ''"
                >
                  <div slot="content">
                    {{ item.username }}
                  </div>
                  <span class="username">{{
                    item.username ? item.username : ""
                  }}</span>
                </el-tooltip>
                <span
                  v-show="
                    item.username != 'null' &&
                    item.email != 'null' &&
                    item.switch1
                  "
                  >|</span
                >
                <el-tooltip
                  effect="light"
                  placement="bottom-start"
                  :open-delay="1000"
                  :visible-arrow="false"
                  v-if="item.email !== ''"
                >
                  <div slot="content">
                    {{ item.email }}
                  </div>
                  <span class="email">{{ item.email }}</span>
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
        <!-- 發送郵箱提醒 -->
        <el-dialog
          width="528px"
          title="Verify your email"
          :visible.sync="SendVisible"
          append-to-body
          @closed="close"
        >
          <span
            >{{ $t("profile.We'll sent an email to") }} {{ userInfo.email }}
          </span>
          <br />
          <span>{{ $t("profile.with veerify your email.") }}</span>
          <br />
          <br />
          <el-button class="Send">{{ $t("profile.Send email") }}</el-button>
        </el-dialog>
        <!-- 驗證郵箱未過期 -->
        <el-dialog
          width="528px"
          :visible.sync="verifyVisible"
          append-to-body
          @closed="close"
        >
          <div
            style="
              font-size: 24px;

              font-weight: 500;
              color: #141414;
              line-height: 48px;
              text-align: center;
            "
          >
            {{ $t("profile.Verify your email") }}
          </div>
          <span
            style="
              font-size: 16px;

              font-weight: 400;
              color: #1a1a1a;
              line-height: 24px;
            "
            >{{
              $t("profile.Click the verifcation link in the email we sent to")
            }}
            {{ userInfo.email }}.
            {{ $t("profile.This helps keep your account secure.") }}
          </span>
          <br />
          <span
            style="
              font-size: 16px;

              font-weight: 400;
              color: #1a1a1a;
              line-height: 24px;
            "
            >{{ $t("profile.No email in your inbox or spam folder?") }}</span
          >
          <br />
          <br />
          <a
            style="color: rgb(4, 136, 251); cursor: pointer"
            @click="sendEmail(userInfo.email)"
          >
            {{ $t("profile.Let's resend it.") }}
          </a>
        </el-dialog>
        <!-- 驗證郵箱已過期 -->
        <el-dialog
          width="528px"
          title="Verify your email"
          :visible.sync="ResendVisible"
          append-to-body
          @closed="close"
        >
          <span>{{
            $t(
              "profile.Your verifcation email has expried, please reaend the verifcation email"
            )
          }}</span>
          <br />
          <br />
          <el-button class="Resend">{{
            $t("profile.Resend verifcation email")
          }}</el-button>
        </el-dialog>
      </div>
    </div>
    <ChangeEmailPassword
      @handleClose="isChangePasswordVisible = false"
      :visible="isChangePasswordVisible"
      :ChangePasswordOrEmail="ChangePasswordOrEmail"
      :email="userInfo.email"
    ></ChangeEmailPassword>
  </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");
import { getToken } from "@/utils/auth";
import ChangeEmailPassword from "@/components/ChangeEmailPassword.vue";
import { unbindThird, getUserInfo, activeUserSendEmail } from "@/api/user";

export default {
  components: {
    ChangeEmailPassword,
  },
  data() {
    return {
      verifyButton: false,
      SendVisible: false,
      verifyVisible: false,
      ResendVisible: false,
      email_active: "",
      third_user: [],
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
    this.showPanel();
    console.log("active:", this.$route.params.name);
    this.name = this.$route.params.name;
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
    handleChangeEmailClick() {
      this.ChangePasswordOrEmail = true;
      this.isChangePasswordVisible = true;
    },
    handleChangePasswordClick() {
      this.ChangePasswordOrEmail = false;
      this.isChangePasswordVisible = true;
    },
    // handleFollowTapClick() {
    //   getUserInfo().then((res) => {
    //     getUserInfo.email_active = res.data.data.email_active;
    //     console.log(this.email_active,);
    //   });
    // },
    showPanel() {
      getUserInfo().then((res) => {
        this.third_user = res.data.data.third_user;
        this.email_active = res.data.data.email_active;
        if (this.email_active != 1) {
          this.verifyButton = true;
        }
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
      if (!isJPG) {
        this.$message.error(this.$t("design.onlyImg"));
      }
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
.manage {
  padding-top: 36px;
  width: 1200px;
  height: 1562px;
  background: #ffffff;
  border-radius: 8px;
}
::v-deep .el-tabs el-tabs--left {
  height: 100%;
}
::v-deep .el-divider--horizontal {
  width: 1144px;
  height: 1px;
  background: #e6e6e6;
  margin: 17px 0 17px 32px;
}
::v-deep .el-dialog__body {
  padding: 11px 53px 30px 53px;
}
::v-deep .el-dialog {
  border-radius: 10px;
}

::v-deep .divider {
  width: 912px;
  height: 1px;
  background: #e6e6e6;
  margin-left: 80px;
}
.bindItem {
  width: 910px;
  margin-left: 80px;
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
      width: 80px;
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
}
.managebody {
  margin: 10px 40px;
}
.change {
  margin: 17px 0 28px 80px;
  padding-left: 17px;
  padding-right: 17px;
  display: flex;
  justify-content: space-between;
  width: 912px;
  height: 48px;
  background: #ffffff;
  border: 1px solid #cccccc;
  border-radius: 6px;
}
.verify {
  margin-top: 17px;
  height: 47px;
  font-size: 12px;
  color: red;

  // background-color: red;
  margin-left: 20px;
  border-radius: 6px;
  display: inline;
}
.Manageaccoun {
  margin-left: 36px;
  font-size: 20px;

  font-weight: 500;
  color: #1a1a1a;
}
.ACCOUNTSECURITY {
  margin-left: 80px;
  margin-top: 45px;
  font-size: 20px;

  font-weight: 500;
  color: #999999;
}
.Email {
  margin-left: 80px;
  margin-top: 17px;
  font-size: 16px;

  font-weight: 500;
  color: #1a1a1a;
}
.lefts {
  line-height: 48px;
  height: 18px;
  font-size: 16px;

  font-weight: 400;
  color: #cccccc;
}
.rights {
  line-height: 48px;
  font-size: 16px;

  font-weight: 400;
  cursor: pointer;
  color: #1e78f0;
}
.password {
  margin-left: 80px;
  font-size: 16px;

  font-weight: 500;
  color: #1a1a1a;
}
.ACCOUNTBINDING {
  margin-top: 14px;
  margin-left: 80px;
  font-size: 20px;

  font-weight: 500;
  color: #999999;
}
h3 {
  margin: 20px 0 0 10px;
}
.thumb-example {
  width: 864px;
  margin-top: 20px;
  // background: #000;
}
.swiper-slide {
  background-size: cover;
  background-position: center;
}
.gallery-top {
  // height: 80% !important;
  height: 600px;
  width: 100%;
}
.gallery-thumbs {
  height: 20% !important;
  box-sizing: border-box;
  padding: 10px 0px;
  width: 864px;
  margin-left: 2px;
  .swiper-button-next {
    right: 0px;
  }
  .swiper-button-prev {
    left: 0px;
  }
  .swiper-button-next,
  .swiper-button-prev {
    background: #fff;
    width: 45px;
    text-align: center;
    height: 101px;
    top: 26%;
    div {
      margin-top: 30px;
      background: rgb(207, 205, 205);
      height: 45px;
      border-radius: 50%;
      img {
        margin: 7px 0 0 2px;
        width: 30px;
      }
    }
  }
  .swiper-button-next:hover div {
    background: rgb(189, 186, 186);
  }
  .swiper-button-prev:hover div {
    background: rgb(189, 186, 186);
  }
}
.gallery-thumbs .swiper-slide {
  width: 20%;
  height: 80px;
  // opacity: 0.4;
}
.gallery-thumbs .swiper-slide-active {
  border: 2px solid red;
}
</style>
