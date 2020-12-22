<template>
  <div class="create-app">
    <NavLeft
     :allow-design="false"
     :data="data"
     :current-node-key="currentNode"
     @node="itemClick"
     ref="navLeft"
    ></NavLeft>
    <div class="content-right layout-box">
      <div class="content-right-title" v-if="showTabs && tabList.length > 0">
        <el-tabs
          v-if="showTabs && tabList.length > 0"
          v-model="tabsValue"
          type="card"
          closable
          @edit="tabsEdit"
          @tab-click="tabsChange"
        >
          <el-tab-pane
            v-for="item in tabList"
            :key="item.name"
            :label="item.name | getRouteName"
            :name="item.name"
            closable
          >
          </el-tab-pane>
        </el-tabs>
        <el-dropdown class="content-right-title-feature" trigger="click">
          <span class="mmp-xia iconfont"></span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><span @click="closeOthers">关闭其它标签</span></el-dropdown-item>
            <el-dropdown-item><span @click="closeAll">关闭全部标签</span></el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import NavLeft from '../../components/NavLeft.vue'

@Component({
  components: {
    NavLeft
  }
})
export default class CreateApp extends Vue {
  showTabs = false
  currentNode = ''
  tabsValue = ''
  tabList: Array<any> = []
  data = [
    {
      id: '1',
      label: '首页定制',
      name: 'main',
      icon: 'mmp-Homehomepagemenu iconfont',
      children: []
    },
    {
      id: '2',
      label: '功能定制',
      name: 'feature',
      icon: 'mmp-gongneng iconfont',
      children: []
    },
    {
      id: '3',
      label: '应用配置',
      name: 'config',
      icon: 'mmp-gongneng iconfont',
      children: []
    }
  ]

  @Watch('$route.name')
  handleRouteChange (val: string) {
    if (val === 'process') {
      this.showTabs = false
      return
    }
    this.showTabs = true
  }

  created () {
    if (localStorage.getItem('tabsList')) {
      this.tabList = JSON.parse(localStorage.getItem('tabsList') as string)
      this.tabsValue = this.$route.name as string
      this.data.forEach(route => {
        if (route.name === this.$route.name) {
          this.currentNode = route.id
        }
      })
      if (this.tabsValue !== 'process') this.showTabs = true
    } else {
      this.tabList = []
    }
  }

  itemClick (data: any) {
    this.currentNode = data.id
    this.changeRoute(data.name)
  }

  changeRoute (label: string) {
    this.tabsValue = label
    let hasRoute
    this.tabList.forEach((item: any) => {
      if (item.name === label) {
        hasRoute = item.name
      }
    })
    if (!hasRoute) {
      this.tabList.push({ name: label, path: label })
      localStorage.setItem('tabsList', JSON.stringify(this.tabList))
    }
    if (this.$route.name !== label) {
      this.$router.push({ name: label, path: label })
    }
  }

  tabsEdit (tagName: string, action: any) {
    let index = -1
    /*
    删除最后一个标签 回到流程页
    */
    if (this.tabList.length === 1) {
      this.tabList = []
      localStorage.setItem('tabsList', JSON.stringify(this.tabList))
      this.$router.push({ name: 'process', path: 'process' })
      // @ts-ignore
      this.currentNode = ''
      return
    }
    this.tabList.forEach((item, ind) => {
      if (item.name === tagName) {
        index = ind
      }
    })
    if (tagName === this.tabsValue) {
      this.tabsValue = (this.tabList[index + 1] || this.tabList[index - 1] || {}).name
      this.data.forEach((item: any) => {
        if (item.name === this.tabsValue) {
          this.currentNode = item.id
        }
      })
      if (!this.tabsValue) this.currentNode = ''
      this.$router.push({ name: this.tabsValue, path: this.tabsValue })
    }
    if (index >= 0) {
      this.tabList.splice(index, 1)
      localStorage.setItem('tabsList', JSON.stringify(this.tabList))
      this.$forceUpdate() // splice 方法是变异方法 却没有重新渲染
    }
  }

  tabsChange (item: any) {
    if (this.$route.name === item.name) return
    this.data.forEach(route => {
      if (route.name === item.name) {
        this.currentNode = route.id
      }
    })
    this.$router.push({ name: item.name })
  }

  closeAll () {
    this.tabList = []
    localStorage.setItem('tabsList', JSON.stringify(this.tabList))
    this.$router.push({ name: 'process', path: 'process' })
    this.currentNode = ''
  }

  closeOthers () {
    this.tabList = this.tabList.filter((item: any) => {
      return item.name === this.tabsValue
    })
    localStorage.setItem('tabsList', JSON.stringify(this.tabList))
  }
}
</script>

<style scoped lang="scss">
 .create-app{
   width: 100%;
   display: flex;
   .el-tree{
     color: white;
   }
   .content-right{
     flex: 1;
     &-title{
       position: relative;
       box-shadow: 0 0 10px 0 rgba(0,0,0,.2);
       margin-bottom: 15px;
       &-feature{
         position: absolute;
         height: 40px;
         line-height: 40px;
         font-size: 18px;
         width: 40px;
         right: 0;
         top:0;
         [class^=mmp]{
           color: black;
         }
       }
     }
   }
 }
</style>
