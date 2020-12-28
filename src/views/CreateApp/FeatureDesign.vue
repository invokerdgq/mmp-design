<template>
 <div class="create-feature strench">
   <NavLeft
     :allow-design="false"
     :load-node="loadNode"
     :current-node-key="currentNode"
     theme="light"
     ref="navLeft"
     :option="option"
     @node="nodeChange"
   >
     <div slot="header" class="design-dec">
       <span class="mmp-gongneng iconfont"></span>
       <span class="dec">功能定制</span>
     </div>
     <span slot="feature" class="more-feature" slot-scope="{ node, data }">
       <el-popover
         placement="right"
         trigger="hover"
       >
         <ul :class="`ul-feature-${data.type === 'page'? 'page': 'module'}`">
           <li>更多操作</li>
           <li class="li-item"><span class="mmp-add-circle iconfont"/><el-button type="text" :disabled="nodeType === 'page'" @click="addModule(node)">添加模块</el-button></li>
           <li class="li-item"><span :class="`mmp-jian iconfont ${(nodeType === 'page' || nodeType === 'root')?'icon-disable': ''}`"/><el-button type="text" :disabled="nodeType === 'page' || nodeType === 'root'" @click="deleteModule(node)">删除模块</el-button></li>
           <li class="li-item"><span class="mmp-add-circle iconfont"/><el-button type="text" :disabled="nodeType === 'page'" @click="addPage(node)">添加页面</el-button></li>
           <li class="li-item"><span class="mmp-jian iconfont"/><el-button type="text" :disabled="nodeType !== 'page'"  @click="deletePage(node)">删除页面</el-button></li>
         </ul>
         <span slot="reference" class="mmp-more iconfont" v-show="data.id === currentNode"></span>
       </el-popover>
     </span>
   </NavLeft>
   <div class="design-content">
     <ModuleInfo
      v-if="chooseType === 'module' || chooseType === 'root'"
      :edit="edit"
      :info="node.data || {}"
      :allName="moduleName"
      :parentName="parentNodeTitle"
      @edit="handleEdit"
      @addModule="appendNode"
     ></ModuleInfo>
     <PageInfo
      v-else
      :edit="edit"
      :info="node.data || {}"
      :allName="pageName"
      @edit="handleEdit"
      @addPage="appendNode"
     ></PageInfo>
   </div>
 </div>
</template>

<script lang="ts">
import { Component, Watch, Vue } from 'vue-property-decorator'
import NavLeft from '../../components/NavLeft.vue'
import ModuleInfo from '@/views/CreateApp/ModuleInfo.vue'
import PageInfo from '@/views/CreateApp/PageInfo.vue'
import * as api from '@/api/page/featureDesign'

@Component({
  components: {
    NavLeft,
    PageInfo,
    ModuleInfo
  }
})
export default class FeatureDesign extends Vue {
  currentNode = ''
  nodeType = 'root' // 用来决定 更多操作的禁用选项
  chooseType = 'module'
  edit = true // chooseType and edit 用来决定右边 的 编辑与添加 页面页与模块 2x2
  showDelete = false
  node: any = {}
  parentNodeTitle = ''
  treeNode!: any
  nameInfo: any = {}
  moduleName = []
  pageName = []
  option = {
    isLeaf: 'leaf'
  }

  // 为每一个节点 加上leaf 与 type 属性
  formate (data: Array<any>, type: string) {
    if (data.length <= 0) return []
    return data.reduce((pre: any, item: any) => {
      item.type = type
      item.leaf = type === 'page'
      pre.push(item)
      return pre
    }, [])
  }

  @Watch('edit')
  handleEditChange (val: boolean) {
    this.searchName(val)
  }

  searchName (edit: boolean) {
    if (edit) {
      this.searchTreeNode(this.nameInfo, (this.node.data || {}).parentModuleId, 'childModules', 'moduleName')
      this.searchTreeNode(this.nameInfo, (this.node.data || {}).parentModuleId, 'childPageName', 'pageName')
      return
    }
    this.searchTreeNode(this.nameInfo, this.node.data.id, 'childModules', 'moduleName')
    this.searchTreeNode(this.nameInfo, this.node.data.id, 'childPageName', 'pageName')
  }

  // 递归查找 对应节点的子节点 模块名称或页面名称
  searchTreeNode (data: any, id: string, type: string, key: string) {
    if (data.moduleId === id) {
      // @ts-ignore
      this[key] = data[type]
      return
    }
    if (data.childModules && data.childModules.length === 0) return []
    data.childModules.forEach((item: any) => {
      this.searchTreeNode(item, id, type, key)
    })
  }

  // 不同类型的节点展开时 获取子节点数据
  async resolveResponse (id: string) {
    const res = await api.getModuleInfo(id)
    return [
      ...this.formate(res.data.moduleList, 'module'),
      ...this.formate(res.data.pageList, 'page')
    ]
  }

  async loadNode (node: any, resolve: any) {
    if (node.level === 0) {
      const res = await api.getModuleInfo(this.$route.params.id)
      resolve([
        {
          title: res.data.title,
          type: 'root',
          description: res.data.description,
          id: res.data.id,
          initData: [],
          leaf: false,
          parentModuleId: res.data.parentModuleId
        }
      ])
      // 默认展开第一层
      node.childNodes[0].expanded = true
      node.childNodes[0].loadData()
      return
    }
    const data = await this.resolveResponse(node.data.id)
    this.node = node
    resolve(data)
  }

  created () {
    this.getNameInfo()
  }

  // 获取应用的所有模块和页面名称
  async getNameInfo () {
    const res = await api.getAllName(this.$route.params.id)
    this.nameInfo = res.data
    this.searchName(this.edit)
  }

  mounted () {
    // @ts-ignore
    this.treeNode = this.$refs.navLeft.$refs.tree
  }

  addModule () {
    this.chooseType = 'module'
    this.edit = false
  }

  deleteModule (node: any) {
    this.$confirm('此模块下所有子模块和页面都将被删除，确定要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await api.deleteModule(this.node.data.id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.treeNode.remove(node)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  addPage () {
    this.chooseType = 'page'
    this.edit = false
  }

  // 编辑页面或模块完成 更新节点信息
  async handleEdit (type: string, title = '', desc = '') {
    await this.getNameInfo()
    if (type === 'page') {
      const res = await api.getPageInfo(this.node.data.id)
      this.node.data = res.data
      return
    }
    this.node.data.title = title
    this.node.data.description = desc
  }

  // 添加页面和模块成功时 更新节点子节点信息 更新模块和页面名称
  appendNode () {
    this.getNameInfo()
    if (this.node.expanded) {
      this.node.isLeaf = false
      this.node.loaded = false // 必须得修改loaded 参数 不然loadData() 不会生效
      this.node.loadData()
      return
    }
    this.node.expanded = true
    this.node.loadData()
  }

  deletePage (node: any) {
    this.$confirm('删除页面将会级联删除其基本权限，确定要删除吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await api.deletePage(this.node.data.id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.treeNode.remove(node)
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  nodeChange (data: any, node: any) {
    this.currentNode = data.id
    this.nodeType = data.type
    this.chooseType = data.type
    this.edit = true
    this.node = node
    this.parentNodeTitle = (node.parent.data || {}).title
    this.searchName(this.edit)
  }
}
</script>

<style scoped lang="scss">

/deep/ .nav-left{
  height: 100%;
}
.strench{
  padding: 0 !important;
  display: flex;
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
.ul-feature-page,.ul-feature-module{
  & li:first-child {
    text-align: center;
    border-bottom: solid 1px $color-border-main;
    margin-left:-$padding-default--small;
    margin-right:-$padding-default--small;
  }
  li{
    [class^=mmp] {
      color: $color-theme;
      margin-right: 5px;
    }
    &:hover{
      cursor: pointer;
      color: $color-theme;
    }
    .icon-disable {
      color: $color-font-last;
    }
  }
}
.ul-feature-module {
  & li:last-child {
    color: $color-font-last;
    [class^=mmp] {
      color: $color-font-last;
    }
  }
}
.ul-feature-page{
  li {
    color: $color-font-last;
    [class^=mmp] {
      color: $color-font-last;
    }
  }
  & li:first-child{
    color: $color-font-main;
  }
  & li:last-child {
    color: $color-font-main;
    [class^=mmp] {
      color: $color-theme;
    }
  }
}
</style>
