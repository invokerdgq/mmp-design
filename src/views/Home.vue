<template>
  <div class="home">
   <div v-for="(item, index) in list" :key="item.id" class="list-item-container">
     <AppListItem
       :title="item.title"
       :imgUrl="item.coverimage"
       :id="item.id"
       :status="item.status"
       @handleFeature="itemHandleFeature(index,$event)"
     ></AppListItem>
   </div>
   <div class="list-item-container" @click="addApp">
     <div class="mmp-add iconfont"></div>
   </div>
    <component
      :is="contentType"
      :showDialog.sync="showDialog"
      :app-info="list[currentAppIndex]"
      :list="list"
      @update="getList"
      v-if="contentType && showDialog"
    >
    </component>
    <div
      class="preview-container"
      v-if="showPreview"
    >
      <Shade opacity="0.8">
        <div class="preview">
          <div class="preview-content">
            <div class="preview-mobile">
              <iframe
                src="https://cn.vuejs.org/v2/api/#Vue-nextTick"
                :style="{width:'100%',height:'100%'}"
                frameborder="0"
                sandbox="allow-same-origin allow-forms allow-scripts"
                seamless
              ></iframe>
            </div>
          </div>
          <div class="preview-desc">
            <div class="preview-desc-title">
              <div class="preview-title">页面预览</div>
              <div class="el-icon-close" @click="showPreview = false"></div>
            </div>
            <div class="preview-desc-content">
              <div class="page-status">
                <div class="page-status-dec">页面状态 ：</div>
                <div class="page-published" v-if="list[currentAppIndex].status === '已发布'"><i class="mmp-success iconfont"/><span>已发布</span></div>
                <div class="page-unpublish" v-else><i class="mmp-alert iconfont"/><span>未发布</span></div>
              </div>
              <div class="page-code">
                <div class="page-code-dec">页面二维码</div>
                <el-image class="code-img" :src="preImg"/>
                <div class="code-dec">
                  为防范钓鱼安全风险，预览内容仅供作者调试实验，有效期50分钟，如需供他人预览，请使用发布功能
                </div>
              </div>
            </div>
            <div class='preview-desc-link'>
              <div class="link-dec">页面链接</div>
              <div class="link-content">
                <el-input class="link-addr"
                          :value="list[currentAppIndex].previewUrl"
                          disabled
                ></el-input>
                <el-button
                  type="primary"
                  @click="copy"
                >复制链接</el-button>
              </div>
            </div>
          </div>
        </div>
      </Shade>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getAppList, deleteApp } from '@/api/page/home'
import AppListItem from '@/views/components/AppListItem.vue'
import CreateAppContent from './components/CreateAppContent.vue'
import EditAppContent from '@/views/components/EditAppContent.vue'
import CopyAppContent from '@/views/components/CopyAppContent.vue'
import PublishAppContent from '@/views/components/PublishAppContent.vue'
import DownLoadAppContent from '@/views/components/DownLoadAppContent.vue'
import Shade from '@/components/Shade.vue'
import preImg from '../assets/images/defaultImg.png'

@Component({
  components: {
    AppListItem,
    CreateAppContent,
    EditAppContent,
    CopyAppContent,
    PublishAppContent,
    DownLoadAppContent,
    Shade
  }
})
export default class Home extends Vue {
  list: Array<any> = []
  currentAppIndex = 0
  contentType: any = null
  showDialog = false
  showPreview = false
  preImg = preImg
  clip!: any

  async getList () {
    const res = await getAppList()
    this.list = res.data
  }

  created () {
    this.getList()
  }

  copy () {
    this.$copyText(this.list[this.currentAppIndex].previewUrl).then(() => {
      this.$message({
        type: 'success',
        message: '复制成功',
        showClose: true
      })
    }, err => {
      console.log(err)
      this.$message({
        type: 'error',
        message: '复制失败,稍后重试',
        showClose: true
      })
    })
  }

  addApp () {
    this.showDialog = true
    this.contentType = 'CreateAppContent'
  }

  itemHandleFeature (index: number, item: any) {
    this.currentAppIndex = index
    if (item.label !== '删除' && item.label !== '预览') this.showDialog = true
    switch (item.label) {
      case '编辑':
        this.editApp()
        break
      case '定制':
        this.designApp(index)
        break
      case '复制':
        this.copyApp()
        break
      case '预览':
        this.previewApp(item)
        break
      case '发布':
        this.publishApp()
        break
      case '下载':
        this.downloadApp()
        break
      default:
        this.deleteApp()
    }
  }

  editApp () {
    this.contentType = 'EditAppContent'
  }

  designApp (index: number) {
    window.open(`/create${this.list[index].id}`)
  }

  copyApp () {
    this.contentType = 'CopyAppContent'
  }

  previewApp (item: any) {
    this.showPreview = true
    console.log(item)
  }

  publishApp () {
    this.contentType = 'PublishAppContent'
  }

  downloadApp () {
    this.contentType = 'DownLoadAppContent'
  }

  deleteApp () {
    this.$confirm('此操作将永久删除该应用, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await deleteApp(this.list[this.currentAppIndex].id)
      this.$message({
        type: 'success',
        message: '删除成功!',
        showClose: true
      })
      await this.getList()
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除',
        showClose: true
      })
    })
  }
}
</script>

<style lang="scss">
 .home{
   @include no-flex-warp;
   position: relative;
   padding: $padding-default  0 $padding-default $padding-default;
   .list-item-container{
     width: 223px;
     height: 369px;
     background: #FFFFFF;
     box-shadow: 0 0 10px 0 rgba(0, 6, 30, 0.15);
     margin-right: 15px;
     margin-bottom: 15px;
     overflow: hidden;
     position: relative;
    & > [class^=mmp]{
       font-size: $icon-font-size-large;
       color: #E0E0E1;
      &:hover{
        cursor: pointer;
      }
       @include all-center;
     }
   }
   .preview-container {
     position: fixed;
     width: 100vw;
     height: 100vh;
     top:0;
     left:0;
     overflow: auto;
     .preview {
       @include no-flex-warp;
       overflow: auto;
       .preview-content{
         width: 100%;
         height: 100vh;
         margin-right: 400px;
         overflow: auto;
         .preview-mobile{
           width: 418px;
           height: 750px;
           background: white;
           margin: 75px auto;
         }
       }
       .preview-desc {
         position: fixed;
         top:0;
         right:0;
         height: 100vh;
         width: 400px;
         background: white;
         font-size: $font-size-normal;
         &-title{
           display: flex;
           justify-content: space-between;
           align-items: center;
           padding: 10px 15px;
           border-bottom: solid 1px $color-border-main;
           .preview-title {
             font-size: $font-size-title;
             font-weight: $font-weight-title;
             color: $color-font-main;
             line-height: 25px;
           }
           .el-icon-close {
             color: $color-font-second;
           }
         }
         &-content{
           border-bottom: solid 1px $color-border-main;
           padding: $padding-default;
           .page-status{
             margin-bottom: $padding-default;
             display: flex;
             & [class^=mmp] {
               margin-right: 4px;
               font-size: $font-size-small-title;
             }
             .mmp-alert {
               color: $color-second-orange;
             }
             .mmp-success {
               color: $color-theme-cyan;
             }
             &-dec{
               margin-right: 10px;
             }
           }
           .page-code {
             display: flex;
             justify-content: space-between;
             &-dec{
               white-space: nowrap;
               margin-right: 10px;
             }
             .code-img{
               width: 77px;
               height: 77px;
               flex: none;
             }
             .code-dec{
               background: #F8F8F8;
               border: 1px solid #DCDFE6;
               padding: 9px 6px 14px 8px;
               font-size: $font-size-small;
               color: #909399;
               margin-left: $padding-default;
             }
           }
         }
         &-link{
           padding: $padding-default;
           .link-dec{
             margin-bottom: 6px;
           }
           .link-content{
             display: flex;
             .link-addr {
               width: 270px;
               height: 30px;
               margin-right: 13px;
               .el-input__inner{
                 background: $color-input-bg;
               }
             }
           }
         }
       }
     }
   }
 }
</style>
