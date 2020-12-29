<template>
 <div class="app-list-item">
   <div class="app-title">
     <span class="app-title-text">{{title}}</span>
   </div>
   <div class="app-content"
        @mousemove="showFeature = true"
        @mouseleave="showFeature = false"
   >
     <div class="img-container">
       <el-image :src="imgUrl?imgUrl:bgImg" fit="contain"/>
     </div>
     <!-- 遮罩-->
     <div class="shade-container" v-if="showFeature">
       <Shade>
         <div class="shade-content">
           <div
             v-for="item in FeatureList"
             class="item-container"
             :key="item.label"
             @click="handleFeature(item)"
           >
             <el-tooltip
               :content="item.label"
               placement="top"
               effect="light"
             >
               <IconContainer
                 :bg-color="item.color"
                 :icon-class="item.icon"
               ></IconContainer>
             </el-tooltip>
           </div>
         </div>
       </Shade>
     </div>
   </div>
   <!--右上角 状态标志-->
   <LeanTab
     :statusActive="status === 1"
     :statusText = "status === 1? '已发布': '未发布'"
     :pos ="pos"
   ></LeanTab>
 </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import LeanTab from '../../components/LeanTab.vue'
import Shade from '@/components/Shade.vue'
import IconContainer from './IconContain.vue'
// @ts-ignore
import bgImg from '../../assets/images/defaultImg.png'

@Component({
  components: {
    LeanTab,
    Shade,
    IconContainer
  }
})
export default class AppListItem extends Vue {
  @Prop() title!: string
  @Prop() imgUrl!: string
  @Prop() status!: number
  @Prop() id!: string
  pos = 'right'
  bgImg = bgImg
  showFeature = false
  FeatureList = [
    {
      label: '编辑',
      icon: 'mmp-edit',
      color: 'bg0'
    },
    {
      label: '定制',
      icon: 'mmp-huiyuan',
      color: 'bg0'
    },
    {
      label: '复制',
      icon: 'mmp-fuzhi',
      color: 'bg1'
    },
    {
      label: '预览',
      icon: 'mmp-viewShow',
      color: 'bg1'
    },
    {
      label: '发布',
      icon: 'mmp-release',
      color: 'bg2'
    },
    {
      label: '下载',
      icon: 'mmp-yunxiazai',
      color: 'bg2'
    },
    {
      label: '删除',
      icon: 'mmp-trash',
      color: 'bg3'
    }
  ]

  handleFeature (item: any) {
    this.$emit('handleFeature', item)
  }
}
</script>

<style scoped lang="scss">
.app-list-item{
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  .app-title{
    flex:none;
    @include text-small-title;
    text-align: center;
    line-height: 43px;
    height: 43px;
    border-bottom: solid 1px $color-border-main;
    &-text {
      display: inline-block;
      max-width: 120px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
  .app-content{
    position: relative;
    flex: 1;
    .img-container{
      width: 162px;
      max-height: 150px;
      overflow: hidden;
      margin: 70px auto 0;
    }
    .shade-container{
      width: 100%;
      height: 100%;
      position: absolute;
      top:0;
      left: 0;
      .shade-content{
        @include align-center;
        @include no-flex-warp;
        box-sizing: border-box;
        width: 100%;
        padding: 0 15px 0 25px;
        color: white;
        top: 102px;
        .item-container{
          width: 35px;
          height: 35px;
          box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          margin-bottom: 10px;
          overflow: hidden;
          margin-right: 10px;
          &:hover{
            cursor: pointer;
          }
        }
      }
    }
  }
}

</style>
