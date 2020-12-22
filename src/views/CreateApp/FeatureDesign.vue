<template>
 <div class="create-feature strench">
   <NavLeft
     :allow-design="false"
     :data="data"
     :current-node-key="currentNode"
     theme="light"
     ref="navLeft"
     @node="nodeChange"
   >
     <div slot="header" class="feature-design-dec">
       <span class="mmp-gongneng iconfont"></span>
       <span class="dec">功能定制</span>
     </div>
     <span slot="feature" class="more-feature" slot-scope="{ data }">
       <el-popover
         placement="right"
         trigger="hover"
       >
         <ul class="ul-feature">
           <li>更多操作</li>
           <li class="li-item"><span class="mmp-add-circle iconfont"/><span>添加模块</span></li>
           <li class="li-item"><span class="mmp-jian iconfont"/><span>删除模块</span></li>
           <li class="li-item"><span class="mmp-add-circle iconfont"/><span>添加页面</span></li>
           <li class="li-item"><span class="mmp-jian iconfont"/><span>删除页面</span></li>
         </ul>
         <span slot="reference" class="mmp-more iconfont" v-show="data.id === currentNode"></span>
       </el-popover>
     </span>
   </NavLeft>
   <div class="feature-design-content">

   </div>
 </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import NavLeft from '../../components/NavLeft.vue'

@Component({
  components: {
    NavLeft
  }
})
export default class FeatureDesign extends Vue {
  currentNode = ''
  data = [
    {
      label: '移动应用1',
      id: '122',
      icon: 'mmp-gongneng iconfont',
      children: [
        {
          label: '移动应用1-1',
          id: '122-1',
          children: []
        }
      ]
    },
    {
      label: '移动应用2',
      id: '1222',
      icon: 'mmp-gongneng iconfont',
      children: [
        {
          label: '移动应用2-1',
          id: '1222-1',
          children: []
        }
      ]
    }
  ]

  addModule () {}

  deleteModule () {}

  addPage () {}

  deletePage () {}

  nodeChange (data: any) {
    this.currentNode = data.id
  }
}
</script>

<style scoped lang="scss">

/deep/ .nav-left{
  height: 100%;
}
.strench{
  padding: 0 !important;
}
.feature-design-dec{
  background: $color-nav-left;
  padding:0 5px;
  height: 35px;
  line-height: 35px;
  color: white;
  [class^=mmp] {
    font-size: 16px;
    color: $color-theme;
    padding: 0 5px 0 0;
  }
  .dec{
    font-size: $font-size-small-title;
  }
}

.more-feature{
  position: absolute;
  right: 5px ;
  top: 0;
  line-height: 30px;
  [class^=mmp] {
      font-size: 16px;
      color: $color-theme;
      padding: 0 5px 0 0;
  }
}
.ul-feature{
  .li-item{
    [class^=mmp] {
      color: $color-theme;
      margin-right: 5px;
    }
    &:hover{
      cursor: pointer;
      color: $color-theme;
    }
  }
}
</style>
