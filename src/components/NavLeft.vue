<template>
 <div :class="`nav-left${allowDesign?'-design':''} nav-${theme === 'dark' ? 'dark' : 'light'}`">
   <slot name="header">
     <div class="nav-title">应用名称: {{title}}</div>
   </slot>
   <el-tree
    :data="data"
    node-key="id"
    @node-click="nodeClick"
    :current-node-key="currentNodeKey"
    ref="tree"
   >
       <span class="custom-tree-node" slot-scope="{node,data}">
         <span :class="data.icon" v-if="data.icon"></span>
         <span class="node-dec">{{data.label}}</span>
         <slot name="feature" :node="node" :data="data"></slot>
       </span>
   </el-tree>
 </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

@Component({})
export default class NavLeft extends Vue {
  title = '移动应用'
  @Prop({ default: false }) allowDesign!: boolean
  @Prop() data!: Array<any>
  @Prop({ default: '' }) currentNodeKey!: string
  @Prop({ default: 'dark' }) theme!: string

  @Watch('currentNodeKey')
  handleIdChange (val: string) {
    (this.$refs.tree as any).setCurrentKey(val === '' ? null : val)
  }

  nodeClick (data: any) {
    this.$emit('node', data)
  }
}
</script>

<style scoped lang="scss">
.nav-dark {
  background: $color-nav-left;
  color: white;
  /deep/.el-tree-node {
    position: relative;
    color: white;
    :hover{
      color: $color-nav-hover !important;
    }
    &:focus > .el-tree-node__content{
      background:  $color-nav-left-bg !important;
    }
  }
  /deep/.is-current{
    color: $color-nav-hover !important;
    background: $color-nav-left-bg;
    &::after{
      content: '';
      position: absolute;
      left: 0;
      top:0;
      display: block;
      width: 3px;
      height: 30px;
      background: $color-nav-hover;
    }
  }
}
.nav-light {
  background: white;
  border-right: solid 1px $color-border-main;
  color: $color-font-main;
   [class^=mmp] {
     color: $color-theme;
   }
  /deep/.el-tree-node {
    position: relative;
    color: $color-font-main;
    :hover{
      color: $color-theme !important;
    }
    &:focus > .el-tree-node__content{
      background: white !important;
    }
  }
  /deep/.is-current{
    color: $color-theme !important;
    background: white;
  }
}
  .nav-left{
    width: 200px;
    height: 100vh;
    box-sizing: border-box;
    overflow: auto;
    .nav-title{
      padding-left: 20px;
      padding-right: 10px;
      margin-top: 10px;
      line-height: 30px;
      display: inline-block;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    /deep/.el-tree-node__content{
      height: 30px;
      position: relative;
      &:hover{
        background: white;
      }
    }
    .custom-tree-node{
      height: 30px;
      display: inline-block;
      [class^=mmp]{
        font-size: 16px;
        margin-right: 8px;
        vertical-align: middle;
      }
      .node-dec{
        vertical-align: middle;
      }
      &::after{
        content: '';
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
      }
    }
  }
</style>
