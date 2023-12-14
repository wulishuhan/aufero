<template>
  <div>
    <el-dialog
      :width="
        formType == 'third-register' || formType == 'third-register-bind'
          ? '828px'
          : '528px'
      "
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      append-to-body
    >
      <!-- <div v-show="formType == 'login'" style="">
        <el-button @click="casdoorLogin" style="width: 100%; height: 40px">
          login
        </el-button>
        <el-button
          @click="casdoorSingup"
          style="width: 100%; height: 40px; margin-left: 0px; margin-top: 5px"
        >
          singup
        </el-button>
      </div>
      <div v-show="formType == 'register'" style="display: flex">
        <el-button @click="casdoorLogin">login</el-button>
        <el-button @click="casdoorSingup">singup</el-button>
      </div> -->
      <div v-show="!verifyEmailDialogVisible">
        <!-- 注册表单 -->
        <div v-show="formType == 'register'">
          <el-form :model="registerForm" :rules="rules" ref="registerForm">
            <el-form-item>
              <div class="continue-with">Continue with</div>
              <div class="icon-box">
                <a @click="thirdPartyLogin('facebook')">
                  <i class="ortur-icon-facebook icon"></i>
                </a>
                <a @click="thirdPartyLogin('github')">
                  <i class="ortur-icon-github icon"></i>
                </a>
                <a @click="thirdPartyLogin('tiktok')">
                  <i class="ortur-icon-tiktok icon"></i>
                </a>
                <a @click="thirdPartyLogin('google')">
                  <i class="ortur-icon-google icon"></i>
                </a>
                <a>
                  <i class="ortur-icon-apple icon disabled-icon"></i>
                </a>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="or">or</div>
            </el-form-item>
            <el-form-item prop="email">
              <el-input
                v-model="registerForm.email"
                autocomplete="off"
                placeholder="Email"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="registerForm.password"
                autocomplete="off"
                placeholder="Password"
                show-password
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <div class="code-container">
                <el-input
                  type="text"
                  v-model="registerForm.code"
                  autocomplete="off"
                  placeholder="Code"
                  class="code-input"
                ></el-input>
                <input
                  v-if="!isSend"
                  type="button"
                  class="code-button"
                  @click.stop="sendCode('registerForm')"
                  value="Send Code"
                />
                <input
                  v-else
                  type="button"
                  class="code-button"
                  :value="count + 's'"
                />
              </div>
            </el-form-item>
            <el-form-item>
              <el-button @click="createAccount('registerForm')">
                Create Account
              </el-button>
            </el-form-item>
            <el-form-item>
              <div class="privacy-text-box">
                <span class="login-text">
                  Already have an account?
                  <a @click="switchForm('login')"> &nbsp; Log in </a>
                </span>
                <!-- <span class="login-text privacy-text">
                  By clicking "Create account", I agree to ORTUR's
                  <a
                    target="_blank"
                    href="https://www.leadiffer.com/privacy-policy/"
                    >Privacy policy</a
                  >
                  .
                </span> -->
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!-- 登录表单 -->
        <div v-show="formType == 'login'">
          <el-form :model="loginForm" ref="loginForm" :rules="rules">
            <el-form-item>
              <div class="continue-with">Continue with</div>
              <div class="icon-box">
                <a
                  @click="thirdPartyLogin('facebook')"
                  @mouseenter="enter('facebook')"
                  @mouseleave="leave"
                >
                  <i
                    class="ortur-icon-facebook icon"
                    :class="[
                      activeIcon === 'facebook'
                        ? 'ortur-icon-facebook-light'
                        : '',
                    ]"
                  ></i>
                </a>
                <a
                  @click="thirdPartyLogin('github')"
                  @mouseenter="enter('github')"
                  @mouseleave="leave"
                >
                  <i
                    class="ortur-icon-github icon"
                    :class="[
                      activeIcon === 'github' ? 'ortur-icon-github-light' : '',
                    ]"
                  ></i>
                </a>
                <a
                  @click="thirdPartyLogin('tiktok')"
                  @mouseenter="enter('tiktok')"
                  @mouseleave="leave"
                >
                  <i class="ortur-icon-tiktok icon"></i>
                </a>
                <a
                  @click="thirdPartyLogin('google')"
                  @mouseenter="enter('google')"
                  @mouseleave="leave"
                >
                  <i class="ortur-icon-google icon"></i>
                </a>
                <a>
                  <i class="ortur-icon-apple icon disabled-icon"></i>
                </a>
              </div>
            </el-form-item>
            <el-form-item>
              <div class="or">or</div>
            </el-form-item>

            <el-form-item prop="email">
              <el-input
                v-model="loginForm.email"
                autocomplete="off"
                placeholder="Email"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                autocomplete="off"
                placeholder="Password"
                show-password
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="login('loginForm')">Log in</el-button>
            </el-form-item>
            <el-form-item>
              <div class="login-text-nav">
                <span class="login-text">
                  Forget password?
                  <a @click="switchForm('reset-password')"> &nbsp; Reset it </a>
                </span>
                <span class="login-text">
                  No account?
                  <a @click="switchForm('register')">Create one</a>
                </span>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <!-- 第三方注册表单 -->
        <div v-show="formType == 'third-register'" class="third-form-wrapper">
          <div class="tip-title">Verification successfully</div>
          <div class="tip-desc">
            For the security of your account, please bind an ORTUR account
          </div>
          <div class="thild-form">
            <div class="thild-info">
              <div class="scope-info">
                <div class="thild-avatar">
                  <img
                    :src="scopeInfo.avatar"
                    style="width: 60px; height: 60px; border-radius: 50%"
                  />
                </div>
                <div class="thild-nickname">
                  {{ scopeInfo.name }}
                </div>
              </div>
            </div>
            <div class="split-line"></div>
            <el-form
              :model="registerForm"
              :rules="rules"
              ref="thirdRegisterForm"
            >
              <el-form-item prop="email">
                <el-input
                  v-model="registerForm.email"
                  autocomplete="off"
                  placeholder="Email adress"
                ></el-input>
              </el-form-item>
              <el-form-item prop="code">
                <div class="code-container">
                  <el-input
                    type="text"
                    v-model="registerForm.code"
                    autocomplete="off"
                    placeholder="Verification code"
                    class="code-input"
                  ></el-input>
                  <input
                    v-if="!isSend"
                    type="button"
                    class="code-button"
                    @click.stop="sendCode('thirdRegisterForm')"
                    value="Send Code"
                  />
                  <input
                    v-else
                    type="button"
                    class="code-button"
                    :value="count + 's'"
                  />
                </div>
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model="registerForm.password"
                  autocomplete="off"
                  placeholder="New password"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="createAccount('thirdRegisterForm')">
                  Bind
                </el-button>
              </el-form-item>
              <el-form-item>
                <div class="bind-existing-account">
                  <el-link
                    type="primary"
                    :underline="false"
                    @click="switchForm('third-register-bind')"
                  >
                    Bind existing account
                  </el-link>
                </div>
              </el-form-item>
              <el-form-item prop="isAgree">
                <div>
                  <el-radio v-model="registerForm.isAgree" :label="true">
                    <span>I agree to Ortur's </span>
                    <el-link type="primary"> privacy policy </el-link>
                  </el-radio>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>

        <!-- 绑定已有账号表单 -->
        <div
          v-show="formType == 'third-register-bind'"
          class="third-form-wrapper"
        >
          <div class="tip-title">Verification successfully</div>
          <div class="tip-desc">
            For the security of your account, please bind an ORTUR account
          </div>
          <div class="thild-form">
            <div class="thild-info">
              <div class="scope-info">
                <div class="thild-avatar">
                  <img
                    :src="scopeInfo.avatar"
                    style="width: 60px; height: 60px; border-radius: 50%"
                  />
                </div>
                <div class="thild-nickname">
                  {{ scopeInfo.name }}
                </div>
              </div>
            </div>
            <div class="split-line"></div>
            <el-form :model="loginForm" :rules="rules" ref="thirdBindForm">
              <el-form-item prop="email">
                <el-input
                  v-model="loginForm.email"
                  autocomplete="off"
                  placeholder="Email adress"
                ></el-input>
              </el-form-item>

              <el-form-item prop="password">
                <el-input
                  type="password"
                  v-model="loginForm.password"
                  autocomplete="off"
                  placeholder="New password"
                  show-password
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="login('thirdBindForm')"> Bind </el-button>
              </el-form-item>
              <el-form-item>
                <div class="bind-existing-account">
                  <el-link
                    type="primary"
                    :underline="false"
                    @click="switchForm('reset-password')"
                  >
                    Forget Password?
                  </el-link>
                </div>
              </el-form-item>
              <el-form-item prop="isAgree">
                <div>
                  <el-radio v-model="loginForm.isAgree" :label="true">
                    <span>I agree to Ortur's </span>
                    <el-link type="primary"> privacy policy </el-link>
                  </el-radio>
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
        <div v-show="formType == 'reset-password'">
          <reset-form
            @registerDialog="switchForm('register')"
            @openLoginDialog="switchForm('login')"
            @closeResetPassword="closeResetPassword"
            @switchForm="switchForm"
          ></reset-form>
        </div>
      </div>
      <!-- <div class="verify-box" v-show="verifyEmailDialogVisible">
        <h2 class="verify-title">Verify your email</h2>
        <p class="verify-message">
          Click the verification button in the email we sent to
          {{ registerForm.email }}. This helps keep your account secure. No
          email in your inbox or spam folder?
          <a @click="sendEmail(registerForm.email)">Let's resend it. </a>
          Wrong address?
          <a @click="handleClose"> Log out </a>

          to sign in with adifferent email. If you mistyped your emailwhen
          signing up, create a new account.
        </p>
      </div> -->

      <el-dialog
        width="396px"
        :close-on-click-modal="false"
        :visible.sync="isLoading"
        append-to-body
      >
        <div class="loading-box" v-loading="loading"></div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import { bindThird, activeUserSendEmail, register } from "@/api/user";
import { sendCode } from "@/api/user.js";
import { broserInfo } from "@/utils/navigator.js";
import ResetForm from "./ResetForm.vue";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");
export default {
  props: {
    loadLoginDialog: {
      type: Boolean,
      default: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    openLoginInfo: { type: Number, default: 0 },
  },
  components: { ResetForm },
  computed: {
    ...mapState(["loginDialogVisible", "formType"]),
    resetPasswordUrl: function () {
      return process.env.VUE_APP_SSO_URL + "/forget_password";
    },
    dialogVisible: function () {
      return this.visible;
    },
    openLoginMsg: function () {
      return this.openLoginInfo;
    },
  },
  data() {
    var validateEmail = (rule, value, callback) => {
      if (this.errorCode == 1012) {
        callback(new Error("该邮箱已经被注册"));
      } else {
        callback();
      }
    };
    var validatePassword = (rule, value, callback) => {
      // let pattern =
      // /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{8,16}$/;
      let pattern =
        /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![ !"#$%&'()*+,-./:;<=>?@[\\\]\^_`{|}~]+$)[ !"#$%&'()*+,-./:;<=>?@[\\\]\^_`{|}~0-9A-Za-z]{8,16}$/;
      if (!pattern.test(value)) {
        callback(new Error(this.$t("login.passwordNotValid")));
      }
      if (this.loginFormTipCode === 1009 || this.loginFormTipCode === 1006) {
        callback(new Error(this.$t("error.usernameOrPasswordError")));
        this.loginFormTipCode = "";
      } else {
        callback();
      }
    };

    var validateCode = (rule, value, callback) => {
      if (this.errorCode == 1017) {
        callback(new Error(this.$t("error.1017")));
        this.errorCode = 0;
      } else {
        callback();
      }
    };
    return {
      loginFormTipCode: "",
      loginForm: {
        username: "",
        password: "",
        email: "",
      },
      registerForm: {
        email: "",
        password: "",
        code: "",
      },
      scopeInfo: {
        from: "",
        avatar: "",
        email: "",
        name: "",
        code: "",
      },
      isLoading: false,
      loading: true,
      show: true,
      rules: {
        email: [
          { required: true, message: this.$t("login.email"), trigger: "blur" },
          {
            type: "email",
            message: this.$t("login.emailErrorInput"),
            trigger: ["blur", "change"],
          },
          {
            validator: validateEmail,
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("login.password"),
            trigger: "blur",
          },
          {
            min: 8,
            message: this.$t("login.passwordLengthLimit"),
            trigger: "blur",
          },
          {
            max: 100,
            message: this.$t("login.passwordLengthLimitMax"),
            trigger: "blur",
          },
          { validator: validatePassword, trigger: "blur" },
        ],
        code: [
          {
            required: true,
            message: this.$t("reset.code"),
            trigger: "blur",
          },
          { validator: validateCode },
        ],
        isAgree: [
          {
            required: true,
            message: "请先阅读隐私协议",
            trigger: "blur",
          },
        ],
      },
      activeIcon: "",
      thirdPartyFormTip: "",
      thirdPartyInfo: {
        userId: "",
        catalog: "",
        email: "",
        name: "",
      },
      verifyEmailDialogVisible: false,
      isSend: false,
      count: 60,
      errorCode: 0,
    };
  },
  methods: {
    casdoorLogin() {
      localStorage.setItem("casdoorUrl", this.$route.path);
      window.location.href = this.getSigninUrl();
    },
    casdoorSingup() {
      window.location.href = this.getSignupUrl();
    },
    login(formName) {
      this.$refs[formName].validate((valid, object) => {
        this.loginForm.username = this.loginForm.email;
        console.log("valid:", valid, object);
        if (valid) {
          this.isLoading = true;
          this.$store
            .dispatch("user/login", {
              loginForm: this.loginForm,
            })
            .then(() => {
              this.isLoading = false;
              if (
                this.$route.query.redirect &&
                this.$route.meta.title == "AlgoLaser Library"
              ) {
                this.$router.push(this.$route.query.redirect);
              }

              if (formName == "thirdBindForm") {
                bindThird({
                  userId: this.scopeInfo.code,
                  catalog: this.scopeInfo.from,
                });
              }
              this.handleClose();
            })
            .catch((error) => {
              if (error.data?.code === 1023) {
                this.sendEmail(this.loginForm.email);
                this.verifyEmailDialogVisible = true;
              }
              this.loginFormTipCode = error.code;
              this.isLoading = false;
              this.$refs.loginForm.validateField("email");
              this.$refs.loginForm.validateField("password");
            });
        }
      });
    },
    //注册账号
    createAccount(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          //如果昵称为空，则生成自定义昵称
          if (this.registerForm.nickname === "") {
            let date = new Date();
            this.registerForm.nickname =
              "Explorer" +
              date.getFullYear() +
              (date.getMonth() + 1) +
              date.getDate();
          }
          this.registerForm.username = this.registerForm.email;
          this.$store
            .dispatch("user/register", {
              auto_login: true,
              client_subtype: broserInfo(),
              client_type: "web",
              ...this.registerForm,
            })
            .then(() => {
              this.$message.success(this.$t("register.registerSucess"));
              this.registerForm = { password: "", email: "", code: "" };
              //TODO 绑定第三方信息
              if (formName == "thirdRegisterForm") {
                bindThird({
                  userId: this.scopeInfo.code,
                  catalog: this.scopeInfo.from,
                });
              }

              this.$router.push({ path: "/main", replace: true });
            })
            .catch((e) => {
              this.errorCode = e.code;
              this.$refs[formName].validateField("email"); // 校验错误码
              this.$refs[formName].validateField("code");
            });
        }
      });
    },
    thridPartyAccountBind(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.registerForm.username = this.registerForm.email;
          if (this.registerForm.nickname === "") {
            let date = new Date();
            this.registerForm.nickname =
              "Explorer" +
              date.getFullYear() +
              (date.getMonth() + 1) +
              date.getDate();
          }
          register(this.registerForm).then((res) => {
            console.log("open register", res);
            if (res.data.code === 0) {
              this.$store.commit("user/SET_LOGININFO", res.data.data);
              this.handleClose();
            }
            if (res.data.code === 1024) {
              this.$message.error("Please do not re-register");
            }
          });
        } else {
          return false;
        }
      });
    },
    handleClose() {
      this.$emit("handleClose");
      this.$refs.loginForm.resetFields();
      this.$refs.registerForm.resetFields();
      this.verifyEmailDialogVisible = false;
      this.$store.dispatch("user/closeResetPasswordForm");
    },
    thirdPartyLogin(from) {
      sessionStorage.setItem("isBinding", 2);
      let redirectUrl = window.location.href.split("?")[0];
      window.location.href = `https://sso.leadiffer.com/oauth/thirdParty?from=${from}&redirect_url=${redirectUrl}`;
    },
    enter(val) {
      this.activeIcon = val;
    },
    leave() {
      this.activeIcon = "";
    },
    sendEmail(email) {
      activeUserSendEmail({
        email: email,
      }).then(() => {
        this.$message.success("send email successfully");
      });
    },
    openResetPassword() {
      this.$store.dispatch("user/openResetPasswordForm");
    },
    closeResetPassword() {
      this.$store.dispatch("user/closeResetPasswordForm");
    },
    sendCode(scene) {
      this.$refs[scene].validateField("email", (err) => {
        if (err == "") {
          sendCode({
            email: this.registerForm.email,
            type: 1,
          })
            .then((res) => {
              //发送验证码成功
              this.isSend = true;
              let timer = setInterval(() => {
                if (this.count == 0) {
                  clearInterval(timer);
                  this.count = 60;
                  this.isSend = false;
                }
                this.count--;
              }, 1000);
            })
            .catch((err) => {
              this.errorCode = err.code;
              this.$refs[scene].validateField("email");
            });
        }
      });
    },

    switchForm(type) {
      console.log(11111111111111);
      if (type) {
        let payload = { loginDialogVisible: true, formType: type };
        this.$store.dispatch("user/switchLoginRegisteForm", payload);
      } else {
        let payload = { loginDialogVisible: false, formType: "login" };
        this.$store.dispatch("user/switchLoginRegisteForm", payload);
      }
    },
  },

  mounted() {
    this.scopeInfo = this.$route.query;
    if (this.scopeInfo.from != undefined) {
      this.switchForm("third-register");
    }
  },
};
</script>
<style lang="scss" scoped>
::v-deep .path {
  stroke: #ccc !important;
}

.loading-box {
  width: 100%;
  height: 198px;
}

.login-text-nav {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 58px;
}

.privacy-text-box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 95px;
}

.third-form-wrapper {
  .tip-title {
    font-size: 20px;
    color: #333;
    text-align: center;
  }

  .tip-desc {
    margin-top: 20px;
    font-size: 16px;
    color: #666;
    text-align: center;
  }

  .thild-form {
    display: flex;
    justify-content: space-between;
    margin-top: 30px;
    border: 1px solid #ccc;
    border-radius: 20px;
    padding: 20px;
    .thild-info {
      width: 30%;
      display: flex;
      justify-content: space-around;
      align-items: center;
      .scope-info {
        height: 40%;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
      }
    }
    .split-line {
      width: 1px;
      background: #f0f0f0;
    }
    .el-form {
      width: 55%;
    }
  }
}

.icon {
  font-size: 32px;
  color: #000;
  cursor: pointer;
}

.icon-box {
  display: flex;
  justify-content: space-between;
  width: 273px;
  margin-top: 27px;
}

.continue-with {
  font-size: 20px;
  color: #1a1a1a;
  margin-top: -14px;
}

.or {
  text-align: center;
  font-size: 16px;
  color: #999;
  /* padding-top: 4px; */
}

.el-button {
  background: #1e78f0;
  color: #fff;
  height: 64px;
  font-size: 20px;
  border-radius: 5px;
  width: 100%;
}

::v-deep .el-input__inner {
  height: 64px;
  font-size: 20px;
}

::v-deep .el-dialog {
  border-radius: 15px;
}

.login-text {
  font-size: 16px;
  color: #000;
  text-align: center;
}

.privacy-text {
  margin: 0 auto;
  width: 314px;
  line-height: 23px;
  text-align: start;
}

.disabled-icon {
  color: #999;
  cursor: default;
}

.el-form-item {
  margin-bottom: 24px;
}

.el-form-item__content {
  line-height: 36px;
}

a {
  text-decoration: none;
  cursor: pointer;
  color: #1e78f0;
}

::v-deep .el-dialog__headerbtn .el-dialog__close {
  font-size: 16px;
  color: #000;
  border-radius: 15px;
}

::v-deep .el-form-item__error {
  margin-top: 5px;
  position: relative;
}

.ortur-icon-apple {
  display: none;
}

.verify-box {
  font-family: "Source Han Sans CN";

  .verify-title {
    text-align: center;
    color: #141414;
    font-size: 24px;
    font-weight: 500;
  }

  .verify-message {
    font-size: 16px;
    padding: 24px;
    color: #1a1a1a;
    line-height: 28px;
  }
}

.code-container {
  display: flex;
  justify-content: space-between;

  .code-input {
    ::v-deep .el-input__inner {
      width: 224px;
    }
  }

  .code-button {
    background-color: #2679ed;
    color: #fff;
    border-radius: 6px;
    border: solid 0px;
    padding: 0px 16px;
    font-size: 16px;
    min-width: 120px;
  }

  .code-button:hover {
    cursor: pointer;
  }

  .code-button:active {
    background-color: #479cf8;
  }
}

.bind-existing-account {
  display: flex;
  justify-content: flex-end;
}

::v-deep .el-radio__input.is-checked + .el-radio__label {
  color: #333;
}
</style>
