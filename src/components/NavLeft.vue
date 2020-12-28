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
     v-if="data"
     :expand-on-click-node="false"
   >
     <template slot-scope="{node, data}">
       <span class="custom-tree-node">
         <span :class="data.icon" v-if="data.icon"></span>
         <span class="node-dec">{{data.label}}</span>
         <slot name="feature" :node="node" :data="data"></slot>
       </span>
     </template>
   </el-tree>
   <el-tree
    node-key="id"
    :props="option"
    :load="loadNode"
    lazy
    @node-click="nodeClick"
    :current-node-key="currentNodeKey"
    ref="tree"
    v-else
    :expand-on-click-node="false"
    :default-expanded-keys="defaultKeys"
   >
     <template slot-scope="{node,data}">
        <div :class="`custom-tree-node ${node.loading? 'is-loading': ''}`">
         <span :class="data.type | getIcon" v-if="!node.loading"></span>
         <span class="node-dec">{{data.title}}</span>
         <slot name="feature" :node="node" :data="data"></slot>
       </div>
     </template>
   </el-tree>
 </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'

@Component({})
export default class NavLeft extends Vue {
  @Prop({ default: '移动应用' }) title!: string
  @Prop() option: any
  @Prop({ default: false }) allowDesign!: boolean
  @Prop() data!: Array<any>
  @Prop({ default: '' }) currentNodeKey!: string
  @Prop({ default: 'dark' }) theme!: string
  @Prop() loadNode!: any
  @Prop() defaultKeys!: Array<string>

  @Watch('currentNodeKey')
  handleIdChange (val: string) {
    (this.$refs.tree as any).setCurrentKey(val === '' ? null : val)
  }

  nodeClick (data: any, node: any) {
    this.$emit('node', data, node)
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
    .el-tree-node__expand-icon.is-leaf:hover{
      color: transparent;
      cursor: default;
    }
    position: relative;
    color: $color-font-main;
    :hover{
      color: $color-theme ;
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
    .is-loading {
      color: $color-theme;
    }
    .custom-tree-node{
      flex: 0.85;
      height: 30px;
      display: flex;
      align-items: center;
      [class^=mmp]{
        font-size: 16px;
        margin-right: 8px;
        vertical-align: middle;
      }
      .node-dec{
        display: inline-block;
        width: 115px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
</style>
