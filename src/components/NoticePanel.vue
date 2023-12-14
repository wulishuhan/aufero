<template>
  <div class="wrapper">
    <div class="header">
      <span class="notice">{{ $t("NoticePanel.Notifications") }}</span>
      <span class="read" :class="{ 'make-all-read': !isRead }" @click="read">
        {{ $t("NoticePanel.Make all read") }}
      </span>
    </div>
    <div class="split-line"></div>
    <div v-if="isRead">
      <div
        class="notice-item"
        v-for="item in navs"
        :key="item.type"
        @click="toMessage(item)"
        v-show="item.type != 0 && item.type != 5"
      >
        <div>{{ $t(`message.${item.name}`) }}</div>
        <div class="dots" v-show="item.count > 0">
          {{ item.count >= 100 ? "..." : item.count }}
        </div>
      </div>
    </div>
    <div v-else class="no-notifications">
      {{ $t("NoticePanel.You have no notifications") }}
    </div>
    <div class="split-line"></div>
    <div class="view-all" @click="toMessage(navs[0])">
      {{ $t("NoticePanel.View all") }}
    </div>
  </div>
</template>

<script>
import { putNoticeRead } from "@/api/user.js";
import { mapGetters } from "vuex";
export default {
  components: {},
  data() {
    return {
      navs: [
        { name: "All", type: 0, count: 0 },
        { name: "Likes", type: 1, count: 0 },
        { name: "Collections", type: 2, count: 0 },
        { name: "Comments", type: 3, count: 0 },
        { name: "Followers", type: 4, count: 0 },
        { name: "Following", type: 5, count: 0 },
        { name: "Announcements", type: 6, count: 0 },
        { name: "Systems", type: 7, count: 0 },
        { name: "Private messages", type: 8, count: 0 },
      ],
      tipCount: [],
    };
  },
  mounted() {
    this.$store.dispatch("user/getNoticeCount").catch(() => {});
  },
  destroyed() {},
  computed: {
    ...mapGetters(["myNoticeCountList", "contactList"]),
    isRead() {
      let read = this.navs.some((item) => {
        return item.count > 0;
      });
      return read;
    },
  },
  watch: {
    myNoticeCountList(list) {
      this.resetNavs();
      for (let i = 0; i < list.length; i++) {
        let type = list[i].type;
        this.navs[type].count = list[i].count;
      }
    },
  },
  methods: {
    read() {
      if (this.isRead) {
        putNoticeRead({}).then(() => {
          this.getNoticeCount();
          this.contactList.forEach((contact, index) => {
            this.$store.commit("im/READ_MESSAGE", { index });
          });
        });
      }
    },
    handleCloseClick() {
      this.isShowPanel = false;
    },
    toMessage(item) {
      this.$router
        .push({
          path: `/message/${item.type}`,
        })
        .catch(() => {});
      this.$emit("noticeClose");
    },
    getNoticeCount() {
      this.$store.dispatch("user/getNoticeCount").catch(() => {});
    },
    resetNavs() {
      this.navs = [
        { name: "All", type: 0, count: 0 },
        { name: "Likes", type: 1, count: 0 },
        { name: "Collections", type: 2, count: 0 },
        { name: "Comments", type: 3, count: 0 },
        { name: "Followers", type: 4, count: 0 },
        { name: "Following", type: 5, count: 0 },
        { name: "Announcements", type: 6, count: 0 },
        { name: "Systems", type: 7, count: 0 },
        { name: "Private messages", type: 8, count: 0 },
      ];
    },
  },
};
</script>

<style></style>

<style lang="scss" scoped>
.wrapper {
  width: 432px;

  font-weight: 400;
  background-color: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0px 3px 7px 0px rgba(0, 0, 0, 0.2);
  .split-line {
    width: 384px;
    border-top: solid 1px #e6e6e6;
    text-align: center;
    margin: 0 auto;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    /* border-bottom: solid 1px #e6e6e6; */
    .notice {
      font-size: 16px;
      color: #1a1a1a;
    }
    .read {
      font-size: 16px;
      color: #1e78f0;
      cursor: pointer;
    }
    .make-all-read {
      color: #999;
    }
  }
  .notice-item {
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #1a1a1a;
    cursor: pointer;
    .dots {
      text-align: center;
      color: #fff;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background-color: #ff6161;
      font-size: 12px;
      line-height: 20px;
    }
  }
  .no-notifications {
    height: 435px;
    color: #999;
    text-align: center;
    font-size: 18px;
    line-height: 435px;
  }
  .notice-item:hover {
    background: #8ab5ef;
    color: #fff;
  }
  .view-all {
    padding: 22px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
  }
}
</style>
