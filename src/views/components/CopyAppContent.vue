<template>
  <el-dialog
    title = '复制应用'
    :visible.sync = 'show'
    width="40%"
    v-if="show"
  >
  <el-form :label-position="labelPosition" label-width="80px"  class="dialog-edit" :model="formData" ref="form" :rules="rules">
    <el-form-item label="应用名称" prop="title">
      <el-input
       v-model="formData.title"
       type="text"
       maxlength="50"
       show-word-limit
      ></el-input>
    </el-form-item>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-form-item label="复制人">
         <el-input
           value="1111"
           disabled
         ></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="复制时间">
          <el-date-picker
            disabled
            type="datetime"
            :value="formData.createDate"
          ></el-date-picker>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="说明" class="dialog-last" prop="description">
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
      <el-button @click="show = false; $message( {message: '已取消复制', showClose: true})">取消</el-button>
      <el-button type="primary" @click="copyConfirm">确定</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Form } from 'element-ui'
import { copyApp } from '@/api/page/home'
import { WithParams, WithCheck } from '@/utils/helper'

@Component({})
@WithParams()
@WithCheck
export default class CopyAppContent extends Vue {
  @Prop({ default: 'right' }) labelPosition!: string
  @Prop() appInfo!: any
  @Prop() showDialog!: boolean
  @Prop() list!: Array<any>
  formData = {
    title: '',
    description: '',
    coverimage: '',
    createDate: 0
  }

  rules = {
    title: [
      { validator: this.check('list', 'title', '应用名称'), trigger: 'blur', required: true }
    ]
  }

  created () {
    this.formData.title = this.appInfo.title
    this.formData.description = this.appInfo.description
    this.formData.createDate = Date.now()
  }

  copyConfirm () {
    (this.$refs.form as Form).validate(async (valid: any) => {
      if (valid) {
        await copyApp(this.getParams(this.formData, { createBy: '中', sourceAppId: this.appInfo.id }))
        this.$message({
          message: '复制成功',
          type: 'success',
          showClose: true
        })
        this.show = false
        this.$emit('update')
      } else {
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
