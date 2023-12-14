<template>
  <div class="designer-card">
    <div :style="cardBackground" @click="to('Designs')">
      <el-image :src="follow.avatar"> </el-image>
    </div>
    <div class="card-info">
      <div class="follow-button">
        <follow-button :follow="isFollow"></follow-button>
      </div>
      <div class="text-info">
        <span>{{ follow.name }}</span>
        <br />
        <span>{{ follow.address }}</span>
      </div>
    </div>
    <div class="card-content-bottom">
      <div class="card-bottom-number-show" @click="to('Designs')">
        <span>{{ follow.designs }}</span>
        <span>Designs</span>
      </div>
      <div class="card-bottom-number-show" @click="to('Makes')">
        <span>{{ follow.makes }}</span>
        <span>Makes</span>
      </div>
      <div class="card-bottom-number-show" @click="to('Collections')">
        <span>{{ follow.collections }}</span>
        <span>Collections</span>
      </div>
    </div>
  </div>
</template>
<script>
import FollowButton from "@/components/FollowButton";
export default {
  name: "DesignerCard",
  components: { FollowButton },
  props: ["follow"],
  data() {
    return {
      cardBackground: {
        backgroundImage: `url(${this.follow.background})`,
        width: `296px`,
        height: `122px`,
        backgroundSize: `100% 100%`,
        backgroundRepeat: `no-repeat`,
        cursor: "pointer",
      },
      isFollow: false,
    };
  },
  mounted() {
    this.isFollow = this.follow.isFollow;
  },
  methods: {
    to(name) {
      this.$store.commit("filterCard/SET_SELECTPROFILE", name);
      this.$router.push(`/design/${name}/${this.follow.userId}`);
    },
  },
};
</script>
<style lang="scss" scoped>
.designer-card {
  width: 296px;
  height: 270px;
  background: #fff;
  border: 2px solid #ececec;
  margin-top: 10px;
  .card-info {
    height: 89px;
    width: 296px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ececec;
  }
  .follow-button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 89px;
    margin-top: 10px;
  }
  .text-info {
    font-size: 14px;
    margin-left: 10px;
  }
  .el-image {
    width: 67px;
    height: 67px;
    border-radius: 50%;
    border: 4px solid #fff;
    position: relative;
    top: 70px;
    left: 25px;
  }
  .el-button {
    width: 100px;
    height: 35px;
  }
  .card-content-bottom {
    display: flex;
    justify-content: space-around;
    width: 296px;
    .card-bottom-number-show {
      display: flex;
      justify-content: space-around;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 4px;
      cursor: pointer;
    }
  }
}
</style>
