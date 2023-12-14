<template>
  <div class="message-container">
    <div class="message-navigation">
      <nav-item
        v-for="(item, index) in navs"
        :name="item.name"
        :num="item.count"
        :class="[currentType == item.type ? 'nav-item-active' : '']"
        :key="index"
        @click.native="changeNav(item.type)"
        v-show="item.type != 5"
      ></nav-item>
    </div>
    <div class="message-content">
      <message-content
        :activeName="activeName"
        :currentType="currentType"
        :messageList="messageList"
        :loading="loading"
        :noMore="noMore"
        :total="total"
      ></message-content>
    </div>
  </div>
</template>
<script>
import MessageContent from "./components/MessageContent.vue";
import NavItem from "./components/NavItem.vue";
import { getNoticeList } from "@/api/user.js";
import { mapGetters } from "vuex";
import { throttle } from "@/utils/cache.js";
export default {
  // eslint-disable-next-line
  name: "message",
  components: { NavItem, MessageContent },
  data() {
    return {
      // 后台返回的type代表含义：1Like 2Collection 3Comment 4Follower 5Following 6Announcement 7System 8Message
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
      currentType: 0,
      messageList: [],
      countList: [],
      load: () => {},
      noMore: false,
      loading: false,
      total: 0,
      pagination: {
        pageSize: 10,
        pageNum: 1,
      },
    };
  },
  mounted() {
    console.log("重新挂载");
    this.currentType = parseInt(this.$route.params.messageType);
    this.getNoticeCount();
    this.getMessageList(this.currentType);
    this.load = throttle(() => {
      // 距离底部200px时加载一次
      let bottomOfWindow =
        document.documentElement.offsetHeight -
          document.documentElement.scrollTop -
          window.innerHeight <=
        200;
      if (bottomOfWindow && !this.loading && !this.noMore) {
        this.pagination.pageNum++;
        if (
          this.pagination.pageNum <=
          Math.ceil(this.total / this.pagination.pageSize)
        ) {
          this.getMessageList(this.currentType);
        }
      }
    }, 1000);
    window.addEventListener("scroll", this.load);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.load);
  },
  computed: {
    ...mapGetters(["myNoticeCountList", "unreadCount"]),
    activeName() {
      return this.navs[parseInt(this.currentType)].name;
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
    unreadCount(count) {
      console.log("unread count: " + count);
      this.navs[8].count = +count;
      let newNoticeList = this.myNoticeCountList.map((item) => {
        if (item.type == 8) {
          item.count = this.navs[8].count;
        }
        return item;
      });
      this.$store.commit("user/SET_NOTICECOUNTLIST", newNoticeList);
    },
  },
  methods: {
    changeNav(type) {
      this.currentType = type;
      this.messageList = [];
      this.pagination.pageNum = 1;
      this.getNoticeCount();
      this.getMessageList(this.currentType);
      window.history.pushState("", "", `/message/${type}`);
    },
    getNoticeCount(type) {
      if (type && type != 0) {
        this.navs[type].count = 0;
      }
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
    getMessageList(type) {
      let data = { ...this.pagination };
      if (type != 0) {
        data.type = type;
      }
      this.loading = true;
      getNoticeList(data)
        .then((res) => {
          this.messageList.push(...res.data.rows);
          this.total = res.data.total;
          this.loading = false;
          this.getNoticeCount(type);
        })
        .catch((err) => {
          console.log(err);
          this.loading = false;
          this.noMore = true;
        });
    },
  },
};
</script>
<style lang="scss" scoped>
.message-container {
  width: 1440px;
  /* min-height: 1251px; */
  margin: 0 auto;
  /* border: 1px solid #ccc; */
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  font-weight: 400;
  color: #1a1a1a;

  .message-navigation {
    padding: 24px 0;
    width: 208px;
    max-height: 608px;
    background: #ffffff;
    border-radius: 8px;
    .nav-item-active {
      background: #4977e6;
      color: #fff !important;
    }
  }
  .message-content {
    width: 1200px;
    min-height: 600px;
    background: #ffffff;
    border-radius: 8px;
  }
}
</style>
