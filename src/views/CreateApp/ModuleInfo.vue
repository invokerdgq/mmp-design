<template>
 <el-container>
   <el-header>
     <el-radio-group v-model="type">
       <el-radio-button label="moduleInfo">模块信息</el-radio-button>
       <el-radio-button label="moduleChild" disabled>下级模块</el-radio-button>
       <el-radio-button label="pageList" disabled>页面列表</el-radio-button>
     </el-radio-group>
   </el-header>
   <el-main>
     <div v-if="type === 'moduleInfo'" class="module-info-content">
       <el-form :model="formData" ref="form" v-if="edit" key="1" :rules="rules">
         <el-form-item label="模块名称" label-width="80px" required prop="edit.title">
           <el-input v-model="formData.edit.title" :disabled="info.parentModuleId === '0'"></el-input>
         </el-form-item>
         <el-row :gutter="20" v-if="parentName">
           <el-col :span="12">
             <el-form-item label-width="80px" label="父模块">
               <el-input :value="parentName" disabled></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label-width="80px" label="创建时间">
               <el-date-picker
                 :value="info.createDate"
                 type="datetime"
                 disabled
               >
               </el-date-picker>
             </el-form-item>
           </el-col>
         </el-row>
         <el-form-item label="说明" label-width="80px">
           <el-input
             type="textarea"
             placeholder="请输入内容"
             v-model="formData.edit.description"
             maxlength="150"
             show-word-limit
           ></el-input>
         </el-form-item>
         <el-form-item>
           <div class="save-container"><el-button type="primary" @click="editModule" :disabled="isLoading">保存</el-button></div>
         </el-form-item>
       </el-form>
       <el-form :model="formData" ref="addForm" :rules="rules" v-else key="2">
         <el-form-item prop="create.title" label="模块名称" label-width="80px">
           <el-input v-model="formData.create.title"></el-input>
         </el-form-item>
         <el-row :gutter="20">
           <el-col :span="12">
             <el-form-item label-width="80px" label="父模块">
               <el-input :value="info.title" disabled></el-input>
             </el-form-item>
           </el-col>
           <el-col :span="12">
             <el-form-item label-width="80px" label="创建时间">
               <el-date-picker
                 :value="Date.now()"
                 type="datetime"
                 disabled
               >
               </el-date-picker>
             </el-form-item>
           </el-col>
         </el-row>
         <el-form-item label="说明" label-width="80px">
           <el-input
             type="textarea"
             placeholder="请输入内容"
             v-model="formData.create.description"
             maxlength="150"
             show-word-limit
           ></el-input>
         </el-form-item>
         <el-form-item>
           <div class="save-container"><el-button type="primary" @click="addModule" :disabled="isLoading">保存</el-button></div>
         </el-form-item>
       </el-form>
     </div>
     <div v-else-if="type === '下级模块'" class="module-info-content">

     </div>
     <div v-else class="module-info-content">

     </div>
   </el-main>
 </el-container>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import * as api from '@/api/page/featureDesign'

@Component({})
export default class ModuleInfo extends Vue {
  type = 'moduleInfo'
  reCreate = true
  isLoading = false
  formData = {
    edit: {
      title: '',
      description: '',
      id: '',
      parentModuleId: ''
    },
    create: {
      title: '',
      description: '',
      parentModuleId: ''
    }
  }

  @Prop() edit!: boolean
  @Prop() info!: any
  @Prop() allName: any
  @Prop() parentName!: string

  rules = {
    'create.title': [
      { validator: this.check, trigger: 'blur', required: true }
    ],
    'edit.title': [
      { validator: this.check, trigger: 'blur', required: true }
    ]
  }

  @Watch('info.id')
  handleNodeChange () {
    this.resetPage()
  }

  check (rule: any, value: '', callback: any) {
    if (value === '') {
      callback(new Error('模块名称不能为空'))
    }
    this.allName.forEach((item: any) => {
      if (item.title === value) {
        callback(new Error('模块名称已存在'))
      }
    })
    callback()
  }

  resetPage () {
    this.formData.edit.title = this.info.title
    this.formData.edit.description = this.info.description
    this.formData.edit.id = this.info.id
    this.formData.edit.parentModuleId = this.info.parentModuleId
    this.formData.create.title = ''
    this.formData.create.description = ''
    this.formData.create.parentModuleId = this.info.id
  }

  created () {
    this.resetPage()
  }

  async addModule () {
    (this.$refs.addForm as any).validate(async (valid: boolean) => {
      if (valid) {
        const params = new FormData()
        params.set('moduleJson', JSON.stringify(this.formData.create))
        params.set('optsBy', '中')
        this.isLoading = true
        await api.addModule(params)
        this.$message({
          type: 'success',
          message: '添加模块成功'
        })
        this.isLoading = false
        this.$emit('addModule')
      }
    })
  }

  editModule () {
    (this.$refs.form as any).validate(async (valid: boolean) => {
      if (valid) {
        const params = new FormData()
        params.set('moduleJson', JSON.stringify(this.formData.edit))
        params.set('optsBy', '中')
        this.isLoading = true
        await api.editModule(params)
        this.$message({
          type: 'success',
          message: '修改模块成功'
        })
        this.isLoading = false
        this.$emit('edit', 'module', this.formData.edit.title, this.formData.edit.description)
      }
    })
  }
}
</script>

<style scoped lang="scss">
 .module-info-content{
   padding: $padding-default $padding-large $padding-large;
 }
</style>
