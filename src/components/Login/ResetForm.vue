<template>
  <el-form :model="resetForm" ref="resetForm" :rules="rules">
    <el-form-item>
      <div class="title">Reset Password</div>
    </el-form-item>
    <el-form-item prop="email">
      <el-input
        v-model="resetForm.email"
        autocomplete="off"
        placeholder="Email"
      ></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        v-model="resetForm.password"
        autocomplete="off"
        placeholder="Password"
        show-password
      ></el-input>
    </el-form-item>
    <el-form-item prop="code">
      <div class="code-container">
        <el-input
          type="text"
          v-model="resetForm.code"
          autocomplete="off"
          placeholder="Code"
          class="code-input"
        ></el-input>
        <input
          v-if="!isSend"
          type="button"
          class="code-button"
          @click.stop="sendCode"
          value="Send Code"
        />
        <input v-else type="button" class="code-button" :value="count + 's'" />
      </div>
    </el-form-item>
    <el-form-item>
      <el-button class="reset-button" type="primary" @click="reset">
        Reset
      </el-button>
    </el-form-item>
    <el-form-item>
      <div class="login-text-nav">
        <span class="login-text">
          <a class="route-to" @click="$emit('switchForm', 'login')">
            &nbsp; Log in
          </a>
        </span>
        <span class="login-text">
          No account?
          <a class="route-to" @click="$emit('switchForm', 'register')"
            >Create one</a
          >
        </span>
      </div>
    </el-form-item>
  </el-form>
</template>
<script>
import { sendCode, resetPassword } from "@/api/user.js";
/* eslint-disable */
export default {
  name: "ResetForm",
  data() {
    var validatePassword = (rule, value, callback) => {
      let pattern =
        /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![ !"#$%&'()*+,-./:;<=>?@[\\\]\^_`{|}~]+$)[ !"#$%&'()*+,-./:;<=>?@[\\\]\^_`{|}~0-9A-Za-z]{8,16}$/;
      if (!pattern.test(this.resetForm.password)) {
        callback(
          new Error(
            "The length of the password is 8-16 characters, must contain two kinds of numbers, letters and characters."
          )
        );
      }
      callback();
    };
    var validateEmail = (rule, value, callback) => {
      if (this.errorCode == 1006) {
        callback(new Error("email does not exist"));
      }
      callback();
    };
    var validateCode = (rule, value, callback) => {
      if (this.errorCode == 1017) {
        callback(new Error("code exipre"));
      }
      callback();
    };
    return {
      rules: {
        email: [
          { required: true, message: this.$t("login.email"), trigger: "blur" },
          {
            min: 5,
            max: 50,
            message: this.$t("login.emailLengthLimit"),
            trigger: "blur",
          },
          {
            type: "email",
            message: this.$t("login.emailErrorInput"),
            trigger: ["blur", "change"],
          },
          {
            validator: validateEmail,
            trigger: ["blur", "change"],
          },
        ],
        password: [
          {
            required: true,
            message: this.$t("login.password"),
            trigger: "blur",
          },
          {
            min: 5,
            max: 20,
            message: this.$t("login.passwordLengthLimit"),
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
          { validator: validateCode, trigger: "blur" },
        ],
      },
      resetForm: {
        email: "",
        password: "",
        code: "",
        username: "",
      },
      count: 60,
      isSend: false,
      errorCode: 0,
    };
  },
  methods: {
    reset() {
      console.log("reset", this.resetForm);
      this.resetForm.username = this.resetForm.email;
      resetPassword(this.resetForm)
        .then((res) => {
          console.log("reset res:", res);
          this.$message.success(this.$t("reset.resetSuccess"));
        })
        .catch((err) => {
          this.errorCode = err.code;
          this.$refs.resetForm.validateField("code");
        });
    },
    sendCode() {
      this.$refs.resetForm.validateField("email");
      this.resetForm.username = this.resetForm.email;
      console.log("send code", this.resetForm);
      sendCode({
        email: this.resetForm.username,
        type: 2,
      }).then((res) => {
        console.log("res", res);
      });
      this.isSend = true;
      let timer = setInterval(() => {
        if (this.count == 0) {
          clearInterval(timer);
          this.count = 60;
          this.isSend = false;
        }
        this.count--;
      }, 1000);
    },
    closeResetPassword() {
      this.$emit("closeResetPassword");
    },
    reflashResetForm() {
      this.resetForm = {
        email: "",
        password: "",
        code: "",
        username: "",
      };
    },
  },
};
</script>
<style scoped lang="scss">
.title {
  font-size: 24px;
  font-weight: 500;
  color: #1a1a1a;
}
.login-text-nav {
  display: flex;
  justify-content: space-between;
  height: 58px;
  padding-top: 20px;
  .login-text {
    font-size: 18px;
    color: #1a1a1a;
    text-align: center;
  }
  .route-to {
    color: #1e78f0;
  }
  .route-to:hover {
    cursor: pointer;
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
.reset-button {
  height: 64px;
  font-size: 20px;
  width:100%;
}
</style>
