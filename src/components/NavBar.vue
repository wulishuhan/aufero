<template>
  <div style="background-color: #fff">
    <el-row>
      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
        <div class="ortur-resource">
          <router-link to="/">ORTUR RESOURCE</router-link>
        </div>
      </el-col>
      <el-col :xs="8" :sm="8" :md="8" :lg="8" :xl="8">
        <el-input
          placeholder="请输入搜索关键词"
          prefix-icon="el-icon-search"
          v-model="keywords"
          @keyup.enter.native="search"
        ></el-input>
      </el-col>
      <el-col
        class="menuview"
        v-if="isHideNavBar"
        :xs="8"
        :sm="8"
        :md="8"
        :lg="8"
        :xl="8"
      >
        <el-menu
          :default-active="activeIndex"
          class="el-menu-width-md"
          mode="horizontal"
        >
          <el-submenu index="1">
            <template slot="title">Explore</template>
            <el-menu-item index="2-1">
              <router-link to="/">Things</router-link>
            </el-menu-item>
            <el-menu-item index="2-2">
              <router-link to="/designer">Designers</router-link>
            </el-menu-item>
            <el-menu-item index="2-3">
              <router-link to="/groups">Groups</router-link>
            </el-menu-item>
            <el-menu-item index="2-4">
              <router-link to="/">Customizable Things</router-link>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="2">
            <router-link to="/education">Education</router-link>
          </el-menu-item>
          <el-submenu index="3">
            <template slot="title">Create</template>
            <el-menu-item index="3-1">
              <router-link to="/upload">Upload a Thing</router-link>
            </el-menu-item>
            <el-menu-item index="3-2">
              <router-link to="/customizer">Customize a Thing</router-link>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="7" v-if="hasToken">
            <router-link style="width: 100%" to="/dashboard"
              ><div style="width: 100%">!图片</div></router-link
            >
          </el-menu-item>
          <el-menu-item index="4" v-if="!hasToken">
            <router-link to="/login">Sign Up</router-link>
          </el-menu-item>
          <el-submenu index="5" v-if="hasToken">
            <template slot="title">
              <i class="el-icon-user-solid"></i>
            </template>
            <el-menu-item index="5-1">
              <router-link :to="profilePath">View Profile</router-link>
            </el-menu-item>
            <el-menu-item index="5-2"> Messages </el-menu-item>
            <el-menu-item index="5-3">
              <!-- <router-link to="" @click="test">My Designs</router-link> -->
              <a @click="to('Designs')">My Designs</a>
            </el-menu-item>
            <el-menu-item index="5-4">
              <!-- <router-link to="/design/Collections">
                My Collections
              </router-link> -->
              <a @click="to('Collections')">My Collections</a>
            </el-menu-item>
            <el-menu-item index="5-5">
              <!-- <router-link to="/design/Likes">My Likes</router-link> -->
              <a @click="to('Likes')">My Likes</a>
            </el-menu-item>
            <el-menu-item index="5-6">
              <router-link to="/groups">My Groups</router-link>
            </el-menu-item>
            <el-menu-item index="5-7">
              <router-link to="/editProfile"> Account Settings </router-link>
            </el-menu-item>
            <el-menu-item index="5-8" @click="logout">Log Out</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-col>
      <el-col
        class="menuview"
        v-if="!isHideNavBar"
        :xs="8"
        :sm="8"
        :md="8"
        :lg="8"
        :xl="17"
      >
        <span class="el-dropdown-link" @click="drawer = true">
          <i class="el-icon-more"></i>
        </span>
      </el-col>
    </el-row>
    <el-drawer
      title="Menu"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
      :size="'50%'"
    >
      <el-menu default-active="2">
        <el-submenu index="1">
          <template slot="title">Explore</template>
          <el-menu-item index="2-1">
            <router-link to="/">Things</router-link>
          </el-menu-item>
          <el-menu-item index="2-2">
            <router-link to="/designer">Designers</router-link>
          </el-menu-item>
          <el-menu-item index="2-3">
            <router-link to="/groups">Groups</router-link>
          </el-menu-item>
          <el-menu-item index="2-4">
            <router-link to="/">Customizable Things</router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="2">
          <router-link to="/education">Education</router-link>
        </el-menu-item>
        <el-submenu index="3">
          <template slot="title">Create</template>
          <el-menu-item index="3-1">
            <router-link to="/upload">Upload a Thing</router-link>
          </el-menu-item>
          <el-menu-item index="3-2">
            <router-link to="/customizer">Customize a Thing</router-link>
          </el-menu-item>
        </el-submenu>
        <el-menu-item index="4" v-if="!hasToken">
          <router-link to="/login">Sign Up</router-link>
        </el-menu-item>
        <el-submenu index="5" v-if="hasToken">
          <template slot="title">
            <i class="el-icon-user-solid"></i>
          </template>
          <el-menu-item index="5-1">
            <router-link :to="profilePath">View Profile</router-link>
          </el-menu-item>
          <el-menu-item index="5-2"> Messages </el-menu-item>
          <el-menu-item index="5-3">
            <!-- <router-link to="/design/Designs">My Designs</router-link> -->
            <a @click="to('Designs')">My Designs</a>
          </el-menu-item>
          <el-menu-item index="5-4">
            <!-- <router-link to="/design/Collections"> My Collections </router-link> -->
            <a @click="to('Collections')">My Collections</a>
          </el-menu-item>
          <el-menu-item index="5-5">
            <!-- <router-link to="/design/Likes">My Likes</router-link> -->
            <a @click="to('Likes')">My Likes</a>
          </el-menu-item>
          <el-menu-item index="5-6">
            <router-link to="/groups">My Groups</router-link>
          </el-menu-item>
          <el-menu-item index="5-7">
            <router-link to="/editProfile"> Account Settings </router-link>
          </el-menu-item>
          <el-menu-item index="5-8" @click="logout">Log Out</el-menu-item>
        </el-submenu>
      </el-menu>
    </el-drawer>
  </div>
</template>

<script>
import { throttle } from "@/utils/cache.js";
export default {
  mounted() {
    this.hideNavBar();
    this.formatWidth = throttle(() => {
      this.hideNavBar();
    }, 400);
    window.addEventListener("resize", this.formatWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.formatWidth);
  },
  data() {
    return {
      menuview: "hidden-sm-and-down",
      iconview: ["el-icon-s-unfold", "hidden-md-and-up"],
      activeIndex: "1",
      keywords: "",
      isHideNavBar: false,
      isCollapse: true,
      hasTokend: false,
      formatWidth: () => {},
      drawer: false,
      direction: "rtl",
    };
  },
  methods: {
    hideNavBar() {
      let clientWidth = document.body.clientWidth;
      console.log("navbar:", clientWidth);
      if (clientWidth <= 768) {
        this.isHideNavBar = false;
      } else {
        this.isHideNavBar = true;
      }
    },
    logout() {
      this.$store.dispatch("user/logout", this.user).then(() => {
        this.$router.push("/");
      });
    },
    handleClose(done) {
      done();
    },
    search() {
      console.log("search", this.keywords);
      this.$store.commit("search/SET_SEARCH_KEYWORDS", this.keywords);
    },
    to(name) {
      let path = this.$route.path.toString();
      if (path.search(name) === -1) {
        this.$router.push(`/design/${name}/${this.$store.getters.userId}`);
      }
    },
  },
  computed: {
    hasToken() {
      return this.$store.getters.token ? true : false;
    },
    profilePath() {
      return `/design/Favorites/${this.$store.getters.userId}`;
    },
  },
};
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: #409eff;
}
.ortur-resource {
  padding: 20px;
  a {
    color: #409eff;
    text-decoration: none;
  }
}
.el-menu-width-md {
  display: flex;
}
.el-menu {
  float: right;
}
.el-menu.el-menu--horizontal {
  border-bottom: none;
}
.el-input {
  margin: 10px 0px;
  width: 70%;
}
.el-dropdown-menu-width {
  width: 100%;
}
@media screen and (max-width: 768px) {
  .menuview {
    text-align: center;
    margin-top: 15px;
  }
  .ortur-resource {
    padding: 14px;
  }
  .el-menu {
    background: none;
    float: none;
  }
  .el-input {
    width: 100%;
  }
}

@media screen and (max-width: 425px) {
  .ortur-resource {
    padding: 10px;
  }
}
</style>
