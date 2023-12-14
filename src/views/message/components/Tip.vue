<template>
  <div
    class="tip-content"
    :class="[tipType == '3' ? 'padding' : 'align-items-center']"
  >
    <div class="tip-left">
      <div class="avatar-box">
        <div class="tip-unread" v-if="!isReaded"></div>
        <img
          v-if="tipType != '6' && tipType != '7'"
          :src="avatar"
          class="avatar"
          alt=""
          @click="goDesigner"
        />
        <!-- eslint-disable-next-line -->
        <img
          v-if="tipType == '7'"
          src="@/assets/logo-800x250-light.png"
          alt=""
          class="tip-type-7"
        />
        <i v-if="tipType == '6'" class="ortur-icon-broadcast"></i>
      </div>
      <div class="info">
        <div>
          <span class="name" @click="goDesigner">
            {{ messageCreatorInfo.user_name }}
          </span>
          <span class="time" v-if="tipType == '3'">
            <div v-if="!messageCreatorInfo.refer_content">
              <span>{{ $t("message.Commented on your resource") }} </span>
              <span class="font-color-bule" @click="goDetail"
                >《{{ messageCreatorInfo.resource_title }}》</span
              >
              <!-- <span> {{ format(message.time) }}</span> -->
              <span> {{ $d(new Date(message.time), "long") }}</span>
            </div>
            <span v-if="messageCreatorInfo.refer_content">
              <span>{{ $t("message.Responded to your comment on") }} </span>
              <span class="font-color-bule" @click="goDetail"
                >《{{ messageCreatorInfo.resource_title }}》</span
              >
              <span> {{ $d(new Date(message.time), "long") }}</span>
            </span>
          </span>
          <span class="time" v-if="tipType == '8'">
            <span>{{ $t("message.with your private messages") }} </span>
          </span>
          <span v-if="tipType == '1' || tipType == '2'">
            {{ $d(new Date(message.time), "long") }}
          </span>
          <span v-if="tipType == '4'">
            {{ $d(new Date(message.time), "long") }}
          </span>
          <span v-if="tipType == '6'">{{
            $d(new Date(message.time), "long")
          }}</span>
          <span v-if="tipType == '7'">{{
            $d(new Date(message.time), "long")
          }}</span>
        </div>
        <div v-if="tipType == '2'">
          {{ $t("message.Collected your resource") }}
          <span class="font-color-bule" @click="goDetail">
            "{{ messageCreatorInfo.resource_title }}"
          </span>
        </div>
        <div class="font-color-black" v-if="tipType == '5'">
          {{ $t("message.New resources released") }}
          <span class="font-color-bule" @click="goDetail">
            "{{ messageCreatorInfo.resource_title }}"
          </span>
        </div>
        <div v-if="tipType == '4'">{{ $t("message.follow you") }}</div>
        <div v-if="tipType == '6'" class="announcements-text font-color-black">
          {{ messageCreatorInfo.content }}
        </div>
        <div v-if="tipType == '7'" class="announcements-text font-color-black">
          {{ messageCreatorInfo.content }}
        </div>
        <div v-if="tipType == '1'">
          {{ $t("message.Likes your resource") }}
          <span class="resource-name" @click="goDetail">
            "{{ messageCreatorInfo.resource_title }}"
          </span>
        </div>
        <div class="font-color-black" v-if="tipType == '3'">
          <div class="comment">{{ messageCreatorInfo.comment_content }}</div>
          <div class="my-comment" v-if="messageCreatorInfo.refer_content">
            [{{ $t("message.My comment") }}]
            {{ messageCreatorInfo.refer_content }}
          </div>
          <div class="font-color-bule reply" @click="isReply = !isReply">
            {{ isReply ? $t(`message.cancel`) : $t(`message.Reply`) }}
          </div>
          <div v-if="isReply" class="reply">
            <ReplyWidget
              :messageId="message.id"
              :isMessageComment="true"
              @closeMessageReply="closeMessageReply"
            ></ReplyWidget>
          </div>
        </div>
      </div>
    </div>
    <div class="tip-right">
      <div
        class="tip-right-img"
        v-if="tipType != '4' && tipType != '6' && tipType != '7'"
      >
        <img
          :src="messageCreatorInfo.resource_image"
          alt=""
          @click="goDetail"
        />
      </div>
      <button
        class="tip-right-button"
        v-if="tipType == '4'"
        @click="changeFollowState"
      >
        {{ isFollow ? $t(`message.unfollow`) : $t(`message.follow`) }}
      </button>
    </div>
  </div>
</template>
<script>
import ReplyWidget from "@/components/Comment/ReplyWidget.vue";
import { follow, unFollow } from "@/api/design";
import { mapState } from "vuex";
// import { format } from "timeago.js";
import { generatorDefaultAvator } from "@/utils/generateImage";
import { formateDatetime } from "@/utils/common.js";
export default {
  name: "Tip",
  props: {
    tipType: {
      type: String,
      default: "announcements",
    },
    isReaded: {
      type: Boolean,
      default: true,
    },
    message: {
      type: Object,
      default: () => {},
    },
  },
  components: {
    ReplyWidget,
  },
  computed: {
    isFollow() {
      return this.$store.getters.myFollowingList.some((item) => {
        return item.id == this.messageCreatorInfo.user_id;
      });
    },
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
    avatar() {
      return this.messageCreatorInfo.user_avatar
        ? this.messageCreatorInfo.user_avatar
        : generatorDefaultAvator(
            this.messageCreatorInfo.user_name,
            this.messageCreatorInfo.user_id
          );
    },
  },
  mounted() {
    this.messageCreatorInfo = JSON.parse(this.message.content);
    console.log("messageCreatorInfo:", this.messageCreatorInfo);
  },
  data() {
    return {
      isCommentReply: true,
      isReply: false,
      isLock: false,
      messageCreatorInfo: {},
    };
  },
  methods: {
    closeMessageReply() {
      console.log("当前reply", this.isReply);
      this.isReply = false;
    },
    transformTimeFormat(time) {
      let tempDateTime = time.replace(/:/g, "-");
      tempDateTime = tempDateTime.replace(/ /g, "-");
      let arr = tempDateTime.split("-");
      let now = new Date(
        Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3] - 8, arr[4], arr[5])
      );
      return now;
    },
    format(time) {
      console.log("time:", this.transformTimeFormat(time).getTime());
      let newTime = this.transformTimeFormat(time).getTime();
      // let lang = this.$i18n.locale;
      // if (lang == "en") {
      //   return format(time, "en_US");
      // } else {
      //   return format(time, "zh_CN");
      // }
      return formateDatetime(newTime);
    },
    goDesigner() {
      console.log("go Designer");
      this.$router.push("/design/" + this.messageCreatorInfo.user_id);
    },
    goDetail() {
      console.log("go Detail");
      this.$router.push("/thing/" + this.messageCreatorInfo.resource_id);
    },
    changeFollowState() {
      console.log("tt");
      if (this.isFollow) {
        // need unfollow api
        this.unFollow();
      } else {
        // need follow api
        this.follow();
      }
    },
    follow() {
      if (this.isLock) {
        return;
      }
      this.isLock = true;
      follow({
        userId: this.messageCreatorInfo.user_id,
      })
        .then(() => {
          this.$store.commit("user/SET_FOLLOWINGLIST", [
            ...this.$store.getters.myFollowingList,
            {
              avatar: this.messageCreatorInfo.user_avatar,
              id: this.messageCreatorInfo.user_id,
              name: this.messageCreatorInfo.user_name,
            },
          ]);
          this.isLock = false;
        })
        .catch(() => {
          this.$store.dispatch("user/getMyFollowingList", {
            userId: this.userInfo.user_id,
          });
          this.isLock = false;
        });
    },
    unFollow() {
      if (this.isLock) {
        return;
      }
      this.isLock = true;
      unFollow({
        userId: this.messageCreatorInfo.user_id,
      })
        .then(() => {
          this.$store.commit(
            "user/SET_FOLLOWINGLIST",
            this.$store.getters.myFollowingList.filter((item) => {
              item.id !== this.messageCreatorInfo.user_id;
            })
          );
          this.isLock = false;
        })
        .catch(() => {
          this.$store.dispatch("user/getMyFollowingList", {
            userId: this.userInfo.user_id,
          });
          this.isLock = false;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.font-color-bule {
  color: #1e78f0;
  cursor: pointer;
}
.font-color-black {
  color: #1a1a1a;
}
.padding {
  padding-top: 28px;
  padding-bottom: 32px;
}
.align-items-center {
  align-items: center;
}
.tip-content {
  min-height: 128px;
  display: flex;
  justify-content: space-between;
  border-bottom: solid 1px #e6e6e6;
  .tip-left {
    /* height: 40px; */
    min-width: 340px;
    display: flex;
    .avatar-box {
      position: relative;
      .tip-unread {
        width: 8px;
        height: 8px;
        background: #ff6161;
        border-radius: 50%;
        position: absolute;
        top: -4px;
        left: -4px;
      }
      .avatar {
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
      }
      .tip-type-7 {
        width: 160px;
      }
      .ortur-icon-broadcast {
        font-size: 32px;
      }
    }
    .info {
      margin-left: 18px;
      color: #999;
      font-size: 14px;
      .name {
        color: #1a1a1a;
        font-size: 16px;
        font-weight: 500;
        cursor: pointer;
      }
      .time {
        margin-left: 16px;
      }
      .comment-flex {
        display: flex;
        align-items: flex-end;
        flex-wrap: wrap;
      }
      .resource-name {
        color: #1e78f0;
      }
      .announcements-text {
        font-size: 16px;
        width: 896px;
        color: #1a1a1a;
      }
      .my-comment {
        width: 912px;
        height: 56px;
        background: #f0f0f0;
        border-radius: 6px;
        line-height: 56px;
        padding-left: 17px;
        margin-top: 4px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .comment {
        margin-top: 12px;
        width: 912px;
      }
      .reply {
        width: 912px;
        margin-top: 18px;
      }
    }
  }
  .tip-right {
    .tip-right-img {
      width: 104px;
      height: 79px;
      img {
        width: 100%;
        height: 100%;
        cursor: pointer;
      }
    }
    .tip-right-button {
      width: 104px;
      height: 40px;
      background: #1e78f0;
      border-radius: 8px;
      color: #fff;
      border: none;
      cursor: pointer;
    }
  }
}
</style>
