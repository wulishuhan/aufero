<template>
  <div class="Notifications">
    <div class="Notification">{{ $t("profile.Notifications") }}</div>
    <el-divider></el-divider>
    <div>
      <div class="ONORTUR">{{ $t("profile.ON ALGOLASER") }}</div>
      <el-divider class="divider"></el-divider>
      <el-form ref="form" :model="form" label-width="123px">
        <el-form-item>
          <div class="select">
            <div class="left">{{ $t("profile.Like&Collection") }}</div>
            <div class="right">
              <el-select v-model="LikeCollection" placeholder="">
                <el-option
                  v-for="item in ArrList"
                  :key="item.id"
                  :label="$t(`profile.${item.name}`)"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="select">
            <div class="left">{{ $t("profile.Comment") }}</div>
            <div class="right">
              <el-select v-model="form.comment" placeholder="">
                <el-option
                  v-for="item in ArrList"
                  :key="item.id"
                  :label="$t(`profile.${item.name}`)"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <el-form-item>
          <div class="select">
            <div class="left">{{ $t("profile.New fans") }}</div>
            <div class="right">
              <el-select v-model="form.follower" placeholder="">
                <el-option
                  v-for="item in ArrList"
                  :key="item.id"
                  :label="$t(`profile.${item.name}`)"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </el-form-item>
        <!-- <el-form-item>
          <div class="select">
            <div class="left">Private message</div>
            <div class="right">
              <el-select v-model="form.message" placeholder="请选择">
                <el-option
                  class="rightbox"
                  v-for="item in ArrList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
        </el-form-item> -->

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
import { getProfileList, updateNotificationsList } from "@/api/setting.js";
import { createNamespacedHelpers } from "vuex";
const { mapState } = createNamespacedHelpers("user");

export default {
  data() {
    return {
      form: {},
      LikeCollection: "",
      ArrList: [
        { name: "Close", id: "0" },
        { name: "Users i follow", id: "1" },
        { name: "Any user", id: "2" },
      ],
    };
  },
  mounted() {
    this.showPanel();
  },
  computed: {
    ...mapState(["userInfo"]),
  },
  methods: {
    showPanel() {
      getProfileList(this.userInfo.user_id).then((response) => {
        this.LikeCollection = response.data.data.like;
        this.form = this.form = response.data.data;
        console.log(this.LikeCollection, 107);
        console.log(this.form, 89);
      });
    },
    // 确认按钮
    onSubmit: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.form.like = this.LikeCollection;
          this.form.collection = this.LikeCollection;
          updateNotificationsList(this.form).then((response) => {
            console.log(response, 116);
            this.$message({
              message: this.$t("Modified successfully"),
              type: "success",
            });
            this.showPanel();
          });
          // }
        }
      });
    },
  },
};
</script>

<style scoped lang="scss">
.Notifications {
  padding-top: 35px;
  width: 1200px;
  height: 896px;
  background: #ffffff;
  border-radius: 8px;
}
.Notification {
  margin-left: 36px;
  font-size: 20px;

  font-weight: 500;
  color: #1a1a1a;
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
  margin-left: 121px;
}
.ONORTUR {
  margin-left: 121px;
  margin-top: 45px;
  font-size: 20px;

  font-weight: 500;
  color: #999999;
}
.select {
  height: 40px;
  display: flex;
  justify-content: space-between;
  width: 912px;
  margin: 32px 0 0 1px;
}
.left {
  line-height: 40px;
  font-size: 16px;

  font-weight: 500;
  color: #1a1a1a;
}
.right {
  // width: 272px;
  height: 40px;
  background: #ffffff;
  border-radius: 6px;
}
::v-deep .el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  height: 40px;
  margin: 0 8px;
  color: #ffffff;
  background-color: #8ab5ef;
  border-radius: 6px;
}
::v-deep .el-button--primary {
  width: 136px;
  height: 56px;
  border-radius: 8px;
}
</style>
