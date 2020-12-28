<template>
  <el-dialog
    title = '编辑应用'
    :visible.sync = 'show'
    width="40%"
    v-if="show"
  >
 <el-form :label-position="labelPosition" label-width="80px"  class="dialog-edit" :rules="rules" :model="formData" ref="form">
  <el-form-item label="应用名称"  prop="title">
    <el-input
      type="text"
      v-model="formData.title"
      maxlength="50"
      show-word-limit
    ></el-input>
  </el-form-item>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item
         label="创建人"
        >
         <el-input disabled :value="appInfo.createBy"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间" class="date-pick">
            <el-date-picker
              disabled
              type="datetime"
              :value="appInfo.createDate"
            ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
   <el-form-item label="说明" class="dialog-last">
     <el-input
       type="textarea"
       placeholder="请输入内容"
       v-model="formData.description"
       maxlength="150"
       show-word-limit
     />
   </el-form-item>
 </el-form>
    <div slot="footer">
      <el-button @click="show = false;$message({ type: 'info', message: '已取消编辑', showClose: true })">取消</el-button>
      <el-button type="primary" @click="editConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { noRepeat } from '@/utils/validator'
import { Form } from 'element-ui'
import { editApp } from '@/api/page/home'
import Params from '@/utils/getParams'

@Component({})
@Params
export default class EditAppContent extends Vue {
  @Prop({ default: 'right' }) labelPosition!: string
  @Prop() appInfo!: any
  @Prop() showDialog!: boolean
  @Prop() list!: Array<any>
  formData = {
    description: '',
    title: '',
    id: '',
    coverimage: ''
  }

  rules = {
    title: [
      { validator: noRepeat(this.list, 'title'), trigger: 'blur', required: true }
    ]
  }

  created () {
    this.formData.title = this.appInfo.title
    this.formData.description = this.appInfo.desc
  }

  editConfirm () {
    (this.$refs.form as Form).validate(async (valid: any) => {
      if (valid) {
        this.formData.id = this.appInfo.id
        this.formData.coverimage = this.appInfo.coverimage
        // @ts-ignore
        await editApp(this.getParams(this.formData, '中'))
        this.$message({
          message: '编辑成功',
          type: 'success',
          showClose: true
        })
        this.show = false
        this.$emit('update')
      } else {
        console.log('error submit!!')
        return false
      }
    })
  }

  get show () {
    return this.showDialog
  }

  set show (val) {
    this.$emit('update:showDialog', val)
  }
}
</script>

<style scoped lang="scss">

</style>
