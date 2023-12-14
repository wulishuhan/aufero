<template>
  <span @click.stop="changeFollowState" v-if="creator.id != userInfo.user_id"
    >{{ isFollow ? $t("thing.unfollow") : $t("thing.follow") }}
  </span>
</template>
<script>
import { follow, unFollow } from "@/api/design";
import { mapState } from "vuex";
export default {
  name: "Follow",
  computed: {
    isFollow() {
      return this.$store.getters.myFollowingList.some((item) => {
        return item.id == this.creator.id;
      });
    },
    ...mapState({
      userInfo: (state) => state.user.userInfo,
    }),
  },
  props: {
    creator: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      isLock: false,
    };
  },
  methods: {
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
        userId: this.creator.id,
      })
        .then(() => {
          this.$store.commit("user/SET_FOLLOWINGLIST", [
            ...this.$store.getters.myFollowingList,
            this.creator,
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
        userId: this.creator.id,
      })
        .then(() => {
          this.$store.commit(
            "user/SET_FOLLOWINGLIST",
            this.$store.getters.myFollowingList.filter((item) => {
              item.id !== this.creator.id;
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
span {
  cursor: pointer;
  color: #1e78f0;
  padding-left: 12px;
}
</style>
