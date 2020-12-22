<template>
 <div class="create-main strench">
   <!--搜索开始-->
    <el-row class="design-header" :gutter="20">
       <el-col :span="8">
         <el-row>
           <el-col :span="3"><span class="input-label">名称</span></el-col>
           <el-col :span="21"> <el-input placeholder="请输入名称" v-model="formData.name"/></el-col>
         </el-row>
       </el-col>
       <el-col :span="8">
         <el-row>
           <el-col :span="3"><span class="input-label">说明</span></el-col>
           <el-col :span="21"> <el-input placeholder="请输入说明" v-model="formData.description"/></el-col>
         </el-row>
       </el-col>
       <el-col :span="8">
         <el-button type="primary" icon="el-icon-search" @click="search">查询</el-button>
         <el-button type="primary" icon="el-icon-refresh" @click="reset">重置</el-button>
       </el-col>
     </el-row>
   <!--搜索结束-->
   <!--表格开始-->
   <el-row class="table-feature">
     <el-button type="primary" @click="addPage">新增首页</el-button>
     <el-button type="danger" @click="deletePage">删除</el-button>
   </el-row>
   <el-table
     ref="multipleTable"
     :data="pageList"
     tooltip-effect="light"
     style="width: 100%"
     height="370px"
     @selection-change="handleSelectionChange"
     header-row-class-name="el-table-header-tr"
     class="table-design-border"
   >
     <el-table-column type="selection"></el-table-column>
     <el-table-column label="序号" type="index" width="100"></el-table-column>
     <el-table-column label="名称" prop="title" sortable></el-table-column>
     <el-table-column label="说明" prop="description" sortable>

     </el-table-column>
     <el-table-column label="启动" >
       <template slot-scope="scope">
         <el-switch v-model="scope.row.use" @change="switchChange(scope.row,$event)"></el-switch>
       </template>
     </el-table-column>
     <el-table-column label="操作">
       <template slot-scope="{row}">
         <el-button type="text" title="修改" @click="editPageItem(row)">
           <i class="mmp-t iconfont"></i>
         </el-button>
         <el-button type="text" title="编辑看板" @click="designPageItem(row)">
           <i class="mmp-edit iconfont"></i>
         </el-button>
         <el-button type="text" title="删除" @click="deletePageItem(row)">
           <i class="mmp-trash iconfont"></i>
         </el-button>
       </template>
     </el-table-column>
   </el-table>
   <!--表格结束-->
   <!--分页-->
   <el-pagination
     class="table-pagination"
     @size-change="handleSizeChange"
     @current-change="handleCurrentChange"
     :current-page="page"
     :page-sizes="[10, 20, 50]"
     :page-size="pageSize"
     layout="total, sizes, prev, pager, next, jumper"
     :total="total">
   </el-pagination>
   <!--新增 dialog 开始-->
   <el-dialog
     title='新增首页'
     :visible.sync="show"
     width="600px"
     v-if="type ==='addPage'"
   >
     <el-form label-position="right" label-width="80px"  class="dialog-edit" :model="addPageData" ref="add" :rules="rules">
       <el-form-item label="首页名称" prop="title">
          <el-input
            placeholder="请填写首页名称"
            type="text"
            v-model="addPageData.title"
            maxlength="30"
            show-word-limit
          />
       </el-form-item>
       <el-form-item label="类型选择" required>
         <el-radio-group v-model="addPageData.type">
           <el-radio label="BI" >BI定制</el-radio>
           <el-radio label="MOBILE" disabled>移动定制</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item label="说明" class="dialog-last">
         <el-input
           type="textarea"
           placeholder="请输入内容"
           v-model="addPageData.description"
           maxlength="150"
           show-word-limit
         ></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer">
       <el-button @click="type = ''; $message( '已取消新增')">取消</el-button>
       <el-button type="primary" @click="addConfirm">确认</el-button>
     </div>
   </el-dialog>
   <!--新增dialog 结束-->
   <!--修改dialog 开始-->
   <el-dialog
     title='修改首页'
     :visible.sync="show"
     width="600px"
     v-if="type ==='editPage'"
   >
     <el-form label-position="right" label-width="80px"  class="dialog-edit" :model="editPageData" ref="edit" :rules="rules">
       <el-form-item label="首页名称" prop="title">
         <el-input
           placeholder="请填写首页名称"
           type="text"
           v-model="editPageData.title"
           maxlength="30"
           show-word-limit
         />
       </el-form-item>
       <el-form-item label="类型选择" required>
         <el-radio-group v-model="editPageData.type">
           <el-radio label="BI" >BI定制</el-radio>
           <el-radio label="MOBILE" disabled>移动定制</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item label="说明" class="dialog-last">
         <el-input
           type="textarea"
           placeholder="请输入内容"
           v-model="editPageData.description"
           maxlength="150"
           show-word-limit
         ></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer">
       <el-button @click="type = ''; $message( '已取消修改')">取消</el-button>
       <el-button type="primary" @click="editConfirm">确认</el-button>
     </div>
   </el-dialog>
   <!--修改dialog 结束-->
 </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getPageList } from '@/api/page/mainDesign'
import { noRepeat } from '@/utils/validator'

@Component({})
export default class MainDesign extends Vue {
  type = ''
  show = false
  selectionList!: Array<any>
  total = 0
  pageSize = 10
  page = 1
  pageList = [
    {
      order: 1,
      title: 'test',
      description: 'yyyyy',
      use: false,
      id: '3ewfw',
      type: 'BI'
    },
    {
      order: 1,
      title: 'test111',
      description: 'yyyyy',
      use: false,
      id: '3ewfw',
      type: 'BI'
    }
  ]

  formData = {
    name: '',
    description: ''
  }

  addPageData = {
    title: '',
    type: 'BI',
    description: ''
  }

  editPageData = {
    title: '',
    type: 'BI',
    description: ''
  }

  rules = {
    title: [
      { validator: noRepeat(this.pageList, 'title', '首页名称'), trigger: 'blur', required: true }
    ]
  }

  search () {

  }

  reset () {
    this.formData.name = ''
    this.formData.description = ''
  }

  resetPage () {
    this.getPageList()
    this.selectionList = []
  }

  async getPageList () {
    const res = await getPageList(this.getParams())
    this.pageList = res.data
  }

  getParams (): object {
    return {}
  }

  created () {}

  handleSelectionChange (selection: any) {
    this.selectionList = selection
  }

  addConfirm () {
    (this.$refs.add as any).validate(async (valid: any) => {
      if (valid) {
        // 处理请求
      }
    })
  }

  editConfirm () {
    (this.$refs.edit as any).validate(async (valid: any) => {
      if (valid) {
        // 处理请求
      }
    })
  }

  addPage () {
    this.type = 'addPage'
    this.show = true
    this.addPageData.title = ''
    this.addPageData.type = 'BI'
    this.addPageData.description = ''
  }

  deletePage () {
    if (this.selectionList && this.selectionList.length > 0) {
      this.$confirm('删除选择的首页, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 删除
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      this.resetPage()
    } else {
      this.$alert('请选择要删除的首页', '提示', {
        confirmButtonText: '确定',
        type: 'info'
      }).then(() => {})
    }
  }

  deletePageItem (item: any) {
    this.$confirm('删除选择的首页, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      // 删除
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
    this.resetPage()
  }

  editPageItem (item: any) {
    this.type = 'editPage'
    this.show = true
    this.editPageData.title = item.title
    this.editPageData.type = item.type
  }

  designPageItem (item: any) {}

  switchChange (item: any, status: boolean) {
    this.pageList.forEach(val => {
      val.use = false
    })
    item.use = status
  }

  handleSizeChange () {}

  handleCurrentChange () {}
}
</script>

<style scoped lang="scss">
 .design-header{
   padding: 10px 5px 15px;
   box-sizing: border-box;
   border-bottom: solid 1px $color-border-main;
   margin: 0 auto !important;
 }
 .table-feature{
   padding: $padding-default 0;
 }
 .mmp-trash{
   color: $color-danger;
 }
</style>
