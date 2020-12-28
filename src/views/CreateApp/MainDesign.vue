<template>
 <div class="create-main strench">
   <!--搜索开始-->
    <el-row class="design-header" :gutter="20">
       <el-col :span="8">
         <el-row>
           <el-col :span="3"><span class="input-label">名称</span></el-col>
           <el-col :span="21"> <el-input placeholder="请输入名称" v-model="formData.search.title"/></el-col>
         </el-row>
       </el-col>
       <el-col :span="8">
         <el-row>
           <el-col :span="3"><span class="input-label">说明</span></el-col>
           <el-col :span="21"> <el-input placeholder="请输入说明" v-model="formData.search.description"/></el-col>
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
     tooltip-effect="dark"
     style="width: 100%"
     @selection-change="handleSelectionChange"
     header-row-class-name="el-table-header-tr"
     class="table-design-border flex-table"
     :cell-style="setCellStyle"
   >
     <el-table-column type="selection"></el-table-column>
     <el-table-column label="序号" width="100">
       <template slot-scope="{ row, $index }">
         {{ (pageNum-1)*pageSize + $index + 1}}
       </template>
     </el-table-column>
     <el-table-column label="名称" prop="title" sortable :show-overflow-tooltip="true"></el-table-column>
     <el-table-column label="说明" prop="description" sortable :show-overflow-tooltip="true">

     </el-table-column>
     <el-table-column label="启动" >
       <template slot-scope="scope">
         <el-switch v-model="scope.row.used" @change="switchChange(scope.row,$event)"></el-switch>
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
     :current-page="pageNum"
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
     v-if="type ==='addPage' && show"
   >
     <el-form label-position="right" label-width="80px"  class="dialog-edit" :model="formData.addPageData" ref="add" :rules="rules">
       <el-form-item label="首页名称" prop="title">
          <el-input
            placeholder="请填写首页名称"
            type="text"
            v-model="formData.addPageData.title"
            maxlength="30"
            show-word-limit
          />
       </el-form-item>
       <el-form-item label="类型选择" required>
         <el-radio-group v-model="formData.addPageData.type">
           <el-radio :label="1" >BI定制</el-radio>
           <el-radio :label="0" disabled>移动定制</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item label="说明" class="dialog-last">
         <el-input
           type="textarea"
           placeholder="请输入内容"
           v-model="formData.addPageData.description"
           maxlength="150"
           show-word-limit
         ></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer">
       <el-button @click="type = ''; $message( '已取消新增')">取消</el-button>
       <el-button type="primary" @click="addConfirm">确定</el-button>
     </div>
   </el-dialog>
   <!--新增dialog 结束-->
   <!--修改dialog 开始-->
   <el-dialog
     title='修改首页'
     :visible.sync="show"
     width="600px"
     v-if="type ==='editPage' && show"
   >
     <el-form label-position="right" label-width="80px"  class="dialog-edit" :model="formData.editPageData" ref="edit" :rules="rules">
       <el-form-item label="首页名称" prop="title">
         <el-input
           placeholder="请填写首页名称"
           type="text"
           v-model="formData.editPageData.title"
           maxlength="30"
           show-word-limit
         />
       </el-form-item>
       <el-form-item label="类型选择" required>
         <el-radio-group v-model="formData.editPageData.type">
           <el-radio :label="1" >BI定制</el-radio>
           <el-radio :label="0" disabled>移动定制</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item label="说明" class="dialog-last">
         <el-input
           type="textarea"
           placeholder="请输入内容"
           v-model="formData.editPageData.description"
           maxlength="150"
           show-word-limit
         ></el-input>
       </el-form-item>
     </el-form>
     <div slot="footer">
       <el-button @click="type = ''; $message( '已取消修改')">取消</el-button>
       <el-button type="primary" @click="editConfirm">确定</el-button>
     </div>
   </el-dialog>
   <!--修改dialog 结束-->
 </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import * as api from '@/api/page/mainDesign'

@Component({})
export default class MainDesign extends Vue {
  type = ''
  show = false
  selectionList!: Array<any>
  total = 0
  pageSize = 10
  pageNum = 1
  pageList = []
  formData = {
    search: {
      title: '',
      description: ''
    },
    addPageData: {
      title: '',
      type: 1,
      description: '',
      url: '',
      appid: this.$route.params.id
    },
    editPageData: {
      title: '',
      type: 1,
      description: '',
      appid: this.$route.params.id,
      id: ''
    }
  }

  rules = {
    title: [
      { validator: this.check, trigger: 'blur', required: true }
    ]
  }

  setCellStyle (row: any, column: any, rowIndex: number, columnIndex: number) {
    if (columnIndex === 1) {
      return {
        textAlign: 'center'
      }
    }
  }

  check (rule: any, value: string, callback: (arg0?: any) => void) {
    if (value === '') {
      callback(new Error('首页名称不能为空'))
    }
    this.pageList.forEach((item: any) => {
      if (item.title === value) {
        callback(new Error('首页名称已存在'))
      }
    })
    callback()
  }

  search () {
    this.resetPage()
  }

  reset () {
    this.formData.search.title = ''
    this.formData.search.description = ''
    this.pageNum = 1
    this.resetPage()
  }

  resetPage () {
    this.getPageList()
    this.selectionList = []
  }

  async getPageList () {
    const res = await api.getHomePage({
      appid: this.$route.params.id,
      title: this.formData.search.title,
      description: this.formData.search.description,
      pageNum: this.pageNum,
      pageSize: this.pageSize
    })
    this.pageList = res.data
    this.total = (res as any).cursor.total
  }

  created () {
    this.getPageList()
  }

  handleSelectionChange (selection: any) {
    this.selectionList = selection
  }

  addConfirm () {
    (this.$refs.add as any).validate(async (valid: any) => {
      if (valid) {
        const params = new FormData()
        params.set('firstPageJson', JSON.stringify(this.formData.addPageData))
        params.set('optsBy', '中')
        await api.addHomePage(params)
        this.$message({
          type: 'success',
          message: '新增页面成功'
        })
        this.show = false
        this.resetPage()
      }
    })
  }

  editConfirm () {
    (this.$refs.edit as any).validate(async (valid: any) => {
      if (valid) {
        const params = new FormData()
        params.set('firstPageJson', JSON.stringify(this.formData.editPageData))
        params.set('optsBy', '中')
        await api.editHomePage(params)
        this.$message({
          type: 'success',
          message: '修改页面成功'
        })
        this.show = false
        this.resetPage()
      }
    })
  }

  addPage () {
    this.type = 'addPage'
    this.show = true
    this.formData.addPageData.title = ''
    this.formData.addPageData.description = ''
  }

  deletePage () {
    if (this.selectionList && this.selectionList.length > 0) {
      this.$confirm('删除选择的首页, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const list: any = []
        this.selectionList.forEach((item: any) => {
          list.push(api.deleteHomePage(item.id))
        })
        Promise.all(list).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.resetPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    } else {
      this.$message({
        type: 'warning',
        message: '请选择要删除的首页'
      })
    }
  }

  deletePageItem (item: any) {
    this.$confirm('删除选择的首页, 是否继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(async () => {
      await api.deleteHomePage(item.id)
      this.$message({
        type: 'success',
        message: '删除成功!'
      })
      this.resetPage()
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  editPageItem (item: any) {
    this.type = 'editPage'
    this.show = true
    this.formData.editPageData.title = item.title
    this.formData.editPageData.type = item.type
    this.formData.editPageData.id = item.id
    this.formData.editPageData.description = item.description
  }

  designPageItem (item: any) {}

  async switchChange (item: any, status: boolean) {
    if (status) {
      await api.useHomePage(item.id)
      this.pageList.forEach((val: any) => {
        val.used = false
      })
      item.used = status
      this.$message({
        type: 'success',
        message: '启用成功'
      })
      return
    }
    await api.closeHomePage(item.id)
    this.$message({
      type: 'success',
      message: '关闭启用成功'
    })
  }

  handleSizeChange (size: number) {
    this.pageSize = size
    this.pageNum = 1
    this.resetPage()
  }

  handleCurrentChange (pageNum: number) {
    this.pageNum = pageNum
    this.resetPage()
  }
}
</script>

<style scoped lang="scss">
.strench{
  display: flex;
  flex-direction: column;
}
 .design-header{
   width: 100%;
   padding: 10px 5px 15px;
   box-sizing: border-box;
   border-bottom: solid 1px $color-border-main;
   margin: 0 auto !important;
 }
 .table-feature{
   padding: $padding-default 0;
 }
 .mmp-trash{
   color: $color-second-red;
 }
 .table-design-border {
   flex: 1 0 300px;
 }
 /deep/ .el-table .el-table-header-tr{
   & th:nth-child(2) {
     text-align: center;
   }
   & th:nth-child(6) {
     text-align: center;
   }
 }
 /deep/ .el-table__row {
   & td:nth-child(2) .cell {
     text-align: center;
   }
   & td:nth-child(6) .cell{
     text-align: center;
   }
 }
</style>
