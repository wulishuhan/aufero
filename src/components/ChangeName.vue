<template>
  <div>
    <el-dialog
      width="396px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :title="$t('setting.changeName')"
    >
      <div>
        <el-form :model="registerForm" ref="registerForm" :rules="rules">
          <el-form-item prop="name">
            <el-input
              v-model="registerForm.name"
              autocomplete="off"
              :placeholder="$t('setting.newName')"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <div class="submit">
              <div></div>
              <el-button
                class="el-button"
                @click="changePassword('registerForm')"
                >{{ $t("setting.submit") }}</el-button
              >
            </div>
          </el-form-item>
        </el-form>
      </div>

      <el-dialog width="396px" :visible.sync="innerVisible" append-to-body>
        <div class="loading-box" v-loading="loading"></div>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import { changeName } from "@/api/setting.js";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    dialogVisible: function () {
      return this.visible;
    },
  },
  data() {
    return {
      registerForm: {
        name: "",
      },
      innerVisible: false,
      loading: true,
      rules: {
        name: [
          {
            required: true,
            min: 1,
            max: 32,
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    handleEnter() {
      this.login("loginForm");
    },

    changePassword() {
      console.log(this.registerForm);
      changeName({ nickName: this.registerForm.name }).then(() => {
        this.$store.dispatch("user/getUserInfo").catch((e) => {
          console.log(e);
          this.$message({
            message: this.$t("setting.changeNickNameSucess"),
            type: "success",
          });
        });
        this.handleClose();
      });
    },
    handleClose() {
      this.$emit("handleClose");
    },
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-dialog {
  width: 464px;
  height: 232px;
  background: #ffffff;
  border-radius: 10px;
  .el-dialog__body {
    font-size: 16px;
  }
}
.submit {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  .el-button {
    width: 104px;
    height: 40px;
    background: #1e78f0;
    border-radius: 6px;
    font-size: 14px;
  }
}
.forget {
  font-size: 16px;

  font-weight: 400;
  color: #1e78f0;
}

.loading-box {
  width: 100%;
  height: 198px;
}
.login-text-nav {
  display: flex;
  flex-direction: column;
}

.el-button {
  background: #1e78f0;
  color: #fff;
  font-size: 18px;
  font-weight: 200;
  border-radius: 5px;
}
::v-deep .el-input__inner {
  height: 48px;
  width: 312px;
  font-size: 16px;
  font-weight: 200;
}
::v-deep .el-dialog {
  border-radius: 15px;
  font-weight: 400;
}
.login-text {
  font-size: 15px;
  color: #000;
  text-align: center;
}

.el-form-item {
  margin-bottom: 18px;
}
.el-form-item__content {
  line-height: 36px;
}
a {
  text-decoration: none;
  cursor: pointer;
  color: #1e78f0;
}
::v-deep .el-form {
  width: 312px;
  margin: 0 auto;
}
::v-deep .el-dialog__headerbtn .el-dialog__close {
  font-size: 11px;
  color: #000;
  border-radius: 15px;
}
::v-deep .el-form-item__error {
  margin-top: 5px;
  position: relative;
}
</style>
