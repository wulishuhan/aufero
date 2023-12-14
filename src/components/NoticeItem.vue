<template>
  <div>
    <div class="container" v-if="noticeInfo.type == 'comment'">
      <div v-show="noticeInfo.isRead" class="dot"></div>
      <div class="left">
        <router-link :to="'/design/' + noticeInfo.userId">
          <!-- <img :src="noticeInfo.url" class="imgSystem" alt="" /> -->
          <span class="ortur-icon-message" style="font-size: 36px"></span>
        </router-link>
      </div>
      <div class="right">
        <div class="name">
          <span class="username" style="margin-right: 4px">
            <router-link :to="'/design/' + noticeInfo.userId">
              {{ noticeInfo.userName }}
            </router-link>
          </span>
          <span class="info"> {{ $t("notice.leftComment") }} </span>
          <span class="thing">
            <router-link :to="'/thing/' + noticeInfo.thingId">
              {{ noticeInfo.thing }}
            </router-link>
          </span>
        </div>
        <div class="time">
          <span>updated {{ noticeInfo.time }} </span>
        </div>
        <div class="comment">{{ noticeInfo.comment }}</div>
        <div class="yourComment">{{ noticeInfo.yourComment }}</div>
      </div>
    </div>
    <div class="container" v-if="noticeInfo.type == 'message'">
      <div v-show="noticeInfo.isRead" class="dot"></div>
      <div class="left">
        <router-link :to="'/design/' + noticeInfo.userId">
          <img :src="noticeInfo.url" class="img" alt="" />
        </router-link>
      </div>
      <div class="right">
        <div class="name">
          <span class="username">
            <router-link :to="'/design/' + noticeInfo.userId">
              {{ noticeInfo.userName }}
            </router-link>
          </span>
          <span class="info"> {{ $t("notice.msg") }} </span>
        </div>
        <div class="time">
          <span>updated {{ noticeInfo.time }} </span>
        </div>
        <div>{{ noticeInfo.message }}</div>
      </div>
    </div>
    <div
      class="container"
      style="justify-content: space-between"
      v-if="noticeInfo.type == 'upload'"
    >
      <div v-show="noticeInfo.isRead" class="dot"></div>
      <div style="display: flex">
        <div class="left">
          <router-link :to="'/design/' + noticeInfo.userId">
            <img :src="noticeInfo.url" class="img" alt="" />
          </router-link>
        </div>
        <div class="right">
          <div class="name">
            <span class="username">
              <router-link :to="'/design/' + noticeInfo.userId">
                {{ noticeInfo.userName }}
              </router-link>
            </span>
            <span class="info"> {{ $t("notice.upload") }} </span>
          </div>
          <div class="time">
            <span>updated {{ noticeInfo.time }} </span>
          </div>
          <div>{{ noticeInfo.message }}</div>
        </div>
      </div>
      <div>
        <img
          style="width: 40px; height: 40px; margin-right: 20px"
          :src="noticeInfo.img"
          alt=""
        />
      </div>
    </div>
    <div class="container" v-if="noticeInfo.type == 'system'">
      <div v-show="noticeInfo.isRead" class="dot"></div>
      <div class="left">
        <router-link :to="'/design/' + noticeInfo.userId">
          <span class="ortur-icon-broadcast" style="font-size: 36px"></span>
        </router-link>
      </div>
      <div class="right">
        <div class="name">
          <span class="username">
            <!-- <router-link :to="'/design/' + noticeInfo.userId">
              {{ noticeInfo.userName }}
            </router-link> -->
          </span>
          <span class="info"> {{ $t("notice.systemMsg") }} </span>
        </div>
        <div class="time">
          <span>updated {{ noticeInfo.time }} </span>
        </div>
      </div>
    </div>
    <div
      class="container"
      v-if="noticeInfo.type == 'follow' || noticeInfo.type == 'unFollow'"
    >
      <div v-show="noticeInfo.isRead" class="dot"></div>
      <div class="left">
        <router-link :to="'/design/' + noticeInfo.userId">
          <img :src="noticeInfo.url" class="img" alt="" />
        </router-link>
      </div>
      <div class="right">
        <div class="name">
          <span class="username">
            <router-link :to="'/design/' + noticeInfo.userId">
              {{ noticeInfo.userName }}
            </router-link>
          </span>
          <span class="info">
            {{
              noticeInfo.type == "follow"
                ? $t("notice.followYou")
                : $t("notice.unFollowYou")
            }}
          </span>
        </div>
        <div class="time">
          <span>updated {{ noticeInfo.time }} </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    noticeInfo: {
      type: Object,
      default: () => {
        return {
          url: "https://cdn.thingiverse.com/assets/a0/23/4c/6f/68/medium_thumb_Headset_Holder_v1.png",
          userName: "yang",
          userId: "111",
          time: "20220708",
          thing: "3d 裸眼",
          thingId: "5453",
          comment: "真不错",
          yourComment:
            "还行真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错真不错",
          type: "comment",
        };
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  padding: 10px 1px;
  text-align: left;
  box-sizing: border-box;
  display: flex;
  /* justify-content: space-around; */
  position: relative;
  .left {
    .img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
    }
    .imgSystem {
      width: 40px;
      height: 40px;
    }
  }
  .right {
    margin-left: 18px;

    .time {
      margin-top: 7px;
      font-size: 14px;

      font-weight: 400;
      color: #999999;
    }
    .name {
      word-wrap: break-word;

      .username {
        font-size: 16px;

        font-weight: 500;
        color: #1a1a1a;
        margin-right: 36px;
      }
      a {
        color: black;
      }
      .thing {
        font-size: 16px;

        font-weight: 400;
        color: #1a1a1a;
      }
    }
    .info {
      color: #ccc;
      margin-top: 7px;
      font-size: 14px;

      font-weight: 400;
      color: #999999;
    }
    .yourComment {
      word-wrap: break-word;
      background: #f0f0f0;
      border-radius: 6px;
      display: inline-block;
      padding: 18px;
      margin-top: 7px;
      font-size: 16px;

      font-weight: 400;
      color: #1a1a1a;
    }
    .comment {
      margin-top: 7px;
      word-wrap: break-word;
      font-size: 16px;

      font-weight: 400;
      color: #1a1a1a;
    }
  }
  .dot {
    position: absolute;
    top: 13px;
    left: 2px;
    width: 8px;
    height: 8px;
    background: #ff6161;
    border-radius: 50%;
  }
}

.left {
  display: flex;
  align-items: flex-start;
  margin-top: 12px;
}

.img {
  width: 66px;
  height: 42px;
  margin-right: 10px;
}
</style>
