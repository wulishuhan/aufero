<template>
  <div class="app-header-wrapper">
    <div class="app-header-toolbar-navbar">
      <div class="toolbar">
        <div class="toolbar-menu">
          <ul>
            <li>
              <el-dropdown :hide-on-click="true" @command="selectLanguage">
                <span class="el-dropdown-link">
                  <span>|</span>
                  <i class="el-icon-help"></i>
                  <span>{{ language }}</span>
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="en">English</el-dropdown-item>
                  <el-dropdown-item command="zh">中文</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </li>
            <li class="alert">
              <el-popover
                trigger="hover"
                :visible-arrow="false"
                ref="notice-popover"
                popper-class="notice-popover"
                placement="bottom-end"
              >
                <NoticePanel @noticeClose="noticeClose"></NoticePanel>
                <el-button slot="reference">
                  <div class="toolbar-menu-item">
                    <span>|</span>
                    <span
                      class="dots"
                      v-show="
                        myNoticeCountList.length > 0 &&
                        myNoticeCountList.some((item) => item.count > 0)
                      "
                    ></span>
                    <i class="ortur-icon-alert"></i>
                    <span> {{ $t("header.message") }}</span>
                  </div>
                </el-button>
              </el-popover>
            </li>
          </ul>
        </div>
      </div>
      <div class="app-header navbar">
        <div class="app-header__content">
          <div class="app-header-left">
            <div class="app-header__logo">
              <router-link to="/main">
                <!-- <svg-icon icon-class="logo" class-name="logo"></svg-icon> -->
                <img src="@/assets/logo-800x250-light.png" class="logo" />
              </router-link>
            </div>

            <div class="app-header__navbar">
              <router-link to="/main">
                <el-button :class="$route.path == '/main' ? 'active' : ''">
                  <!-- Home -->
                  {{ $t("header.home") }}
                </el-button>
              </router-link>

              <router-link to="/community">
                <el-button :class="$route.path == '/community' ? 'active' : ''">
                  <!-- Community -->
                  {{ $t("header.community") }}
                </el-button>
              </router-link>
            </div>
          </div>
          <div class="app-header-right">
            <div class="app-header__search">
              <el-input
                :placeholder="$t('header.search')"
                prefix-icon="el-icon-search"
                v-model="keywords"
                class="el-input-search input-with-select"
                clearable
                @keyup.enter.native="search"
              >
              </el-input>
            </div>
            <ul class="app-header-dots" v-if="isLogin">
              <li>
                <router-link to="/upload">
                  <el-button class="el-btn-upload">
                    <span>{{ $t("header.upload") }}</span>
                    &nbsp;
                    <i class="el-icon-upload el-icon--right"></i>
                  </el-button>
                </router-link>
              </li>
              <li>
                <el-dropdown class="el-dropdown-userinfo">
                  <el-button>
                    <span>
                      <img :src="userInfo.avatar" />
                      <i
                        style="color: #aaa"
                        class="el-icon-arrow-down el-icon--right"
                      ></i>
                    </span>
                  </el-button>
                  <el-dropdown-menu
                    slot="dropdown"
                    class="el-dropdown-menu-userinfo"
                  >
                    <el-dropdown-item class="header-userinfo">
                      <div class="header-avatar">
                        <img :src="userInfo.avatar" />
                      </div>
                      <div
                        class="username-and-email"
                        :title="userInfo.nick_name"
                      >
                        <span class="username">{{ userInfo.nick_name }}</span>
                        <span class="email">{{ userInfo.email }}</span>
                      </div>
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleProfileClick">
                      <svg-icon icon-class="Vector" class-name="Vector-icon">
                      </svg-icon
                      >&nbsp;
                      {{ $t("header.profile") }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="handleShowProfile">
                      <svg-icon
                        icon-class="Vector-1"
                        class-name="Vector-1-icon"
                      ></svg-icon
                      >&nbsp;
                      {{ $t("header.setting") }}
                    </el-dropdown-item>
                    <el-dropdown-item @click.native="logout">
                      <svg-icon
                        icon-class="Vector-2"
                        class-name="Vector-2-icon"
                      ></svg-icon
                      >&nbsp; {{ $t("header.logout") }}
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </li>
            </ul>

            <ul class="app-header-nologin" v-else>
              <li>
                <el-button @click="showLoginDialog('login')">
                  {{ $t("header.logIn") }}
                </el-button>
              </li>
              <li>
                <el-button @click="showLoginDialog('register')">
                  {{ $t("header.signUp") }}
                </el-button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <login
      :loadLoginDialog="isLoginForm"
      :visible.sync="loginDialogVisible"
      :openLoginInfo="openLoginInfo"
      @handleClose="handleCloseDialog"
    ></login>
    <settingPanel ref="settingPanel"></settingPanel>
  </div>
</template>

<script>
import Login from "@/components/Login";
import NoticePanel from "@/components/NoticePanel";
import settingPanel from "@/components/settingPanel";
import { getLanguage } from "@/utils/common.js";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");
export default {
  data() {
    return {
      showDot: false,
      keywords: "",
      select: "",
      isThirdPartyRegisterForm: false,
      thirdPartyInfo: {
        id: "",
        catalog: "",
        email: "",
        name: "",
      },
      openLoginInfo: 0,
      language: "",
    };
  },
  components: {
    Login,
    NoticePanel,
    settingPanel,
  },
  computed: {
    ...mapState([
      "accessToken",
      "expiresIn",
      "userInfo",
      "isLogin",
      "loginDialogVisible",
      "isLoginForm",
      "myNoticeCountList",
    ]),
  },
  mounted() {
    this.language = getLanguage(this.$i18n.locale);
    window.addEventListener("scroll", () => {
      var sl = -Math.max(
        document.body.scrollLeft,
        document.documentElement.scrollLeft
      ); // 获取滑动距离
      document.querySelector(".app-header-toolbar-navbar").style.left =
        sl + "px"; // 设置元素的偏离距离
    });
    if (this.$route.hash == "#register") {
      let payload = { loginDialogVisible: true, formType: "register" };

      this.$store.dispatch("user/switchLoginRegisteForm", payload);
    }

    if (this.$route.hash == "#reset-password") {
      let payload = { loginDialogVisible: true, formType: "reset-passwored" };
      this.$store.dispatch("user/switchLoginRegisteForm", payload);
      this.$store.dispatch("user/openResetPasswordForm");
    }
    this.$store.dispatch("user/getMyFollowingList", {
      userId: this.userInfo.user_id,
    });
    this.$store.dispatch("user/getMyLikesList", {
      userId: this.userInfo.user_id,
    });
    this.$store.dispatch("user/getMyCollectionList", {
      userId: this.userInfo.user_id,
    });
  },
  methods: {
    casdoorLogin() {
      window.location.href = this.getSigninUrl();
    },
    casdoorSingup() {
      window.location.href = this.getSignupUrl();
    },
    search() {
      this.$router
        .push({
          path: "/search",
          query: { w: this.keywords },
        })
        .catch(() => {});
      this.keywords = "";
    },
    handleProfileClick() {
      this.$router.push({ path: "/design/fromProfile" });
    },
    handleShowProfile() {
      this.$router.push({ path: "/Setting" });
    },

    selectLanguage(lang) {
      this.language = getLanguage(lang);
      this.$i18n.locale = lang;
      localStorage.setItem("lang", lang);
    },

    showLoginDialog(view) {
      // localStorage.setItem("casdoorUrl", this.$route.path);
      // if (view == "login") {
      //   this.casdoorLogin();
      // } else {
      //   this.casdoorSingup();
      // }
      // // let payload = { loginDialogVisible: true, formType: view };
      // // this.$store.dispatch("user/switchLoginRegisteForm", payload);
      // // window.location.href = this.getSigninUrl();
      let payload = {
        loginDialogVisible: true,
        isLoginForm: false,
        formType: view,
      };
      if (view == "login") {
        payload.isLoginForm = true;
      }
      this.$store.dispatch("user/switchLoginRegisteForm", payload);
    },
    logout() {
      this.$store.dispatch("user/logout");
      this.$router.push("/");
    },
    handleCloseDialog() {
      let { code, from, email } = this.$route.query;
      if (code && from && email) {
        this.$router.push(this.$route.path);
      }
      this.isThirdPartyRegisterForm = false;
      this.openLoginInfo = 0;
      this.$store.dispatch("user/closeLoginRegisteForm");
    },
    noticeClose() {
      this.$refs["notice-popover"].doClose();
    },
  },
};
</script>

<style lang="scss" scoped>
.app-header-wrapper {
  width: 100%;
  height: 88px;
}
.app-header-toolbar-navbar {
  width: 100%;
  position: fixed;
  z-index: 10;
  min-width: 1440px;
}
.toolbar {
  background: #1e78f0;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  .toolbar-menu {
    max-width: 1640px;
    min-width: 1440px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    ul {
      width: 200px;
      margin-right: 40px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      color: #fff;

      .el-dropdown {
        width: 90px;
        font-size: 12px;
        color: #fff;
        cursor: pointer;

        .el-dropdown-link {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
      }

      .toolbar-menu-item {
        width: 85px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
.app-header {
  background: #fff;
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  align-content: center;
  color: #333;
  transition: all 0.2s;
  .logo {
    width: 100px;
    object-fit: contain;
    // height: 80px;
    height: 40px;
  }
  // overflow: hidden;
  .app-header__content {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 1640px;
    height: 100%;
    margin: 0 auto;
    justify-content: space-between;
    .app-header-left {
      display: flex;
      align-items: center;
      width: 828px;
      .app-header__logo {
        font-size: 18px;
      }

      .app-header__navbar {
        margin-left: 40px;
        width: 150px;
        display: flex;
        justify-content: space-between;
        .el-button {
          color: #999;
        }

        .el-button.active {
          color: #333;
        }
      }
    }

    .app-header-right {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 600px;
      .app-header__search {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        .el-input-search {
          width: 300px;

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
      ul.app-header-dots {
        list-style-type: none;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        li + li {
          margin-left: 50px;
        }
        .el-dropdown-link {
          cursor: pointer;
          color: #fff;
        }

        .el-dropdown {
          .el-button {
            border: none;
          }
          span {
            display: flex;
            align-items: center;
            img {
              border-radius: 50%;
              width: 40px;
              height: 40px;
            }
            .el-icon-arrow-down {
              font-size: 12px;
              font-weight: 20px;
              margin-right: 10px;
            }
          }
        }
        .el-btn-upload {
          width: 110px;
          color: #333;
          .el-icon-upload {
            font-size: 20px;
          }
        }
      }
      ul.app-header-nologin {
        width: 120px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .el-button {
          border: none;
          background: none;
          color: #333;
          font-size: 14px;
        }
        .el-btn-upload {
          width: 90px;
          background: #88bbf3;
        }
      }
    }
  }
}

.el-button {
  border: none;
  background: none;
  color: #fff;
  font-size: 14px;
  padding: unset;
}

.alert {
  font-size: 12px;
  .dots {
    width: 5px;
    height: 5px;
    position: relative;
    left: -5px;
    border-radius: 50%;
    background: #ff6161;
  }
  .ortur-icon-alert {
    color: #fff;
    font-size: 14px;
  }
  .el-button {
    font-size: 12px;
  }
}

.app-header.header-shadow {
  box-shadow: 0 0.46875rem 2.1875rem rgb(4 9 20 / 3%),
    0 0.9375rem 1.40625rem rgb(4 9 20 / 3%),
    0 0.25rem 0.53125rem rgb(4 9 20 / 5%), 0 0.125rem 0.1875rem rgb(4 9 20 / 3%);
}
.el-dropdown-menu-userinfo {
  width: 240px;
  li {
    height: 50px;
    line-height: 50px;
    width: 95%;
    margin: 0 auto;
    border-radius: 8px;
  }
  li:hover {
    background: #8ab5ef;
    color: #f0f3fa;
    .Vector-icon {
      font-size: 20px;
      color: #f0f3fa;
      fill: #8ab5ef;
      stroke: #f0f3fa;
    }
    .Vector-1-icon {
      font-size: 20px;
      color: #f0f3fa;
      fill: #8ab5ef;
      stroke: #f0f3fa;
    }
    .Vector-2-icon {
      font-size: 20px;
      color: #f0f3fa;
      fill: #8ab5ef;
      stroke: #f0f3fa;
    }
  }
  .Vector-icon {
    font-size: 20px;
    color: #1a1a1a;
    fill: #fff;
    stroke: #1a1a1a;
  }
  .Vector-1-icon {
    font-size: 20px;
    color: #1a1a1a;
    fill: #fff;
    stroke: #1a1a1a;
  }
  .Vector-2-icon {
    font-size: 20px;
    color: #1a1a1a;
    fill: #fff;
    stroke: #1a1a1a;
  }
  .header-userinfo {
    width: 100%;
    height: 58px;
    display: flex;
    align-items: center;
    .header-avatar img {
      border-radius: 50%;
      overflow: hidden;
      vertical-align: middle;
      width: 40px;
      height: 40px;
    }
    .username-and-email {
      overflow: hidden;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      height: 100%;
      justify-content: space-around;
      .username {
        font-weight: 500;
        font-size: 16px;
        color: #333;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        line-height: 20px;
      }
      .email {
        font-size: 12px;
        line-height: 14px;
        color: #aaa;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
      }
    }
  }
  .header-userinfo:hover {
    background: unset !important;
  }
}
</style>
