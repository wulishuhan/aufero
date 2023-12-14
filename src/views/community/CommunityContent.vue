<template>
  <div class="community-wrapper">
    <div class="user-profile-wrapper">
      <!-- <el-avatar
        icon="el-icon-user-solid"
        :src="item.creator.avatar"
        :size="60"
        fit="cover"
      ></el-avatar> -->
      <img :src="item.creator.avatar" class="user-profile-avatar" />
      <div class="profile">
        <span class="nickname">{{ item.creator.name }}</span>
        <span class="datetime">{{ $d(new Date(item.post_time), "long") }}</span>
      </div>
    </div>
    <div class="content">
      <router-link :to="'/community/' + item.id" style="color: #333">
        {{ isFull ? item.content : item.content.substring(0, 400) }}
      </router-link>
      <span v-if="item.content.length > 400 && !isFull">
        ......<span style="color: #1e78f0" @click="handClickFull">全文</span>
      </span>
    </div>
    <div class="gallery">
      <el-image
        v-for="(image, index) in item.images"
        style="width: 160px; height: 160px"
        :src="image"
        :key="index"
        fit="cover"
      ></el-image>
    </div>
    <div
      class="reference-wrapper"
      v-if="item.resource != null || item.resource != undefined"
    >
      <div class="reference-info">
        <div class="cover">
          <el-image
            :src="item.resource.image"
            style="width: 100px; height: 80px"
          ></el-image>
        </div>
        <div class="title-and-author">
          <span class="title">{{ item.resource.title }}</span>
          <span class="author">
            <el-avatar
              :src="item.resource.creator.avatar"
              :size="16"
            ></el-avatar>
            &nbsp;&nbsp;{{ item.resource.creator.name }}
          </span>
        </div>
      </div>
      <el-button @click="handleClickArrow(item.resource.id)">
        <svg-icon icon-class="arrow" class-name="arrow"></svg-icon>
      </el-button>
    </div>
    <div class="toolbar">
      <el-button v-if="!isLike" @click="handleLike(item.id)">
        <svg-icon icon-class="like" class-name="like"></svg-icon>
        {{ likeCount }}
      </el-button>
      <el-button v-else @click="handleUnlike(item.id)">
        <svg-icon icon-class="like_active" class-name="like"></svg-icon>
        {{ likeCount }}
      </el-button>
      <el-button>
        <router-link :to="'/community/' + item.id" style="color: #333">
          <svg-icon icon-class="comment" class-name="comment"></svg-icon>
          {{ commentCount }}
        </router-link>
      </el-button>
      <el-button>
        <svg-icon icon-class="share" class-name="share"></svg-icon>
        {{ viewCount }}
      </el-button>
    </div>
  </div>
</template>
<script>
import { like, unlike } from "@/api/community";
export default {
  name: "CommunityContent",
  data() {
    return {
      isFull: false,
    };
  },
  props: {
    item: {
      type: Array,
      default: () => {
        return [];
      },
      required: true,
    },
    likeCount: {
      type: Number,
      default: 0,
    },
    commentCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    isLike: {
      type: Boolean,
      default: false,
    },
  },
  mounted() {
    console.log("item", this.item);
  },
  methods: {
    handClickFull() {
      this.isFull = true;
    },
    handleClickArrow(id) {
      this.$router.push("/thing/" + id);
    },
    handleLike(id) {
      like(id).then(() => {
        this.$emit("update:likeCount", this.likeCount + 1);
        this.$emit("update:isLike", true);
      });
    },
    handleUnlike(id) {
      unlike(id).then(() => {
        this.$emit("update:likeCount", this.likeCount - 1);
        this.$emit("update:isLike", false);
      });
    },
  },
};
</script>

<style scoped lang="scss">
.community-wrapper {
  background: #fff;
  padding: 16px 24px;
  border-radius: 12px;
}
.community-wrapper + .community-wrapper {
  margin-top: 24px;
}
.user-profile-wrapper {
  display: flex;
  width: 180px;
  justify-content: space-between;
  .user-profile-avatar {
    width: 60px;
    height: 60px;
    object-fit: cover;
    border-radius: 50%;
    margin-right: 8px;
  }
  .profile {
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .nickname {
      color: #1a1a1a;
      font-weight: 500;
    }
    .datetime {
      font-size: 12px;
      color: #999;
    }
  }
}
.content {
  margin-top: 12px;
  font-size: 16px;
  color: #333;
  line-height: 24px;
  font-weight: 400;
}

.gallery {
  display: flex;
  align-items: center;
  align-content: center;
  flex-wrap: wrap;

  .el-image {
    margin-right: 12px;
    margin-top: 12px;
  }
  // .el-image + .el-image {
  //   margin-left: 16px;
  // }
}

.reference-wrapper {
  margin-top: 12px;
  padding: 8px;
  display: flex;
  background: #f5f5f5;
  justify-content: space-between;
  align-items: center;
  .el-button {
    border: none;
    background: none;
  }
}
.reference-info {
  display: flex;
  .title-and-author {
    margin-left: 24px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .title {
      color: #333;
      font-weight: 500;
      font-size: 14px;
    }
    .author {
      display: flex;
      align-items: center;
      font-size: 12px;
      color: #999;
    }
  }
}
.toolbar {
  margin-top: 24px;
  width: 200px;
  display: flex;
  justify-content: space-between;
  .el-button {
    border: none;
  }
  .el-button:focus,
  .el-button:hover {
    background-color: unset;
  }
}
</style>
