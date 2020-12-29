<template>
 <el-container>
   <el-header>
     <el-radio-group v-model="type">
       <el-radio-button label="pageInfo">页面信息</el-radio-button>
       <el-radio-button label="authorizeConfig" disabled>权限配置</el-radio-button>
     </el-radio-group>
   </el-header>
   <el-main>
     <el-form :model="formData" :rules="rules" ref="form">
       <el-form-item label="名称" label-width="80px" prop="edit.title" v-show="edit">
         <el-input
           v-model="formData.edit.title"
           maxlength="25"
           show-word-limit
         ></el-input>
       </el-form-item>
       <el-row :gutter="20" v-show="edit">
         <el-col :span="12">
           <el-form-item label-width="80px" label="页面路由">
             <el-input
               v-model="formData.edit.route"
               maxlength="500"
               show-word-limit
             ></el-input>
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <el-form-item label-width="80px" label="创建时间">
             <el-date-picker
               :value="info.createDate"
               type="datetime"
               disabled
             ></el-date-picker>
           </el-form-item>
         </el-col>
       </el-row>
       <el-form-item label-width="80px" label="类型选择" required v-show="edit">
         <el-radio-group v-model="formData.edit.type">
           <el-radio :label="1">BI定制</el-radio>
           <el-radio :label="2">表单定制</el-radio>
           <el-radio :label="0" disabled>移动定制</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item label-width="80px" label="页面地址" prop="edit.url" v-show="edit">
         <el-input
           maxlength="500"
           show-word-limit
           v-model="formData.edit.url"
         >
           <el-button slot="append" type="text">请选择</el-button>
         </el-input>
       </el-form-item>
       <el-form-item label="说明" label-width="80px" v-show="edit">
         <el-input
           type="textarea"
           placeholder="请输入内容"
           v-model="formData.edit.description"
           maxlength="150"
           show-word-limit
         />
       </el-form-item>
       <el-form-item v-show="edit">
         <div class="save-container"><el-button type="primary" @click="editPage" :disabled="isLoading">保存</el-button></div>
       </el-form-item>
       <el-row :gutter="20" v-show="!edit">
         <el-col :span="12">
           <el-form-item label="名称" label-width="80px" prop="create.title">
             <el-input
               v-model="formData.create.title"
               maxlength="25"
               show-word-limit
             ></el-input>
           </el-form-item>
         </el-col>
         <el-col :span="12">
           <el-form-item label="页面路由" label-width="80px">
             <el-input
               v-model="formData.create.route"
               maxlength="500"
               show-word-limit
             ></el-input>
           </el-form-item>
         </el-col>
       </el-row>
       <el-form-item label-width="80px" label="类型选择" required v-show="!edit">
         <el-radio-group v-model="formData.create.type">
           <el-radio :label="1">BI定制</el-radio>
           <el-radio :label="2">表单定制</el-radio>
           <el-radio :label="0" disabled>移动定制</el-radio>
         </el-radio-group>
       </el-form-item>
       <el-form-item label-width="80px" label="页面地址" prop="create.url" v-show="!edit">
         <el-input
           maxlength="500"
           show-word-limit
           v-model="formData.create.url"
         >
           <el-button slot="append" type="text">请选择</el-button>
         </el-input>
       </el-form-item>
       <el-form-item label="说明" label-width="80px" v-show="!edit">
         <el-input
           type="textarea"
           placeholder="请输入内容"
           v-model="formData.create.description"
           maxlength="150"
           show-word-limit
         />
       </el-form-item>
       <el-form-item v-show="!edit">
         <div class="save-container"><el-button type="primary" @click="addPage" :disabled="isLoading">保存</el-button></div>
       </el-form-item>
     </el-form>
   </el-main>
 </el-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import * as api from '@/api/page/featureDesign'
import { WithParams, WithCheck } from '@/utils/helper'

@Component({})
@WithParams()
@WithCheck
export default class PageInfo extends Vue {
  type = 'pageInfo'
  isLoading = false
  formData = {
    edit: {
      title: '',
      route: '',
      type: 1,
      id: '',
      url: '',
      description: '',
      parentModuleId: ''
    },
    create: {
      title: '',
      route: '',
      type: 1,
      url: '',
      description: '',
      parentModuleId: ''
    }
  }

  rules = {
    'edit.title': [
      { validator: this.check('allName', 'title', '页面名称'), trigger: 'blur', required: true }
    ],
    'create.title': [
      { validator: this.check('allName', 'title', '页面名称'), trigger: 'blur', required: true }
    ],
    'create.url': [
      { required: true, trigger: 'blur', message: '页面地址不能为空' }
    ],
    'edit.url': [
      { required: true, trigger: 'blur', message: '页面地址不能为空' }
    ]
  }

  @Prop() edit!: boolean
  @Prop() info!: any
  @Prop() allName!: Array<any>

  @Watch('info.id')
  handleNodeChange () {
    this.resetPage();
    (this.$refs.form as any).clearValidate()
  }

  resetPage () {
    this.formData.edit.id = this.info.id
    this.formData.edit.title = this.info.title
    this.formData.edit.description = this.info.description
    this.formData.edit.route = this.info.route
    this.formData.edit.url = this.info.url
    this.formData.edit.parentModuleId = this.info.parentModuleId
    this.formData.create.title = ''
    this.formData.create.description = ''
    this.formData.create.route = ''
    this.formData.create.url = ''
    this.formData.create.parentModuleId = this.info.id
  }

  created () {
    this.resetPage()
  }

  addPage () {
    (this.$refs.form as any).validate(async (valid: boolean) => {
      if (valid) {
        this.isLoading = true
        await api.addPage(this.getParams(this.formData.create, { createBy: '中' }))
        this.$message({
          type: 'success',
          message: '添加页面成功'
        })
        this.isLoading = false
        this.$emit('addPage')
      }
    })
  }

  editPage () {
    (this.$refs.form as any).validate(async (valid: boolean) => {
      if (valid) {
        this.isLoading = true
        await api.editPage(this.getParams(this.formData.edit, { createBy: '中' }))
        this.$message({
          type: 'success',
          message: '修改页面成功'
        })
        this.isLoading = false
        this.$emit('edit', 'page')
      }
    })
  }
}
</script>

<style scoped lang="scss">

</style>
