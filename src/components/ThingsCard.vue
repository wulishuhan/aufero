<template>
  <div class="things-card">
    <div
      class="things-card-image"
      :style="bakcStyle"
      @click="toDetail(things.thingsId)"
    >
      <div class="things-card-image-header">
        <div class="things-card-image-avatar">
          <el-avatar :size="35" :src="things.avatar"></el-avatar>
        </div>
        <div class="things-card-image-info">
          <span>{{ things.thingsName }}</span>
          <div class="things-card-image-info-author">
            <span>by {{ things.author }}</span>
            <span>{{ things.publicTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="message">
      <span @click="like">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-heart"
          viewBox="0 0 16 16"
          :class="{ 'red-icon': isLike }"
        >
          <path
            d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"
          />
        </svg>
        {{ likes }}
      </span>
      <span @click="switchCollect">
        <i
          :class="{ 'green-icon': isCollected }"
          class="el-icon-copy-document"
        ></i>
        {{ things.collections }}
      </span>
      <span @click="toDetail(things.thingsId)">
        <i class="el-icon-chat-line-square"></i>{{ things.messages }}
      </span>
    </div>
  </div>
</template>
<script>
import { changeLike, changeCollect } from "@/api/thing";
export default {
  name: "ThingsCard",
  props: ["things"],
  mounted() {
    this.isLike = this.things.isLike;
    this.likes = this.things.likes;
    this.isCollected = this.things.isCollected;
  },
  data() {
    return {
      url: "https://cdn.thingiverse.com/renders/9c/9f/b7/f7/91/image_thumb_tiny.jpg",
      bakcStyle: {
        backgroundImage: `url(${this.things.thingsImg})`,
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      },
      isLike: false,
      likes: 0,
      isCollected: false,
    };
  },
  methods: {
    toDetail(id) {
      this.$router.push(`/thing/${id}`);
    },
    like() {
      if (this.isLike) {
        this.likes = Number(this.likes) - 1;
      } else {
        this.likes = 1 + Number(this.likes);
      }
      changeLike({
        isLike: !this.isLike,
        userId: this.$store.getters.userId,
        thingId: this.things.thingId,
      }).then((res) => {
        console.log("changelike", res);
        this.$message({
          message: "恭喜你，这是一条成功消息",
          type: "success",
        });
        this.isLike = !this.isLike;
      });
    },
    switchCollect() {
      this.isCollected = !this.isCollected;
      changeCollect({
        thingId: this.things.thingId,
        isCollected: this.isCollected,
        userId: this.$store.getters.userId,
      }).then((res) => {
        console.log("switchCollect", res);
        this.$message({
          message: "恭喜你，这是一条成功消息",
          type: "success",
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.things-card {
  width: 296px;
  height: 265px;
  margin: 5px auto;
  box-sizing: border-box;
  border: solid 1px #ccc;
  .things-card-image {
    width: 100%;
    height: 219px;
    background-color: #fff;
    .things-card-image-header {
      display: flex;
      align-items: flex-start;
      background: linear-gradient(
        to bottom,
        rgba(0, 0, 0, 0.5) 0%,
        rgba(0, 0, 0, 0) 100%
      );
      .things-card-image-avatar {
      }
      .things-card-image-info {
        margin-left: 10px;
        width: 100%;
        display: flex;
        flex-direction: column;
        color: #fff;
        font-size: 12px;
        .things-card-image-info-author {
          font-size: 11px;
          display: flex;
          justify-content: space-between;
          width: 100%;
        }
      }
    }
  }
  .message {
    display: flex;
    justify-content: center;
    align-items: center;
    align-content: center;
    cursor: pointer;
    span {
      height: 41px;
      display: inline-flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      background-color: #fff;
    }
  }
  .red-icon {
    color: red;
  }
  .green-icon {
    color: #61b63d;
  }
}
@media screen and (max-width: 425px) {
  .things-card {
    width: 80vw;
  }
}
</style>
