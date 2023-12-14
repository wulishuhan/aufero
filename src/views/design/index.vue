<template>
  <div @click="closeAllDialog">
    <div class="container-profile" id="top">
      <CollectedOption
        style="z-index: 1000"
        :show="openCollectedOption"
        :folders="folders"
        :style="collectionStyle"
        @close="closeCollectedOption"
        @moveFolder="moveCollectedOption"
        @addFolder="addFolder"
      ></CollectedOption>
      <el-drawer
        class="drawer"
        title="Concern List"
        :modal="false"
        :visible.sync="dialogFollowersVisible"
        :direction="direction"
        @closed="closeFollowDialog"
      >
        <el-divider></el-divider>
        <el-tabs
          v-model="activeTab"
          @tab-click="handleFollowTapClick"
          class="tabsContent"
        >
          <el-tab-pane name="first" class="followTapPanel">
            <div
              class="Count"
              :class="this.activeTab == 'first' ? 'cellActive' : ''"
              slot="label"
            >
              <i class="el-icon-user"></i>
              {{ form.follower_count }} Follower
            </div>
            <IndexFollowPanel
              :userList="followerList"
              :myFollowList="myFollowList"
              :myUserId="userInfo.user_id"
            ></IndexFollowPanel>
          </el-tab-pane>
          <el-tab-pane name="second" class="followTapPanel">
            <div
              :class="this.activeTab == 'second' ? 'cellActive' : ''"
              class="Count"
              slot="label"
            >
              <i class="el-icon-user"></i>
              {{ form.following_count }} Following
            </div>
            <IndexFollowPanel
              :userList="followingList"
              :myUserId="userInfo.user_id"
              :myFollowList="myFollowList"
            ></IndexFollowPanel>
          </el-tab-pane>
        </el-tabs>
      </el-drawer>
      <el-dialog
        :title="this.$t('design.Share to')"
        :visible.sync="ShareVisible"
        class="ShareVisibledialog"
        @closed="close"
      >
        <div class="share-content">
          <div class="shareiconbox">
            <a class="share-icon" @click="copyLink">
              <div style="display: flex">
                <div>
                  <svg-icon
                    style="color: #1e78f0"
                    icon-class="link"
                    class-name="icon-link"
                  ></svg-icon>
                </div>
                <div style="margin-top: -6px">
                  <span class="sharetitlebox">
                    {{ $t("design.Copy share link") }}</span
                  >
                </div>
              </div>
            </a>
          </div>
          <div class="shareiconbox">
            <a class="share-icon" @click="share(shareLink.facebook)">
              <div style="display: flex">
                <div>
                  <svg-icon icon-class="脸书" class-name="icon-脸书"></svg-icon>
                </div>
                <div style="margin-top: -6px">
                  <span class="sharetitlebox"> Facebook</span>
                </div>
              </div>
            </a>
          </div>
          <div class="shareiconbox">
            <a class="share-icon" @click="share(shareLink.whatsapp)">
              <div style="display: flex">
                <div>
                  <svg-icon icon-class="电话" class-name="icon-电话"></svg-icon>
                </div>
                <div style="margin-top: -6px">
                  <span class="sharetitlebox"> WhatsApp</span>
                </div>
              </div>
            </a>
          </div>
          <div class="shareiconbox">
            <a class="share-icon" @click="share(shareLink.twitter)">
              <div style="display: flex">
                <div>
                  <svg-icon icon-class="推特" class-name="icon-推特"></svg-icon>
                </div>
                <div style="margin-top: -6px">
                  <span class="sharetitlebox"> Twitter</span>
                </div>
              </div>
            </a>
          </div>
          <div class="shareiconbox">
            <a class="share-icon" @click="share(shareLink.instagram)">
              <div style="display: flex">
                <div>
                  <svg-icon icon-class="ins2" class-name="icon-ins2"></svg-icon>
                </div>
                <div style="margin-top: -6px">
                  <span class="sharetitlebox"> Instagram </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </el-dialog>
      <el-dialog
        class="SendVisibledialog"
        title="Write a private message"
        :visible.sync="sendVisible"
        :close-on-click-modal="false"
        @closed="closeSend"
      >
        <span>
          <div style="display: flex">
            <div class="sendimgbox">
              <img class="sendimg" mode="widthFix" :src="avatar" alt="" />
            </div>
            <div
              style="
                padding: 9px;
                font-size: 14px;

                font-weight: 400;
                color: #1a1a1a;
              "
            >
              {{ form.name }}
            </div>
          </div>
          <div style="margin-top: 31px">
            <el-input
              v-model="form.content"
              class="DescriptionInput"
              type="textarea"
              :rows="6"
              resize="none"
              placeholder="say something"
              maxlength="500"
              :show-word-limit="true"
            >
            </el-input>
          </div>
        </span>
        <span slot="footer">
          <el-button @click="closeSend">Cancel</el-button>
          <el-button type="primary" style="margin-right: 12px" @click="sendimg"
            >Send</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        title="Edit collection"
        :visible.sync="renameVisible"
        :show-close="false"
        width="410px"
      >
        <div class="closeaddname" @click="closerename">
          <i class="el-icon-close"></i>
        </div>
        <el-input v-model="collectionMessage.name" maxlength="31"></el-input>
        <div class="buttonBox">
          <div class="Deletecollection" @click.stop="handleDelClick(item)">
            Delete
          </div>
          <div style="display: flex; justify-content: space-between">
            <el-button @click="closerename">Cancel</el-button>
            <el-button @click="rename">submit</el-button>
          </div>
        </div>
      </el-dialog>
      <div class="bg">
        <span v-if="isYourAccount" class="ortur-icon-pen">
          <el-upload
            v-if="isYourAccount"
            class="upload-bg"
            :headers="headers"
            :on-success="handleBgImgUploadSuccess"
            :on-error="handleImgUploadErr"
            :before-upload="handleBeforeImgUpload"
            ref="upload"
            :action="baseURL + '/library/author/cover'"
            :auto-upload="true"
            :show-file-list="false"
          >
            <button
              slot="trigger"
              size="small"
              type="primary"
              style="opacity: 0"
            ></button>
          </el-upload>
        </span>

        <img
          class="img"
          v-if="user.cover_image && user.cover_image.length > 0"
          :src="user.cover_image"
          alt=""
        />
        <img
          class="img"
          v-else
          src="../../assets/img/Frame 58644504.png"
          alt=""
        />
      </div>

      <div class="content">
        <div class="info">
          <div class="imgWrap">
            <span v-show="isYourAccount" class="ortur-icon-pen imgEdit">
              <el-upload
                class="upload-demo"
                :headers="headers"
                :on-success="handleImgUploadSuccess"
                :on-error="handleImgUploadErr"
                :before-upload="handleBeforeImgUpload"
                ref="upload"
                :action="baseURL + '/system/user/avatar'"
                :auto-upload="true"
                :show-file-list="false"
              >
                <button slot="trigger" size="small" type="primary">
                  选取文件
                </button>
              </el-upload>
            </span>
            <img class="img" :src="avatar" />
          </div>
          <div class="name">
            {{ isYourAccount ? userInfo.nick_name : form.name }}
          </div>
          <div class="desc" v-if="!isDescEdit">
            {{ form.description }}
          </div>
          <div class="follow">
            <span class="followers" @click="openFollowDialog('first')"
              >{{ form.follower_count }}
              <span style="color: #ccc">{{ $t("design.follower") }}</span>
            </span>
            <span class="following" @click="openFollowDialog('second')"
              >{{ form.following_count }}
              <span style="color: #ccc"> {{ $t("design.following") }}</span>
            </span>
          </div>
          <div v-if="isYourAccount" class="iconbutton">
            <div class="edit" @click="handleShowProfile">
              <i class="ortur-icon-pen"> {{ $t("design.Edit Profile") }}</i>
            </div>
            <div class="share" @click="Sharedialog">
              <i class="el-icon-share"> </i>
              <div class="ShareBox">{{ $t("design.Share") }}</div>
            </div>
          </div>
          <div v-else class="iconbutton">
            <FollowButton
              class="followBtn"
              :user-id="userId"
              :follow="myFollowingList.includes(userId - 0)"
              @listenFollowButtonEvent="FollowButton"
            ></FollowButton>
            <div class="send" @click="send">
              <svg-icon
                class="sengIcon"
                icon-class="通知"
                class-name="icon-通知"
              ></svg-icon>
            </div>
            <div class="ShareReport">
              <el-dropdown>
                <div class="ShareReportbox">
                  <el-button>
                    <div class="buttonsvgicon">
                      <svg-icon icon-class="菜单竖" class-name="icon-菜单竖">
                      </svg-icon>
                    </div>
                  </el-button>
                </div>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="ShareClick">
                    <div class="ShareReporttext">
                      <div>
                        <svg-icon
                          class="ShareReportsvgicon"
                          style="color: #1a1a1a"
                          icon-class="share"
                          class-name="icon-share"
                        >
                        </svg-icon>
                      </div>
                      <div class="ShareReporttitle">
                        {{ $t("design.Share") }}
                      </div>
                    </div>
                  </el-dropdown-item>
                  <el-dropdown-item @click.native="ReportClick">
                    <div class="ShareReporttext">
                      <div>
                        <svg-icon
                          class="ShareReportsvgicon"
                          style="color: #1a1a1a"
                          icon-class="警告"
                          class-name="icon-警告"
                        >
                        </svg-icon>
                      </div>
                      <div class="ShareReporttitle">
                        {{ $t("design.Report") }}
                      </div>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
          <div
            v-show="
              (form.facebook != null && form.facebook != '') ||
              (form.tiktok != null && form.tiktok != '') ||
              (form.twitter != null && form.twitter != '') ||
              (form.instagram != null && form.instagram != '')
            "
          >
            <div class="title">{{ $t("design.Social profiles") }}</div>
            <div class="icon">
              <div
                v-show="form.facebook != null && form.facebook != ''"
                class="svgicon"
              >
                <a :href="form.facebook">
                  <svg-icon
                    style="width: 40px; vertical-align: 2px; height: 40px"
                    icon-class="脸书"
                    class-name="icon-脸书"
                  ></svg-icon>
                </a>
              </div>
              <div
                v-show="form.tiktok != null && form.tiktok != ''"
                class="svgicon"
              >
                <a :href="form.tiktok">
                  <svg-icon
                    style="
                      width: 40px;
                      vertical-align: 2px;
                      height: 41px;
                      color: black;
                    "
                    icon-class="tiktok-share-icon-black-1"
                    class-name="icon-tiktok-share-icon-black-1"
                  ></svg-icon>
                </a>
              </div>
              <div
                v-show="form.twitter != null && form.twitter != ''"
                class="svgicon"
              >
                <a :href="form.twitter">
                  <svg-icon
                    style="width: 40px; vertical-align: 2px; height: 40px"
                    icon-class="推特"
                    class-name="icon-推特"
                  ></svg-icon>
                </a>
              </div>
              <div
                v-show="form.instagram != null && form.instagram != ''"
                style="
                  font-size: 40px;
                  margin-right: 28px;
                  height: 40px;
                  overflow: hidden;
                "
              >
                <a :href="form.instagram">
                  <svg-icon
                    style="width: 40px; vertical-align: 2px; height: 40px"
                    icon-class="ins2"
                    class-name="icon-ins2"
                  ></svg-icon>
                </a>
              </div>
            </div>
          </div>
          <div
            v-show="
              (form.url1 != null && form.url1 != '') ||
              (form.url2 != null && form.url2 != '') ||
              (form.url3 != null && form.url3 != '')
            "
          >
            <div class="title">{{ $t("design.Contact info") }}</div>
            <div class="url" v-show="form.url1 != ''">
              {{ form.url1 }}
              <span @click="copyUserUrlLink(form.url1)">
                <i class="el-icon-copy-document copy-user-url-link"></i>
              </span>
            </div>
            <div class="url" v-show="form.url2 != ''">
              {{ form.url2 }}
              <span @click="copyUserUrlLink(form.url2)">
                <i class="el-icon-copy-document copy-user-url-link"></i>
              </span>
            </div>
            <div class="url" v-show="form.url3 != ''">
              {{ form.url3 }}
              <span @click="copyUserUrlLink(form.url3)">
                <i class="el-icon-copy-document copy-user-url-link"></i>
              </span>
            </div>
          </div>
        </div>
        <div class="tabs">
          <!-- <span class="editTab">edit</span> -->
          <el-tabs
            v-model="activeName"
            @tab-click="handleResourceClick"
            class="tabsContent"
          >
            <el-tab-pane :label="$t('design.resources')" name="first">
              <el-tabs
                v-model="resourceActiveTab"
                @tab-click="handleResourceTabClick"
                class="resourceTabsContent"
              >
                <el-tab-pane :label="$t('design.mine')" name="first">
                  <el-row :gutter="20">
                    <!-- mine 的总数 -->
                    <div class="Number">
                      {{ $t("design.mine") }} • {{ resources.length }}
                    </div>
                    <div
                      class="resourceWrapper"
                      v-for="(item, index) in resources"
                      :key="item.thingId"
                      @contextmenu="showMenu(index, item)"
                    >
                      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                        <resource-card
                          :key="item.id"
                          @clickMoveMenu="Handler_MoveTo(item)"
                          @clickDelMenu="Handler_Del(item)"
                          @clickDownMenu="Handler_Down(item)"
                          @openCollection="openCollection"
                          @deleteCollection="deleteCollection"
                          :isCollected="myCollects.includes(item.id)"
                          :thing="item"
                          :showEdit="isLogin && isYourAccount"
                          :showMoreMenuBtn="isYourAccount && true"
                          :showAvatar="false"
                          :isYourAccount="isYourAccount"
                          :isLike="myLikesList.some((i) => i.id === item.id)"
                          :showStar="true"
                        >
                        </resource-card>
                      </el-col>
                    </div>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane :label="$t('design.remixes')" name="second">
                  <el-row :gutter="20">
                    <!-- Remixes 的总数 -->
                    <div class="Number">Remixes • {{ remixesList.length }}</div>
                    <div
                      class="resourceWrapper"
                      v-for="(item, index) in remixesList"
                      :key="item.thingId"
                      @contextmenu="showMenu(index, item)"
                    >
                      <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                        <resource-card
                          :key="item.id"
                          @clickMoveMenu="Handler_MoveTo(item)"
                          @clickDelMenu="Handler_Del(item)"
                          @clickDownMenu="Handler_Down(item)"
                          @openCollection="openCollection"
                          @deleteCollection="deleteCollection"
                          :isCollected="myCollects.includes(item.id)"
                          :thing="item"
                          :showEdit="isLogin && isYourAccount"
                          :showMoreMenuBtn="isYourAccount && true"
                          :showAvatar="false"
                          :isYourAccount="isYourAccount"
                          :isLike="myLikesList.some((i) => i.id === item.id)"
                          :showStar="true"
                        >
                        </resource-card>
                      </el-col>
                    </div>
                  </el-row>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane :label="$t('design.likes')" name="second">
              <el-row :gutter="20">
                <!-- Likes 的总数 -->
                <div class="Number">
                  {{ $t("design.likes") }}• {{ Likes.length }}
                </div>
                <div v-for="item in Likes" :key="item.thingId">
                  <el-col :xs="24" :sm="12" :md="8" :lg="8" :xl="8">
                    <resource-card
                      :key="item.id"
                      :thing="item"
                      :showEdit="false"
                      :showStar="true"
                      @openCollection="openCollection"
                      :isLike="myLikes.includes(item.id)"
                      :isCollected="myCollects.includes(item.id)"
                      @deleteCollection="deleteCollection"
                    >
                    </resource-card>
                  </el-col>
                </div>
                <div class="noLikes" v-show="Likes.length == 0">
                  No Likes file
                </div>
              </el-row>
            </el-tab-pane>
            <el-tab-pane :label="$t('design.collection')" name="third">
              <div class="PrivateBox" id="PrivateBox">
                {{ $t("design.Private collections") }}
              </div>
              <el-divider
                class="CollectionsDivider"
                id="CollectionsDivider"
              ></el-divider>
              <!-- Collections 的总数 -->
              <div class="Numbers" id="NumberBox">
                {{ $t("design.collection") }} • {{ rowFolders.length }}
              </div>
              <!-- 默认收藏夹 -->
              <RowFolders
                v-show="!dialogCollectionVisible"
                :isYourAccount="isYourAccount"
                style="width: 100%; margin-bottom: 20px"
                :value="rowdraft"
                :onFolderAdd="onFolderAdd"
                @clickFolder="handleClickFolder"
                @delFolder="handleDelFolder"
                @getCollectList="getCollectList"
              ></RowFolders>
              <!-- 其他收藏夹 -->
              <RowFolder
                ref="child"
                v-show="!dialogCollectionVisible"
                :isYourAccount="isYourAccount"
                style="width: 105%; margin-bottom: 20px"
                :value="rowFolders"
                :onFolderAdd="onFolderAdd"
                @clickFolder="handleClickFolder"
                @delFolder="handleDelFolder"
                @getCollectList="getCollectList"
                @getMyCollectResourceList="getMyCollectResourceList"
              ></RowFolder>
              <div class="nav" v-show="dialogCollectionVisible">
                <i class="el-icon-back" @click="handleCollectDialogClose"></i>
                <el-tooltip
                  effect="light"
                  placement="bottom-start"
                  :visible-arrow="false"
                  :open-delay="1000"
                >
                  <div slot="content">
                    {{ collectionName }}
                  </div>
                  <div
                    class="collectionNameBox"
                    v-if="this.collectionName !== undefined"
                  >
                    {{ collectionName }}
                  </div>
                </el-tooltip>

                <div
                  v-if="this.collectionName !== undefined"
                  class="EditCollection"
                  @click.stop="handleRename()"
                >
                  {{ $t("design.Edit collections") }}
                </div>
                <div v-else>{{ $t("design.Liked resources") }}</div>
              </div>
              <el-divider
                class="ResourcesDivider"
                id="ResourcesDivider"
              ></el-divider>
              <div class="ResourcesBox" id="ResourcesBox">
                {{ $t("design.resources") }} • {{ folderCollection.length }}
              </div>
              <div class="collectionDialog" v-show="dialogCollectionVisible">
                <div
                  v-for="item in folderCollection"
                  :key="item.thingId"
                  style="width: 33.3%"
                >
                  <resource-card
                    @clickMoveMenu="Handler_MoveTo(item)"
                    @clickDelMenu="handleCancelCollect(item)"
                    @clickDownMenu="Handler_Down(item)"
                    @moveCollectionComplete="handleMoveCollectionComplete"
                    :isCollected="myCollects.includes(item.id)"
                    @openCollection="openCollection"
                    :thing="item"
                    :showEdit="false"
                    :showStar="true"
                    :showMoreMenuBtn="isYourAccount"
                    :key="item.id"
                    :isYourAccount="isYourAccount"
                    :isLike="myLikes.includes(item.id)"
                  >
                  </resource-card>
                </div>
                <div class="noCollection" v-show="folderCollection.length == 0">
                  {{ this.$t("design.noCollection") }}
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane class="Makes" :label="$t('design.makes')" name="five">
              <!-- Makes 的总数 -->
              <div class="Number">Makes • {{ makes.length }}</div>
              <el-drawer
                :modal="false"
                :visible.sync="showMake"
                :direction="direction"
                :before-close="closeMake"
              >
                <ElImageViewers
                  class="imageViewer"
                  v-if="showMake"
                  :on-close="closeMake"
                  :makesInfo="makesInfo"
                  :url-list="makes"
                  :isMake="true"
                  :initialIndex="index"
                ></ElImageViewers>
              </el-drawer>
              <div class="makes-box">
                <Make
                  v-for="(item, index) in makes"
                  :make="item"
                  :index="index"
                  :key="item.id"
                  class.native="Make"
                  @clickDownMenu="Handler_Down(item)"
                  @clickDelMenu="handleDelMakeClick(item)"
                  @openMake="openMake(item)"
                  @getIndex="getIndex"
                  :showMoreIcon="true"
                  :isYourAccount="isYourAccount"
                ></Make>
              </div>
            </el-tab-pane>
            <el-tab-pane
              v-if="isYourAccount"
              :label="$t('design.histories')"
              name="fourth"
            >
              <div style="display: flex; justify-content: space-between">
                <div>
                  <div class="HistoryTitle">{{ $t("design.History") }}</div>
                  <div class="HistoryTis">
                    {{
                      $t(
                        "design.Only show browsing history for the last 30 days"
                      )
                    }}
                  </div>
                </div>
                <div class="delsbutton" @click="delsHistories">
                  {{ $t("design.Clear the history") }}
                </div>
              </div>
              <el-row :gutter="20">
                <div v-for="item in histories" :key="item.thingId">
                  <el-col>
                    <historiesCard
                      :key="item.id"
                      :thing="item"
                      :isLike="myLikes.includes(item.id)"
                      @openCollection="openCollection"
                      @clickMoveMenu="Handler_MoveTo(item)"
                      @clickDelMenu="handleCancelCollect(item)"
                      @clickDownMenu="Handler_Down(item)"
                      @moveCollectionComplete="handleMoveCollectionComplete"
                      @deleteCollection="deleteCollection"
                      @getHistoriesList="getHistoriesList"
                      :isCollected="myCollects.includes(item.id)"
                    >
                    </historiesCard>
                  </el-col>
                </div>
              </el-row>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <SrollTopButton :to="'#top'"></SrollTopButton>
      <DownListPanel
        :isShowDownPanel="isShowDownPanel"
        :fileList="detail.files"
        :fileNum="detail.files.length"
        :downLoadNum="downloadNumber"
        :resourceName="detail.title"
        @click="openShowDownPanel"
      ></DownListPanel>
    </div>
  </div>
</template>

<script>
import { postNoticeMessageSend } from "@/api/user";
import FollowButton from "@/components/FollowButton.vue";
import SrollTopButton from "@/components/SrollTopButton/index.vue";
import ResourceCard from "@/components/ResourceCard/index.vue";
import HistoriesCard from "./components/HistoriesCard.vue";
import IndexFollowPanel from "./IndexFollowPanel.vue";
import CollectedOption from "@/components/CollectedOption";
import RowFolder from "@/components/RowFolder.vue";
import RowFolders from "./components/RowFolders.vue";
import DownListPanel from "@/components/DownListPanel.vue";
import {
  deleteCollectionResource,
  getCollectionResourceList,
} from "@/api/collection";
import {
  renameCollection,
  getResourceList,
  getCollectResourceList,
  getHistoriesList,
  deleteCollection,
  getLikesList,
  deleteResource,
  deleteMake,
  addCollection,
  cancelCollectResource,
  getFollowerList,
  getFollowingList,
  getProfile,
  getCollectList,
  moveResourceToCollection,
  addResourceToCollection,
  delsHistories,
} from "@/api/design";
import { getToken } from "@/utils/auth";
import { createNamespacedHelpers } from "vuex";
import { getResource } from "@/api/resource";
import ElImageViewers from "@/components/ImageViewers";
import Make from "./components/Make.vue";
import { getMakeList } from "@/api/user";
import { generatorDefaultAvator } from "@/utils/generateImage";
const { mapState } = createNamespacedHelpers("user");
export default {
  name: "Design",
  components: {
    IndexFollowPanel,
    FollowButton,
    SrollTopButton,
    ResourceCard,
    HistoriesCard,
    CollectedOption,
    RowFolder,
    RowFolders,
    DownListPanel,
    Make,
    ElImageViewers,
  },
  data() {
    return {
      form: {
        avatar: "",
      },
      direction: "ttb",
      makeId: "",
      defaultAvatar: "",
      makes: [],
      makes2: [],
      makesInfo: {},
      sendVisible: false,
      renameVisible: false,
      ClickFolde: false,
      item: "",
      collectionMessage: {
        name: "",
      },
      collectionMessages: "",
      ShareVisible: false,
      shareLink: {
        // text文本后边可以传要share的url，注意后期修改
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
        twitter: `https://twitter.com/share?url=${window.location.href}`,
        whatsapp: `https://web.whatsapp.com/send?text=${window.location.href}`,
        instagram: `https://www.instagram.com/`,
      },
      showMake: false,
      index: 0,
      remixesList: [],
      detail: {
        creator: {
          avatar: "",
          name: "UNKNOW",
        },
        description: "",
        files: [],
        id: "",
        images: "",
        license: "",
        like_count: 0,
        collect_count: 0,
        tags: [],
        title: "",
        tutorials: [],
        update_time: "1990-01-01",
      },
      resourceActiveTab: "first",
      isShowDownPanel: false,
      collectionName: "",
      myFollowList: [],
      folderCollection: [],
      followerList: [],
      followingList: [],
      dialogCollectionVisible: false,
      isYourAccount: false,
      myCollects: [],
      thing: {},
      openCollectedOption: false,
      folders: [],
      rowFolders: [],
      rowdraft: [],
      headers: {
        Authorization: getToken(),
      },
      histories: [],
      collections: [],
      Likes: [],
      myLikes: [],
      transferIndex: null,
      contextMenuData: {
        menuName: "demo",
        axis: {
          x: null,
          y: null,
        },
        menulists: [
          {
            btnName: this.$t("design.Delete"),
            fnHandler: "Handler1",
            disabled: !this.isYourAccount,
          },
          {
            btnName: this.$t("design.moveTo"),
            fnHandler: "Handler2",
          },
          {
            btnName: this.$t("design.download"),
            fnHandler: "Handler3",
          },
        ],
      },
      collectionStyle: {
        position: "absolute",
        left: "0px",
        top: "0px",
      },
      resources: [],
      myFollowingList: [],
      activeTab: "first",
      activeName: "first",
      isDescEdit: false,
      pagination: {
        pageSize: 10,
        currentPage: 1,
      },
      dialogFollowersVisible: false,
      user: {
        // 自己或他人的用户信息
        avatar: "",
        cover_image: "",
        description: "",
        follower_count: "",
        following_count: "",
        id: 0,
        name: "",
      },
      collectionId: "",
      userId: "", //自己或他人的主页
      prepareCollectedResId: "", //收藏的资源id
    };
  },
  watch: {
    "$store.getters.isLogin"() {
      console.log("change login status");
      if (this.$store.getters.isLogin) {
        this.getAllMyCollectList();
        this.getMyFollowingList();
        this.getMyLikesList().then(() => {});
        if (this.activeName == "first") {
          console.log(1);
        } else if (this.activeName == "second") {
          console.log(1);
        } else if (this.activeName == "third") {
          console.log(1);
        } else if (this.activeName == "fourth") {
          console.log(1);
        }
      } else {
        if (this.isYourAccount) {
          // this.$router.push("/");
        }
      }
    },
  },
  mounted() {
    let userId = this.$route.params.userId;
    // console.log("route", this.$route.params);
    if (userId == "fromLike") {
      this.isYourAccount = true;
      this.getLikesList();
      this.activeName = "second";
    } else if (userId == "fromProfile") {
      this.isYourAccount = true;
      this.getResourceList();
    } else if (userId == "fromHistory") {
      this.isYourAccount = true;
      this.getHistoriesList();
      this.activeName = "fourth";
    } else if (this.userInfo.user_id == userId) {
      this.isYourAccount = true;
      this.getResourceList();
    } else {
      this.isYourAccount = false;
      this.user.userId = userId;
      if (this.isLogin) {
        this.getMyLikesList().then(() => {});
        this.getResourceList();
      } else {
        this.getResourceList();
      }
    }
    this.showPanel();
    if (this.isYourAccount && !this.isLogin) {
      this.$router.replace("/");
    }
    this.userId = this.isYourAccount ? this.userInfo.user_id : this.user.userId;
    this.contextMenuData.menulists[0].disabled = !this.isYourAccount;
    this.isLogin ? this.getAllMyCollectList() : "";
    this.isLogin && !this.isYourAccount && this.getMyFollowingList();
    // console.log(this.user.name, this.userInfo.nick_name);
  },
  computed: {
    ...mapState(["userInfo"]),
    ...mapState(["isLogin", "myLikesList"]),
    downloadNumber() {
      return this.detail.files.reduce((pre, cur) => {
        return pre + cur.downloadCount;
      }, 0);
    },
    descFormat() {
      return this.user.description;
    },
    // 当用户没有上传头像时自动生成系统头像
    avatar() {
      return this.form.avatar
        ? this.form.avatar
        : generatorDefaultAvator(this.form.name, this.form.id);
    },
  },
  methods: {
    copyUserUrlLink(url) {
      let target = document.createElement("input");
      target.value = url;
      document.body.appendChild(target);
      target.select();
      document.execCommand("Copy");
      this.$message.success(this.$t("design.copyLinkSuccess"));
      target.remove();
    },
    ShareClick() {
      this.ShareVisible = true;
    },
    ReportClick() {
      console.log(928);
    },
    // share弹窗
    Sharedialog() {
      this.ShareVisible = true;
    },
    close() {
      this.ShareVisible = false;
    },
    // 复制链接
    copyLink() {
      let oInput = document.createElement("input");
      oInput.value = window.location.href;
      document.body.appendChild(oInput);
      oInput.select();
      document.execCommand("Copy");
      oInput.remove();
      this.$message.success(this.$t("thing.copyLink"));
    },
    // share链接
    share(url) {
      let name = ""; //网页名称，可为空;
      let iWidth = 500; //弹出窗口的宽度;
      let iHeight = 670; //弹出窗口的高度;
      //window.screen.height获得屏幕的高，window.screen.width获得屏幕的宽
      let iTop = (window.screen.height - iHeight) / 2; //获得窗口的垂直位置;
      let iLeft = (window.screen.width - iWidth) / 2; //获得窗口的水平位置;
      let strWindowFeatures = `top=${iTop},left=${iLeft},height= ${iHeight} ,innerHeight= ${iHeight} ,width= ${iWidth} ,innerWidth=${iWidth} ,toolbar=no,menubar=no,scrollbars=auto,resizable=no,location=no,status=no`;
      window.open(url, name, strWindowFeatures);
    },
    send() {
      this.sendVisible = true;
    },
    closeSend() {
      this.form.content = "";
      this.sendVisible = false;
    },
    sendimg() {
      this.sendVisible = false;
      postNoticeMessageSend({
        id: this.form.id,
        content: this.form.content,
      })
        .then((params) => {
          console.log(params.data.code);
          this.$message({
            message: this.$t("comment.sendOk"),
            type: "success",
          });
        })
        .catch(() => {
          this.$message({
            message: this.$t("please wait for reply"),
            type: "error",
          });
        });
      this.form.content = "";
    },
    // 删除历史所有记录
    delsHistories() {
      this.$confirm(this.$t("design.deleteHistories"), this.$t("design.tips"), {
        confirmButtonText: this.$t("design.confirm"),
        cancelButtonText: this.$t("design.cancel"),
      })
        .then(function () {
          return delsHistories();
        })
        .then(() => {
          this.getHistoriesList();
          this.$modal.msgSuccess("Successfully deleted");
        })
        .catch(() => {});
    },
    showPanel() {
      getProfile(
        this.isYourAccount ? this.userInfo.user_id : this.$route.params.userId
      ).then((params) => {
        this.form = params.data.data;
        if (`http://`.indexOf("this.form.facebook")) {
          this.form.facebook = `http://` + this.form.facebook;
        }
        if (`http://`.indexOf("this.form.tiktok")) {
          this.form.tiktok = `http://` + this.form.tiktok;
        }
        if (`http://`.indexOf("this.form.twitter")) {
          this.form.twitter = `http://` + this.form.twitter;
        }
        if (`http://`.indexOf("this.form.instagram")) {
          this.form.instagram = `http://` + this.form.instagram;
        }
        // 初始化user对象的封面图片
        this.user.cover_image = params.data.data.cover_image;
      });
    },
    handleShowProfile() {
      this.$router.push({ path: "/Setting" });
    },
    FollowButton() {
      getProfile(this.userId).then((params) => {
        let res = params.data.data;
        Object.assign(this.user, res);
      });
    },
    closeFollowDialog() {
      getProfile(this.userId).then((params) => {
        let res = params.data.data;
        Object.assign(this.user, res);
      });
    },
    closeAllDialog() {
      this.isShowDownPanel = false;
      this.openCollectedOption = false;
    },
    getIndex(index) {
      this.index = index;
      getMakeList({ userId: this.userId }).then((res) => {
        this.makes2 = res.data.rows;
        this.makesInfo = this.makes2[this.index].resource;
        this.makesInfo.isDesignShow = true;
      });
    },
    openMake(item) {
      this.makeId = item.id;
      this.showMake = true;
      document.documentElement.style.overflowY = "hidden";
    },
    closeMake() {
      this.showMake = false;
      document.documentElement.style.overflowY = "scroll";
      this.getMakeList();
    },
    handleDelMakeClick(item) {
      if (!this.$store.getters.isLogin) {
        let payload = { loginDialogVisible: true, isLoginForm: true };
        this.$store.dispatch("user/switchLoginRegisteForm", payload);
        return;
      }
      this.$confirm(this.$t("design.delFileTip"), this.$t("design.tips"), {
        confirmButtonText: this.$t("design.confirm"),
        cancelButtonText: this.$t("design.cancel"),
      }).then(() => {
        deleteMake({ resId: item.id }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("design.delSuccess"),
          });
          this.getMakeList();
        });
      });
    },
    openShowDownPanel() {
      if (!this.isShowDownPanel) {
        this.openCollectedOption = false;
      }
      this.isShowDownPanel = !this.isShowDownPanel;
    },
    openCollection(id, left, top) {
      this.openCollectedOption = true;
      this.collectionStyle.position = "absolute";
      this.collectionStyle.left = left + "px";
      this.collectionStyle.top = top + "px";
      this.prepareCollectedResId = id;
      getCollectList({
        userId: this.$store.getters.userInfo.user_id,
      }).then((res) => {
        this.folders = res.data.data;
      });
    },
    deleteCollection(id) {
      deleteCollectionResource({
        userId: this.$store.getters.userInfo.user_id,
        resourceId: id,
      }).then(() => {
        this.$message({
          message: this.$t("design.delSuccess"),
          type: "success",
        });
        this.getAllMyCollectList();
      });
    },
    handleCollectDialogClose() {
      this.ClickFolder = false;
      this.getCollectList();
      this.getMyCollectResourceList();
      this.dialogCollectionVisible = false;
      document.getElementById("NumberBox").style.visibility = "visible";
      document.getElementById("PrivateBox").style.visibility = "visible";
      document.getElementById("CollectionsDivider").style.visibility =
        "visible";
      document.getElementById("ResourcesDivider").style.visibility = "hidden";
      document.getElementById("ResourcesBox").style.visibility = "hidden";
    },
    handleCancelCollect(item) {
      this.$confirm(this.$t("design.delFileTip"), this.$t("design.tips"), {
        confirmButtonText: this.$t("design.confirm"),
        cancelButtonText: this.$t("design.cancel"),
      }).then(() => {
        if (this.dialogCollectionVisible) {
          cancelCollectResource({
            collectionId: this.collectionId,
            resId: item.id,
          }).then(() => {
            this.getCollectFolderResourceList();
          });
        } else {
          cancelCollectResource({
            collectionId: 0,
            resId: item.id,
          }).then(() => {
            this.getCollectResourceList();
          });
        }
      });
    },
    handleClickFolder(item) {
      document.getElementById("NumberBox").style.visibility = "hidden";
      document.getElementById("PrivateBox").style.visibility = "hidden";
      document.getElementById("CollectionsDivider").style.visibility = "hidden";
      document.getElementById("ResourcesDivider").style.visibility = "visible";
      document.getElementById("ResourcesBox").style.visibility = "visible";
      this.ClickFolder = true;
      this.item = item;
      this.collectionId = item.id;
      this.collectionName = item.name;
      this.getCollectFolderResourceList();
    },
    // 关闭编辑收藏夹弹窗
    closerename() {
      this.renameVisible = false;
      this.item.name = this.collectionMessages;
      this.$emit("getCollectList");
    },
    rename() {
      renameCollection(this.collectionMessage)
        .then(() => {
          this.collectionMessage.isEdit = false;
          this.renameVisible = false;
          this.handleClickFolder(this.item);
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "Name changed successfully",
          });
        });
    },
    handleRename() {
      this.renameVisible = true;
      this.item.isEdit = true;
      this.collectionMessage = this.item;
      this.collectionMessages = this.item.name;
    },
    handleDelClick(item) {
      this.handleDelFolder(item);
      item.showMoreMenu = false;
      this.renameVisible = false;
    },
    handleDelFolder(item) {
      this.$confirm(this.$t("design.delFolderTip"), this.$t("design.tips"), {
        confirmButtonText: this.$t("design.confirm"),
        cancelButtonText: this.$t("design.cancel"),
      }).then(() => {
        deleteCollection({ collectionId: item.id }).then(() => {
          this.getCollectList();
          this.$refs.child.closerename();
          this.$message({
            type: "success",
            message: this.$t("design.delSuccess"),
          });
        });
        if (this.ClickFolder) {
          this.handleCollectDialogClose();
        }
      });
    },
    onFolderAdd(item) {
      return new Promise((resolve) => {
        let req = {
          name: item.name,
          userId: this.userInfo.user_id,
        };
        addCollection(req).then(() => {
          this.getCollectList().then(() => {
            return resolve(1);
          });
        });
      });
      // this.folder = [...e];
    },
    closeCollectedOption() {
      this.openCollectedOption = false;
    },
    handleMoveCollectionComplete() {
      // if (this.dialogCollectionVisible) {
      //   this.getCollectResourceList();
      //   this.getCollectFolderResourceList();
      // } else {
      //   this.getCollectResourceList();
      // }
    },
    moveCollectedOption(folderObject) {
      // this.isCollected = true;
      if (this.activeName == "first") {
        this.openCollectedOption = false;
        console.log("mova", this.myCollects);

        if (this.myCollects.includes(this.prepareCollectedResId)) {
          console.log("move---------------------");
          moveResourceToCollection({
            resourceId: this.prepareCollectedResId,
            collectionId: folderObject.id,
          }).then((res) => {
            console.log(res);
            this.isYourAccount && this.getCollectResourceList();
            if (this.isYourAccount && this.dialogCollectionVisible) {
              this.getCollectFolderResourceList();
            }
            this.getAllMyCollectList();

            this.$message({
              message: this.$t("design.moveSuccess"),
              type: "success",
            });
          });
        } else {
          console.log("add---------------------");
          addResourceToCollection({
            resourceId: this.prepareCollectedResId,
            collectionId: folderObject.id,
          }).then((res) => {
            console.log(res);
            this.isYourAccount && this.getCollectResourceList();
            if (this.isYourAccount && this.dialogCollectionVisible) {
              this.getCollectFolderResourceList();
            }
            this.getAllMyCollectList();

            this.$message({
              message: this.$t("design.moveSuccess"),
              type: "success",
            });
          });
        }
      } else if (this.activeName == "second") {
        this.openCollectedOption = false;
        addResourceToCollection({
          resourceId: this.prepareCollectedResId,
          collectionId: folderObject.id,
        }).then(() => {
          this.getAllMyCollectList();
          this.$message({
            message: this.$t("design.moveSuccess"),
            type: "success",
          });
        });
      } else if (this.activeName == "third") {
        this.openCollectedOption = false;
        if (this.myCollects.includes(this.prepareCollectedResId)) {
          moveResourceToCollection({
            resourceId: this.prepareCollectedResId,
            collectionId: folderObject.id,
          }).then((res) => {
            console.log(res);
            this.isYourAccount && this.getCollectResourceList();
            if (this.isYourAccount && this.dialogCollectionVisible) {
              this.getCollectFolderResourceList();
            }
            this.getAllMyCollectList();

            this.$message({
              message: this.$t("design.moveSuccess"),
              type: "success",
            });
          });
        } else {
          addResourceToCollection({
            resourceId: this.prepareCollectedResId,
            collectionId: folderObject.id,
          }).then((res) => {
            console.log(res);
            this.isYourAccount && this.getCollectResourceList();
            if (this.isYourAccount && this.dialogCollectionVisible) {
              this.getCollectFolderResourceList();
            }
            this.getAllMyCollectList();

            this.$message({
              message: this.$t("design.moveSuccess"),
              type: "success",
            });
          });
        }
      } else if (this.activeName == "fourth") {
        this.openCollectedOption = false;
        addResourceToCollection({
          resourceId: this.prepareCollectedResId,
          collectionId: folderObject.id,
        }).then(() => {
          this.getAllMyCollectList();
          this.$message({
            message: this.$t("design.moveSuccess"),
            type: "success",
          });
        });
      }
    },
    addFolder(folderName) {
      addCollection({ name: folderName })
        .then(() => {
          this.$message({
            message: this.$t("design.addSuccess"),
            type: "success",
          });
        })
        .then(() => {
          getCollectList({ userId: this.userId }).then((res) => {
            this.folders = res.data.data;
          });
        });
    },
    getMyFollowingList() {
      getFollowingList({ userId: this.userInfo.user_id }).then((res) => {
        this.myFollowingList = [];
        this.myFollowingList = res.data.data.map((item) => {
          return item.id - 0;
        });
      });
    },
    handleFollowTapClick() {
      this.getMyFollowList();
      if (this.activeTab == "first") {
        this.followerList = [];

        getFollowerList({ userId: this.userId }).then((res) => {
          this.followerList = res.data.data;
        });
      } else {
        this.followingList = [];

        getFollowingList({ userId: this.userId }).then((res) => {
          this.followingList = res.data.data;
        });
      }
    },
    getResourceList() {
      if (this.isYourAccount) {
        getResourceList({
          userId: this.userInfo.user_id,
          type: "mine",
        }).then((res) => {
          this.resources = res.data.rows;
        });
      } else {
        let userId = this.user.userId;

        getResourceList({ userId, type: "mine" }).then((res) => {
          this.resources = res.data.rows;
        });
      }
    },
    getRemixesList() {
      if (this.isYourAccount) {
        getResourceList({
          userId: this.userInfo.user_id,
          type: "remix",
        }).then((res) => {
          this.remixesList = res.data.rows;
        });
      } else {
        let userId = this.user.userId;
        getResourceList({ userId, type: "remix" }).then((res) => {
          this.remixesList = res.data.rows;
        });
      }
    },
    getLikesList() {
      if (this.isYourAccount) {
        this.getMyLikesList();
      } else {
        let userId = this.user.userId;
        getLikesList({ userId }).then((res) => {
          this.Likes = res.data.rows;
          if (this.isLogin) {
            this.getMyLikesList();
          }
        });
      }
    },
    getMyLikesList() {
      return new Promise((resolve) => {
        getLikesList({ userId: this.userInfo.user_id }).then((res) => {
          this.myLikes = [];

          if (this.isYourAccount) {
            this.Likes = res.data.rows;
          }
          for (const item of res.data.rows) {
            this.myLikes.push(item.id);
          }
          resolve(1);
        });
      });
    },
    getCollectList(myUserId) {
      return new Promise((resolve) => {
        getCollectList({ userId: myUserId || this.userId }).then((params) => {
          this.rowFolders = params.data.data.map((item) => {
            item.showMoreMenu = false;
            item.isEdit = false;
            return item;
          });
          this.rowFolders.splice(0, 0, {});
          resolve(1);
        });
      });
    },
    getCollectResourceList() {
      this.isLogin && this.getMyLikesList();
      if (!this.isYourAccount) {
        let userId = this.user.userId;
        getCollectResourceList({
          collectionId: 0,
          userId: userId,
        }).then((res) => {
          this.collections = res.data.rows;
          this.isLogin && this.getAllMyCollectList();
        });
      } else {
        this.getMyCollectResourceList();
      }
    },
    getMyCollectResourceList() {
      this.myCollects = [];
      return new Promise((resolve) => {
        getCollectResourceList({
          collectionId: 0,
          userId: this.userInfo.user_id,
        }).then((res) => {
          if (this.isYourAccount) {
            this.collections = res.data.rows;
            if (this.rowdraft == []) {
              this.rowdraft.push(this.collections);
            } else {
              this.rowdraft = [];
              this.rowdraft.push(this.collections);
            }
            for (const item of res.data.rows) {
              this.myCollects.push(item.id);
            }
          }
          resolve(1);
        });
      });
    },
    getCollectFolderResourceList() {
      this.isLogin && this.getAllMyCollectList();
      this.isLogin && !this.isYourAccount && this.getMyLikesList();

      if (!this.isYourAccount) {
        let userId = this.user.userId;
        getCollectResourceList({
          collectionId: this.collectionId || 0,
          userId: userId,
        }).then((res) => {
          this.folderCollection = res.data.rows;
          this.dialogCollectionVisible = true;
        });
      } else {
        this.getMyCollectFolderResourceList().then(() => {
          this.dialogCollectionVisible = true;
        });
      }
    },
    getMyCollectFolderResourceList() {
      return new Promise((resolve) => {
        getCollectResourceList({
          collectionId: this.collectionId || 0,
          userId: this.userInfo.user_id,
        }).then((res) => {
          if (this.isYourAccount) {
            this.folderCollection = res.data.rows;
          }
          resolve(1);
        });
      });
    },
    getHistoriesList() {
      if (this.isYourAccount) {
        getHistoriesList({ userId: this.userInfo.user_id }).then((res) => {
          this.histories = res.data.rows;
        });
      } else {
        let userId = this.user.userId;
        getHistoriesList({ userId }).then((res) => {
          this.histories = res.data.rows;
        });
      }
      this.isLogin && this.getMyLikesList();
    },
    showMenu(index, item) {
      console.log("item: ", item);
      console.log("index: ", index);
      this.transferIndex = index; // tranfer index to child component
      event.preventDefault();
      var x = event.clientX;
      var y = event.clientY;
      this.contextMenuData.axis = {
        x,
        y,
      };
    },
    Handler_Del(item) {
      this.$confirm(this.$t("design.delFileTip"), this.$t("design.tips"), {
        confirmButtonText: this.$t("design.confirm"),
        cancelButtonText: this.$t("design.cancel"),
      }).then(() => {
        deleteResource({ resId: item.id }).then(() => {
          this.$message({
            type: "success",
            message: this.$t("design.delSuccess"),
          });
          this.getResourceList();
          this.getRemixesList();
        });
      });
    },
    Handler_MoveTo(thing) {
      this.prepareCollectedResId = thing.id;
      this.collectionStyle.left = "41%";
      this.collectionStyle.top = "33%";
      this.collectionStyle.position = "fixed";
      getCollectList({ userId: this.userInfo.user_id }).then((res) => {
        this.folders = res.data.data;
        this.openCollectedOption = true;
      });
    },
    Handler_Down(item) {
      getResource(item.id).then((res) => {
        this.detail = res.data.data;
        this.isShowDownPanel = true;
      });
    },
    handleBeforeImgUpload(file) {
      const isJPG = file.type.includes("image");
      const isLt1M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error(this.$t("design.onlyImg"));
      }
      if (!isLt1M) {
        this.$message.error("上传头像图片大小不能超过 1MB!");
        return false;
      }
      return isJPG;
    },

    handleImgUploadErr(err) {
      //console.log(e)
      this.$message.error(this.$t("design.uploadFail") + err);
    },
    handleImgUploadSuccess() {
      this.$store.dispatch("user/getUserInfo").catch((e) => {
        console.log(e);
      });
      this.$message.success(this.$t("design.uploadSuccess"));
    },
    handleBgImgUploadSuccess(res, file) {
      console.log("res: ", res, file);
      this.user.cover_image = res.data;
      this.$message.success(this.$t("design.uploadSuccess"));
    },
    getMyFollowList() {
      getFollowingList({ userId: this.userInfo.user_id }).then((result) => {
        let res = [];
        for (const item of result.data.data) {
          res.push(item.id);
        }
        // console.log(result.data.data, 1246);
        this.myFollowList = res;
      });
    },
    openFollowDialog(index) {
      this.activeTab = index;
      console.log(index, 1596);
      this.getMyFollowList();
      if (index == "first") {
        getFollowerList({ userId: this.userId }).then((res) => {
          this.followerList = res.data.data;
          this.dialogFollowersVisible = true;
        });
      } else {
        getFollowingList({ userId: this.userId }).then((res) => {
          this.followingList = res.data.data;
          console.log(this.followingList, 1598);
          this.dialogFollowersVisible = true;
        });
      }
    },
    getAllMyCollectList() {
      getCollectionResourceList({
        userId: this.userInfo.user_id,
      }).then((res) => {
        this.myCollects = [];
        for (let i = 0; i < res.data.rows.length; i++) {
          const element = res.data.rows[i];
          this.myCollects.push(element.id);
        }
      });
    },
    async handleResourceClick() {
      this.openCollectedOption = false;
      console.log(this.activeName, 1606);
      if (this.activeName == "first" && this.resourceActiveTab == "first") {
        this.isLogin && !this.isYourAccount && this.getMyLikesList();
        this.getAllMyCollectList();
        this.getResourceList();
      } else if (this.activeName == "second") {
        this.getAllMyCollectList();
        this.getLikesList();
      } else if (this.activeName == "third") {
        this.getAllMyCollectList();
        this.getCollectList();
        this.getCollectResourceList();
      } else if (this.activeName == "five") {
        this.getAllMyCollectList();
        this.getMakeList();
      } else if (this.activeName == "fourth") {
        this.getAllMyCollectList();
        this.getHistoriesList();
        this.isLogin && this.getAllMyCollectList();
      }
    },
    getMakeList() {
      getMakeList({ userId: this.userId }).then((res) => {
        this.makes = res.data.rows;
        this.makes.map((item) => {
          if (item.image) {
            item.image = item.image.split(",");
            item.url = item.image[0];
          } else {
            item.image = "";
            item.url = "";
          }
        });
      });
    },
    async handleResourceTabClick() {
      if (this.resourceActiveTab == "first") {
        this.getResourceList();
      } else if (this.resourceActiveTab == "second") {
        this.getRemixesList();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.PrivateBox {
  padding-top: 8px;
  font-size: 20px;

  font-weight: 400;
  color: #333333;
}
.CollectionsDivider {
  position: absolute;
  top: 40px;
  width: 1074px;
  height: 1px;
  background: #999999;
}
.ResourcesDivider {
  visibility: hidden;
  position: absolute;
  top: 72px;
  width: 1074px;
  height: 1px;
  background: #999999;
}
.closeaddname {
  position: relative;
  top: -60px;
  left: 168px;
  font-size: 18px;
}
::v-deep .el-dialog__header {
  text-align: left;
}
::v-deep .el-input {
  margin-bottom: 15px;
}
.buttonBox {
  .Deletecollection {
    color: red;
    width: 70px;
    height: 48px;
    text-align: center;
    line-height: 48px;
    border-radius: 8px;
    cursor: pointer;
  }
  display: flex;
  justify-content: space-between;
  ::v-deep .el-button {
    margin-left: 20px;
    background: #1a77e3;
    color: #fff;
  }
}
.iconbutton {
  height: 40px;
  display: flex;
  justify-content: space-between;
  padding-right: 35px;
  margin: 35px 0;
}
.edit {
  padding: 9px 12px;
  background: #f0f3fa;
  border: 1px solid #cccccc;
  border-radius: 6px;
  cursor: pointer;
  margin-right: 48px;
  font-size: 14px;

  font-weight: 400;
  color: #1a1a1a;
}
.edit:hover {
  background: #cccccc;
}
.share {
  display: flex;
  padding: 9px 12px;
  background: #f0f3fa;
  border: 1px solid #cccccc;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;

  font-weight: 400;
  color: #1a1a1a;
  .ShareBox {
    margin-left: 4px;
  }
}
.share:hover {
  background: #cccccc;
}
// ::v-deep .el-dropdown-menu {
//   width: 184px;
//   height: 56px;
//   background: #8ab5ef;
//   border-radius: 8px;
// }

.send {
  width: 112px;
  height: 40px;
  padding-left: 36px;
  background: #f0f3fa;
  border: 1px solid #cccccc;
  border-radius: 8px;
  cursor: pointer;
}
.ShareReport {
  cursor: pointer;
}
.ShareReportbox {
  width: 32px;
  height: 40px;
  background: #f0f3fa;
  border: 1px solid #cccccc;
  border-radius: 8px;
  overflow: hidden;
  ::v-deep .el-button {
    font-size: 30px;
    border-radius: 8px;
    position: relative;
    top: -1px;
    left: -2px;
  }
}
.buttonsvgicon {
  position: relative;
  top: -8px;
  left: -19px;
}
.ShareReporttext {
  display: flex;
  width: 184px;
  height: 56px;
  background: #ffffff;
  border-radius: 8px;
}
.ShareReporttext:hover {
  width: 184px;
  height: 56px;
  background: #8ab5ef;
  border-radius: 8px;
}
.ShareReportsvgicon {
  font-size: 22px;
  margin: 17px;
}
.el-icon-share:before {
  font-size: 22px;
}
.ShareReporttitle {
  width: 100%;
  height: 100%;
  line-height: 56px;
  font-size: 16px;

  font-weight: 400;
  color: #1a1a1a;
}
.ShareReporttitle:hover {
  width: 100%;
  height: 100%;
  font-size: 16px;

  font-weight: 400;
  color: #ffffff;
}
.icon {
  display: flex;
  margin: 18px 0 35px 0;
}
.title {
  font-size: 16px;

  font-weight: 400;
  color: #1a1a1a;
}
.url {
  font-size: 14px;

  color: #999999;
  margin-top: 17px;
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  .copy-user-url-link {
    margin-right: 48px;
    cursor: pointer;
    color: #999;
  }
  .copy-user-url-link:active {
    color: #1e78f0;
  }
  .copy-user-url-link:hover {
    color: #1e78f0;
  }
}
.share-icon {
  font-size: 34px;
  display: block;
  cursor: pointer;
  // background: #e8ebf4;
  line-height: 40px;
  border-radius: 8px;
  .sharetitlebox {
    height: 40px;
    line-height: 40px;
    margin-left: 16px;
    font-size: 16px;

    font-weight: 400;
    color: #1a1a1a;
  }
}
.shareiconbox {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
  align-content: space-between;
  margin-top: 23px;
}
.sendimgbox {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}
.sendimg {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.makes-box {
  display: grid;
  grid-template-columns: auto auto auto;
  justify-content: start;
  grid-gap: 32px 28px;
}
.Make {
  $width: 328px;
  ::v-deep .more-image {
    width: $width;
    height: 248px;
  }
  ::v-deep .makes-mask {
    width: $width;
  }
}
.collectMenu {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  z-index: 9999;
}
.img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
.container-profile {
  width: 1440px;
  margin: 0 auto;
  padding-bottom: 100px;
  .DialogCollection {
    ::v-deep .el-dialog {
      width: 1000px;
    }
  }
  .collectionDialog {
    display: flex;
    flex-wrap: wrap;
  }
  .noLikes {
    margin: 10px;
    // width: 33.3%;
    text-align: center;
    margin: 0px auto;
    margin-top: 40px;
    font-size: 20px;

    font-weight: 400;
    color: #999999;
  }
  .noCollection {
    margin: 10px;
    // width: 33.3%;
    text-align: center;
    margin: 0px auto;
    margin-top: 40px;
    font-size: 20px;

    font-weight: 400;
    color: #999999;
  }

  .ShareVisibledialog {
    ::v-deep .el-dialog {
      width: 464px;
      border-radius: 10px;
    }
    ::v-deep .el-dialog__header {
      padding: 50px 31px 10px;
    }
    ::v-deep .el-dialog__title {
      position: absolute;
      top: 31px;
      left: 32px;
      font-size: 20px;

      font-weight: 400;
      color: #141414;
    }
    ::v-deep .el-dialog__body {
      padding: 0px 45px 37px 45px;
    }
  }
  .SendVisibledialog {
    ::v-deep .el-dialog {
      width: 464px;
      border-radius: 10px;
    }
    ::v-deep .el-dialog__header {
      padding: 50px 31px 10px;
    }
    ::v-deep .el-dialog__title {
      position: absolute;
      top: 26px;
      left: 32px;
      font-size: 16px;

      font-weight: 400;
      color: #999999;
      line-height: 48px;
    }
    ::v-deep .el-dialog__body {
      padding: 13px 33px 11px 33px;
    }
  }
  ::v-deep .el-tabs__item.is-active {
    color: #1e78f0;
  }

  .tabsContent {
    ::v-deep .el-tabs__nav-wrap::after {
      background-color: #f0f3fa;
    }
    ::v-deep .resourceTabsContent {
      .el-tabs__nav-wrap::after {
        height: 0px;
      }
      .el-tabs__active-bar {
        height: 0;
      }
      .el-tabs__item {
        // padding: 0 20px;
        width: 120px;
        height: 40px;
        font-size: 16px;

        font-weight: 400;
        color: #999999;
        padding: 0;
        text-align: center;
      }
      .is-active {
        background: #1e78f0;
        border-radius: 8px;
        color: white !important;
        // padding: 0 20px;
        font-size: 16px;
        margin-top: 16px;

        font-weight: 400;
      }
    }
    ::v-deep .el-tabs__item {
      font-size: 20px;
      padding-right: 122px;

      font-weight: 400;
      color: #999999;
    }
    .contextMenu {
      box-sizing: border-box;
      padding: 8px;
      color: black;
      width: 160px;
      // height: 176px;
      background: #ffffff;
      box-shadow: 0px 2px 10px 0px rgba(0, 0, 0, 0.07);
      border-radius: 10px;

      ::v-deep {
        .context-menu-list {
          background-color: white;
          // width: 144px;
          margin: 0;
          padding-top: 8px;

          .no-child-btn {
            height: 48px;
            padding: 10px;
            margin: auto;
            font-size: 16px;

            font-weight: 400;
            color: #1a1a1a;
          }
          // .no-child-btn:hover {

          // }
        }
        .context-menu-list:hover {
          background: #8ab5ef !important;
          font-size: 16px;
          width: 144px;
          // height: 48px;
          color: #ffffff;
          border-radius: 8px;
        }
      }
    }
  }

  box-sizing: border-box;
  .tabs {
    width: 1072px;
    position: relative;
    margin-top: 34px;
    .editTab {
      position: absolute;
      top: 12px;
      right: 12px;
    }
    ::v-deep {
      .el-tabs__content {
        overflow: visible;
      }
    }
    .draft {
      font-size: 14px;

      font-weight: 400;
      color: #cccccc;
      border-top: 1px solid #999999;
      padding: 10px;
      margin: 0 15px;
    }
    .nav {
      display: flex;
      font-size: 20px;
      margin-bottom: 16px;
      position: relative;
      top: -41px;
      .collectionNameBox {
        width: 210px;
        height: 30px;
        /* 1.溢出隐藏 */
        overflow: hidden;
        /* 2.用省略号来代替超出文本 */
        text-overflow: ellipsis;
        /* 3.设置盒子属性为-webkit-box  必须的 */
        display: -webkit-box;
        /* 4.-webkit-line-clamp 设置为2，表示超出2行的部分显示省略号，如果设置为3，那么就是超出3行部分显示省略号 */
        -webkit-line-clamp: 1;
        /* 5.字面意思：单词破坏：破坏英文单词的整体性，在英文单词还没有在一行完全展示时就换行  即一个单词可能会被分成两行展示 */
        word-break: break-all;
        // /* 6.盒子实现多行显示的必要条件，文字是垂直展示，即文字是多行展示的情况下使用 */
        -webkit-box-orient: vertical;
      }
      .EditCollection {
        margin-left: 665px;
        width: 152px;
        height: 48px;
        background: #1e78f0;
        border-radius: 8px;
        cursor: pointer;
        text-align: center;
        font-size: 16px;

        font-weight: 400;
        color: #ffffff;
        line-height: 48px;
      }
      .EditCollection:hover {
        background: #cccccc;
      }
      .el-icon-back {
        font-size: 30px;
        margin-right: 16px;
        cursor: pointer;
      }
    }
  }
  .bg {
    margin: 0 auto;
    width: 1440px;
    height: 392px;
    position: relative;
    .upload-bg {
      // right: 12px;
      // top: 12px;
      position: absolute;
      top: -11px;
      left: -9px;
      width: 48px;
      height: 48px;
      background: #1a1a1a;
      opacity: 0.3;
      border-radius: 6px;
      ::v-deep .el-upload--text {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        cursor: pointer;
      }
    }
    .ortur-icon-pen {
      width: 22px;
      height: 22px;
      right: 27px;
      top: 27px;
      position: absolute;
      color: #f3f5ff;
      padding: 5px;
      // flex: 99;
    }
    .upload-bg:hover {
      background-color: gainsboro;
    }
  }
  text-align: center;
  .content {
    text-align: left;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    .info {
      position: relative;
      top: -73px;
      width: 350px;
      .add {
        font-size: 30px;
        margin-top: 18px;
        text-align: center;
        cursor: pointer;
      }
      .name {
        margin-top: 32px;
        text-align: center;
        font-size: 30px;

        font-weight: 500;
        color: #1a1a1a;
        overflow: hidden;
        /* 第二步：让文本不会换行， 在同一行继续 */
        white-space: nowrap;
        /* 第三步：用省略号来代表未显示完的文本 */
        text-overflow: ellipsis;
      }
      .follow {
        margin-top: 27px;
        padding-left: 13px;
        .followers {
          margin-right: 104px;
          font-size: 14px;

          font-weight: 400;
          color: #000010;
          cursor: pointer;
        }
        .following {
          font-size: 14px;

          font-weight: 400;
          color: #000010;
          cursor: pointer;
        }
      }
      .followBtn {
        width: 112px;
        height: 40px;
        border-radius: 8px;
        ::v-deep .el-button {
          background: #1e78f0;
          border-radius: 8px;
          font-size: 16px;
        }
      }
      .desc {
        margin-top: 31px;
        word-wrap: break-word;
        font-size: 16px;

        font-weight: 400;
        color: #1a1a1a;
        white-space: pre-wrap;
      }
      .descInput {
        margin-top: 12px;
        ::v-deep {
          .el-textarea__inner {
            background-color: #f0f3fa;
          }
          .el-input__inner {
            background-color: #f0f3fa;
          }
        }
      }
    }
    .imgWrap {
      position: relative;
      display: inline-block;
      left: 50%;
      margin-top: 16px;
      margin-left: -50px;
      text-align: center;
      .upload-demo {
        position: absolute;
        top: 0;
        left: 0;
        background-color: black;
        line-height: 100px;
        color: white;
        opacity: 0;
        display: inline-block;
        width: 100%;
        height: 100%;

        ::v-deep .el-upload--text {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          cursor: pointer;
        }
      }
      .imgEdit {
        position: absolute;
        top: 0;
        font-size: 36px;
        line-height: 119px;
        color: white;
        /* opacity: 0.5; */
        width: 120px;
        height: 119px;
        border-radius: 50%;
        display: none;
      }
      .img {
        width: 120px;
        height: 119px;
        border-radius: 50%;
      }
    }
    .imgWrap:hover .imgEdit {
      display: inline-block;
      background-color: rgba(0, 0, 0, 0.4);
      cursor: pointer;
    }
    .delsbutton {
      cursor: pointer;
      margin-top: 19px;
      width: 152px;
      height: 40px;
      border: 1px solid #f3575c;
      border-radius: 8px;
      font-size: 16px;
      text-align: center;
      line-height: 40px;

      font-weight: 400;
      color: #f3575c;
    }
  }
  ::v-deep .el-textarea {
    height: 162px;
  }
  ::v-deep .el-button--primary {
    margin-right: 12px;
  }
}
.Makes {
  ::v-deep .el-drawer__wrapper {
    top: 56px;
    height: 317%;
  }
  ::v-deep .el-drawer__header {
    width: 1480px;
    margin: auto;
    padding: 0 20px 0 20px;
  }
  ::v-deep .el-drawer__close-btn {
    z-index: 3;
    font-size: 22px;
    width: 36px;
    height: 36px;
    color: #ffffff;
    background: #1a1a1a;
    opacity: 0.3;
    border-radius: 8px;
    position: relative;
    top: 34px;
    right: 27px;
  }
  ::v-deep .el-drawer__body {
    width: 1480px;
    margin: auto;
  }
  ::v-deep .el-drawer__open .el-drawer.ttb {
    background: #f0f3fa;
  }
}
::v-deep .el-drawer.ttb {
  background: #f0f3fa;
}
::v-deep .el-drawer__wrapper {
  top: 56px;
  height: 317%;
  background: #f0f3fa;
}
::v-deep .el-drawer__header {
  background: #f0f3fa;
  width: 1440px;
  margin: auto;
  padding: 20px 20px 40px 0px;
}
::v-deep .el-drawer__header > :first-child {
  font-size: 20px;

  font-weight: 400;
  color: #1a1a1a;
  flex: none;
}
::v-deep .el-drawer__close-btn {
  z-index: 3;
  font-size: 24px;
  position: relative;
  left: 1280px;
}

::v-deep .el-drawer__body {
  background: #f0f3fa;
  width: 1440px;
  padding-left: 1px;
  margin: auto;
}
.drawer {
  ::v-deep .el-tabs__active-bar {
    height: 0px;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    height: 0px;
  }
  .Count {
    width: 160px;
    height: 40px;
    font-size: 14px;

    font-weight: 400;
    color: #1a1a1a;
  }
  .cellActive {
    width: 160px;
    height: 40px;
    font-size: 14px;

    font-weight: 400;
    color: #ffffff;
    background: #8ab5ef;
    border-radius: 6px;
  }
  .el-divider {
    position: absolute;
    top: 40px;
    width: 1440px;
    height: 1px;
    background: #cccccc;
  }
}
.ResourcesBox {
  visibility: hidden;
  margin-left: 18px;
  font-size: 20px;

  font-weight: 400;
  color: #1a1a1a;
}
.Number {
  margin-left: 18px;
  font-size: 20px;

  font-weight: 400;
  color: #1a1a1a;
}
.Numbers {
  position: relative;
  top: 60px;
  font-size: 20px;

  font-weight: 400;
  color: #1a1a1a;
}
.svgicon {
  font-size: 40px;
  margin-right: 28px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
}
.sengIcon {
  font-size: 38px;

  font-weight: 400;
}
.HistoryTitle {
  font-size: 20px;

  font-weight: 400;
  color: #1a1a1a;
  line-height: 68px;
}
.HistoryTis {
  font-size: 16px;

  font-weight: 400;
  color: #666666;
}
</style>
